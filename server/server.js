import path from 'path'
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.config')

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../store/configureStore'
import App from '../containers/App'

var app = new (require('express'))()
var port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var favicon = require('serve-favicon');

var pg = require('pg')
	, nconf = require('nconf');

nconf.file({ file: 'auth.hjson', format: require('hjson') });
var pgConfig = nconf.get('pg');

var pool = new pg.Pool(pgConfig);

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
// server/favicon.ico
app.use(favicon(__dirname + '/favicon.ico'));

// method ('GET') and url ('/') specific middleware
app.get('/', handleRender)
// this handler will be called twice on Chrome, because of favicon.ico bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=131567
// UNLESS we use 'serve-favicon' https://github.com/expressjs/serve-favicon
function handleRender(req, res) {
    console.log('originalUrl' + req.originalUrl)
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error(err);
        }
		client.query('select cat_id from active_category', function(err, result) {
			let catId = result.rows[0].cat_id;
			renderByCatId(res, req, client, done, catId, renderHTML);
		});
    });
}

function renderByCatId(res, req, client, done, catId, callback) {
	// custom sorting
	client.query('select id, text, case when cat_id is null then 0 else id end as myid from sqls where cat_id=$1 or cat_id is null order by myid', [catId], function(err, result) {
		if (err) {
			return console.error(err);
		}
		console.log('catId', catId)
		let sqlTexts = result.rows
		client.query('select sqls_id as id from active', function(err, result) {
			if (err) {
				return console.error(err);
			}
			let active  = result.rows[0] 
			client.query('select id, name from category order by id', function(err, result) {
				//call `done()` to release the client back to the pool
				// we release client at third query
				done();
				if (err) {
					return console.error(err);
				}
				let cats = result.rows;
				// Compile an initial state
				const state = { active, sqlTexts, catId, cats } 
				callback(res, state)
			});
		});
	});
}

function renderHTML(res, preloadedState) {
		console.log(JSON.stringify(preloadedState))
		// Create a new Redux store instance
		const store = configureStore(preloadedState)

		// Render the component to a string
		const html = renderToString(
		  <Provider store={store}>
			<App />
		  </Provider>
		)

		// Grab the initial state from our Redux store
		const finalState = store.getState()

		// Send the rendered page back to the client
		res.send(renderFullPage(html, finalState))
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
		<meta charset="utf-8">
        <title>Redux</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

app.post('/insertSqlText', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
			res.json({ status: 'failure' })
			return console.error(err)
        }
        client.query('INSERT INTO sqls (text, cat_id) VALUES ($1, (select cat_id from active_category)) RETURNING id', [req.body.sqlText], function(err, result) {
			if (err) {
				res.json({ status: 'failure' })
				return console.error(err)
			}
            let id = result.rows[0].id;
            client.query('UPDATE active SET sqls_id=$1 RETURNING sqls_id', [id], function(err, result) {
                if (result.rows.length!=0) {
                    //call `done()` to release the client back to the pool
                    done();
                    if (err) {
                        res.json({ status: 'failure' })
                        return console.error(err)
                    }
                    console.log('insertSqlText', result.rows)
                    res.json({ status: 'success', result: result })
                } else {
                    client.query('INSERT INTO active (sqls_id) VALUES($1) RETURNING sqls_id', [id], function(err, result) {
                         //call `done()` to release the client back to the pool
                        done();
                        if (err) {
                            res.json({ status: 'failure' })
                            return console.error(err)
                        }
                        console.log('insertSqlText', result.rows)
                        res.json({ status: 'success', result: result })
                    });
                }
            });
   		})
    })
})

app.post('/updateSqlText', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
			res.json({ status: 'failure' })
			return console.error(err)
        }
        //client.query(`UPDATE sqls SET text='${req.body.sqlText}' WHERE id=${req.body.id} RETURNING id`, function(err, result) {
        client.query('UPDATE sqls SET text=$1, cat_id=(select cat_id from active_category) WHERE id=$2 RETURNING id', [req.body.sqlText, req.body.id], function(err, result) {
			if (err) {
				res.json({ status: 'failure' })
				return console.error(err)
			}
            let id = result.rows[0].id;
            client.query('UPDATE active SET sqls_id=$1 RETURNING sqls_id', [id], function(err, result) {
                if (result.rows.length!=0) {
                    //call `done()` to release the client back to the pool
                    done();
                    if (err) {
                        res.json({ status: 'failure' })
                        return console.error(err)
                    }
                    console.log('updateSqlText', result.rows)
                    res.json({ status: 'success', result: result })
                } else {
                    client.query('INSERT INTO active (sqls_id) VALUES($1) RETURNING sqls_id', [id], function(err, result) {
                         //call `done()` to release the client back to the pool
                        done();
                        if (err) {
                            res.json({ status: 'failure' })
                            return console.error(err)
                        }
                        console.log('updateSqlText', result.rows)
                        res.json({ status: 'success', result: result })
                    });
                }
            });
		})
 
    })
})


app.post('/sendSql', function(req, res) {
	pool.connect(function(err, client, done) {
		if (err) {
			res.json({ status: 'failure' })
			return console.error(err)
		}
		client.query(req.body.sqlText, function(err, result) {
			//call `done()` to release the client back to the pool
			done();
			if (err) {
				res.json({ status: 'failure', result: {error: err} })
				return console.error(err)
			}
			console.log(result.rows)
    		res.json({ status: 'success', result: result })
		})
	})
})

function sendJSON(res, state) {
	res.json(state);
}

app.post('/changeCategory', function(req, res) {
	pool.connect(function(err, client, done) {
        if (err) {
            return console.error(err);
        }

		renderByCatId(res, req, client, done, req.body.id, sendJSON);
	//	console.log(req.body.id)
	//	res.json({ id: req.body.id })
	})
})

pool.on('error', function (err, client) {
	// if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
