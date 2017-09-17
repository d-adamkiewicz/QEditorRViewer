export const ADD_SQL_TEXT = 'ADD_SQL_TEXT'
export const UPDATE_SQL_TEXT = 'UPDATE_SQL_TEXT'
export const SET_ACTIVE = 'SET_ACTIVE'
export const GET_OUTCOME = 'GET_OUTCOME'
export const CHANGE_CAT_ID = 'CHANGE_CAT_ID'
export const SET_SQLTEXTS = 'SET_SQLTEXTS'
export const SET_CATS = 'SET_CATS'
export const CLEAR_OUTCOME = 'CLEAR_OUTCOME'


/*
 in order to get 'dispatch()' method 
 you need to return anonymous function
 this function will receive (dispatch, getState) 
*/
export function addSqlText(id, text) {
    return {
        type: ADD_SQL_TEXT 
        , id       
        , text
    }   
}

export function changeSqlText(id, text) {
    return {
        type: UPDATE_SQL_TEXT 
        , id       
        , text
    }   
}

export function setActive(id) {
    return {
        type: SET_ACTIVE
        , id
    }
}

export function insertSqlText(sqlText) { 
    return (dispatch, getState) => {
        fetch('/insertSqlText', {
            headers: {
                'Accept': 'application/json'
                , 'Content-Type': 'application/json'
            }
            //, mode: 'same-origin', 'cors', default: 'no-cors'
            , method: 'POST'
            , body: JSON.stringify({ sqlText })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (json.status == 'success') {
                dispatch(addSqlText(json.result.rows[0].sqls_id, sqlText))
                dispatch(setActive(json.result.rows[0].sqls_id))
            }
        }).catch(function(e) {
            console.log('parsing failed', e)
        });
     } 
}

export function updateSqlText(id, sqlText) { 
    return (dispatch, getState) => {
        fetch('/updateSqlText', {
            headers: {
                'Accept': 'application/json'
                , 'Content-Type': 'application/json'
            }
            //, mode: 'same-origin', 'cors', default: 'no-cors'
            , method: 'POST'
            , body: JSON.stringify({ id, sqlText })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (json.status == 'success') {
                dispatch(changeSqlText(json.result.rows[0].sqls_id, sqlText))
                dispatch(setActive(json.result.rows[0].sqls_id))
            }
        }).catch(function(e) {
            console.log('parsing failed', e)
        });
     } 
}

export function sendSql(sqlText) {
    return (dispatch, getState) => {
    	fetch('/sendSql', {
            headers: {
                'Accept': 'application/json'
                , 'Content-Type': 'application/json'
            }
            //, mode: 'same-origin', 'cors', default: 'no-cors'
            , method: 'POST'
            , body: JSON.stringify({ sqlText })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
           dispatch(getOutcome(json)) 
        }).catch(function(e) {
            console.log('parsing failed', e)
        });
     } 
}

function getOutcome(json) {
	return {
		type: GET_OUTCOME
		, outcome: json
	}
}

function clearOutcome() {
	return {
		type: CLEAR_OUTCOME
	}
}

export function changeCategory(id) {
	return (dispatch) => {
		fetch('/changeCategory', {
            headers: {
                'Accept': 'application/json'
                , 'Content-Type': 'application/json'
            }
            //, mode: 'same-origin', 'cors', default: 'no-cors'
            , method: 'POST'
            , body: JSON.stringify({ id })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            dispatch(changeCategoryId(json.catId)) 
			// order is important 1, 2
            dispatch(setSQLTexts(json.sqlTexts)) //1
            dispatch(setActive(json.active.id)) //2
            dispatch(setCats(json.cats)) 
			// clear
			dispatch(clearOutcome({}))
        }).catch(function(e) {
            console.log('parsing failed', e)
        });

	}
}

function changeCategoryId(id) {
	return {
		type: CHANGE_CAT_ID
		, catId: id 
	}
}

function setSQLTexts(sqlTexts) {
	return {
		type: SET_SQLTEXTS
		, sqlTexts 
	}
}

function setCats(cats) {
	return {
		type: SET_CATS
		, cats 
	}
}
