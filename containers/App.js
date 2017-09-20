import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
		setActive
		, changeCategory
		//, addSqlTextAndSetActive
		, insertSqlText
        , updateSqlText
		, sendSql 
		} from '../actions'
import ManageSqlTexts from '../components/ManageSqlTexts'
import SqlTextList from '../components/SqlTextList'
import Outcome from '../components/Outcome'

class App extends Component {
	constructor(props) {
		super(props)
		this.onAddButtonClick = this.onAddButtonClick.bind(this)
		this.onRunButtonClick = this.onRunButtonClick.bind(this)
        this.onChangeButtonClick = this.onChangeButtonClick.bind(this)
		this.onLiClick = this.onLiClick.bind(this)
		this.onCatButtonClick = this.onCatButtonClick.bind(this)
	}

	componentDidMount() {
		/* 
		* to get dispatch and som props
		* const { dispatch, someProp } = this.props
		*/
	}

	componentWillReceiveProps(nextProps) {
		/*
 		* this comparison: 
		* nextProps.someProp !== this.props.someProp
		* if next is diffrent do something, dispatch action eg
		*	const { dispatch, someAnotherProp } = nextProps
		*	dispatch(someAction(somAnotherProp))	
		*/
	}

	onAddButtonClick(value) {
		//this.props.dispatch(addSqlTextAndSetActive(value.trim()))
		this.props.dispatch(insertSqlText(value.trim()))
	}
	
	onRunButtonClick(sqlText) {
		this.props.dispatch(sendSql(sqlText))
// scroll to bottom of page
//window.scrollTo(0,document.body.scrollHeight)

		window.scrollTo(0,0)
	}

    onChangeButtonClick(id, value) {
        this.props.dispatch(updateSqlText(id, value.trim()))
    }

	onLiClick(id) {
		const { dispatch } = this.props
		dispatch(setActive(id))
// scroll to top of page
        window.scrollTo(0,0);
	}

	onCatButtonClick(id) {
		const { dispatch } = this.props
		dispatch(changeCategory(id))
	}

  render() {
    const { active, cats, catId, sqlTexts, defaultSqlText, outcome } = this.props
	const zeroLengthSqlTexts = sqlTexts.length === 0
    const noOutcome = Object.keys(outcome).length === 0
	// this works on Android (LG) Chrome
	const divStyle = {
		fontFamily: 'Consolas,"Courier New","Liberation Mono",monospace'
	}
    return (
      <div style={divStyle}>
		{ noOutcome
            ? <h4>No result yet</h4>
            : <Outcome outcome = { outcome } /> 
        }
		<ManageSqlTexts 
            active = { active }
			cats = { cats }
			defaultSqlText = { defaultSqlText } 
			onAddButtonClick = { this.onAddButtonClick }
			onChangeButtonClick = { this.onChangeButtonClick }
			onRunButtonClick = { this.onRunButtonClick }
			onCatButtonClick = { this.onCatButtonClick }
		/>
		{ zeroLengthSqlTexts
			? <h4>No sql texts</h4>
			: <div>
				<SqlTextList catId={catId} sqlTexts={sqlTexts} onLiClick={this.onLiClick} />
				</div>
		}
      </div>
    )
  }
}

//
App.propTypes = {
	active: PropTypes.object.isRequired
	, cats: PropTypes.array.isRequired
	, catId: PropTypes.number.isRequired
	, sqlTexts: PropTypes.array.isRequired
	, defaultSqlText: PropTypes.string.isRequired
    , outcome: PropTypes.object.isRequired
	, dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  	const { active, cats, catId, sqlTexts, outcome } = state
	const filtered = sqlTexts.filter(item=>item.id==active.id)
	const defaultSqlText = filtered.length ?  filtered.shift().text : ''; 
	console.dir(active)
	console.log('mapStateToProps:', defaultSqlText)

	return {
		active
		, cats
		, catId
		, sqlTexts
		, defaultSqlText
        , outcome
	}
}

export default connect(mapStateToProps)(App)
