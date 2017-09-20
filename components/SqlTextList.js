import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { adjustToRight } from '../utils/formatli'

class ListItem extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = { hover: false };
        this.toggleHover = this.toggleHover.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.onMouseOut = this.onMouseOut.bind(this)
    }
    toggleHover() {
        if (this.state.hover) {
            return { backgroundColor: "#cdcdcd" }
        } else {
            return { backgroundColor: "white" }
        }
    }
    onMouseOver() {
        this.setState({ hover: true })
    }
    onMouseOut() {
        this.setState({ hover: false })
    }
    render() {
        let liStyle = { 
			borderBottom: "1px dotted #000" 
		}
        let spanStyle = { backgroundColor: "#ff7676" }
        const { sqlText, onLiClick } = this.props
/*
    notice, important!: parentheses () in
    style={this.toggleHover()}
*/
        return (
			<li style={Object.assign({}, liStyle, this.toggleHover())} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={() => onLiClick(sqlText.id)}><span style={spanStyle}>{adjustToRight(sqlText.id,3)}:</span>{sqlText.text}</li>
        )
    }
}

export default class SqlTextList extends Component {
	render() {
		const { catId, sqlTexts, onLiClick } = this.props 
		const spanStyle = {
			background: '#cdcdcd'
			, padding: '0.5em'
		}
		, ulStyle = {
			listStyleType: 'none'
            , overflow: 'auto'
            , border: '1px solid black'
            , width: '785px' //'535px'
            , float: 'left'
            , padding: '0.5em'
			, marginTop: '0.5em'
            , zoom: 1
            , position: 'relative'
            , cursor: 'pointer'
		}
    	return (
			<div>
			<span style={spanStyle}>{catId}</span>
			<br/>
			<ul style={ulStyle}>
				{sqlTexts.map((sqlText) =>
//notice! key props
                    <ListItem key={sqlText.id} sqlText={sqlText} onLiClick={onLiClick} />
				)}
			</ul>
			</div>
		)
	}
}

SqlTextList.propTypes = {
	sqlTexts: PropTypes.array.isRequired	
	, onLiClick: PropTypes.func.isRequired
}
