import React, { Component, PropTypes } from 'react'

class Category extends Component {
	render () {
		const buttonStyle = {
			marginRight: '1em'
			, fontSize: '120%'
			, fontFamily: 'Consolas,"Courier New","Liberation Mono",monospace'
		}
		const  { id, onClickHandler } = this.props
		return (
			// for God's sake don't do it this way, this way handler will be called instantly
			//<button onClick={onClickHandler(id)} style={buttonStyle}>{id}</button>

			<button onClick={() => onClickHandler(id)} style={buttonStyle}>{id}</button>
		)
	}
}

export default class ManageSqlTexts extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            defaultSqlText: this.props.defaultSqlText 
			, updateKey: this.props.active.updateKey
        }
    }
    handleChange(e) {
        this.setState({ defaultSqlText: e.target.value })
    }
    componentWillReceiveProps(nextProps) {
		console.log('componentWillReceiveProps')
        //if (nextProps.defaultSqlText !== this.props.defaultSqlText || nextProps.defaultSqlText !== this.state.defaultSqlText) {
		if (nextProps.active.updateKey !== this.props.active.updateKey) {
            this.setState({defaultSqlText: nextProps.defaultSqlText})
        }
    }
	render() {
		const { 
                active
				, cats
				, onAddButtonClick 
                , onChangeButtonClick
				, onRunButtonClick
				, onCatButtonClick
				} = this.props 
        const divStyle = {
				margin: '0 0 0.5em'
		}
		, textAreaStyle = {
           width: '785px' //'535px' 
           , padding: '0.5em'
           , border: '1px solid black'
			, fontFamily: 'Consolas,"Courier New","Liberation Mono",monospace'
        }
		, buttonStyle = {
			marginRight: '1em'
			, fontSize: '120%'
			, fontFamily: 'Consolas,"Courier New","Liberation Mono",monospace'
		}
		// use of 'ref' attribute in order to clear textare value
 		return (
			<div style={divStyle}>
			<textarea spellCheck="false" rows="10" autoComplete="off" style={textAreaStyle} value={this.state.defaultSqlText} 
				onChange={ this.handleChange.bind(this) } ref={textarea=>this.sqltext = textarea} /><br/>
			<button style={buttonStyle} onClick={ () => onAddButtonClick(this.state.defaultSqlText) }>Add</button>
			<button style={buttonStyle} onClick={ () => onChangeButtonClick(active.id, this.state.defaultSqlText) }>Change</button>
			<button style={buttonStyle} onClick={ () => onRunButtonClick(this.state.defaultSqlText) }>Run</button>
			<button style={buttonStyle} onClick={ () => { this.sqltext.value = '' } }>Clear</button>
			<div style={{display: 'inline'}}>
					{cats.map((item) =>
						<Category onClickHandler={onCatButtonClick} id={item.id} key={item.id} />
					)}
			</div>
			</div>
		)
	}
}

ManageSqlTexts.PropTypes = {
	defaultSqlText: PropTypes.string.isRequired
	, onAddButtonClick: PropTypes.func.isRequired
	, onRunButtonClick: PropTypes.func.isRequired
}
