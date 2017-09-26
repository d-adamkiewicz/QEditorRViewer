import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { adjustToRight, adjustToLeft } from '../utils/formatli'

class MyMarkup extends Component {
    render() {
        var parts = [];
        switch(this.props.myKey) {
            case 'first_name':
                parts = adjustToLeft(this.props.myItem, 10)           
            break;
            case 'last_name':
                parts = adjustToLeft(this.props.myItem, 15)           
            break;
            case 'pesel':
                parts = adjustToLeft(this.props.myItem, 11)           
            break;
            case 'text':
                parts = adjustToLeft(this.props.myItem, 256)           
            break;
            default:
                if (/id$/.test(this.props.myKey)) {
                    parts = adjustToRight(this.props.myItem, 4)           
                } else if (/note$/.test(this.props.myKey)) {
                    parts = adjustToLeft(this.props.myItem, 256)           
                } else if (/date$/.test(this.props.myKey)) {
                    parts = adjustToRight(this.props.myItem, 10)           
                } else if (/pdname|ddname$/.test(this.props.myKey)) {
                    parts = adjustToRight(this.props.myItem, 10)           
                } else if (/\w+\_\d+/.test(this.props.myKey)) {
                    parts = adjustToLeft(this.props.myItem, this.props.myKey.split('_')[1])           
                } else {
                    parts = adjustToLeft(this.props.myItem)           
                }
            break;
        }
        return (
            parts.length==1
            ?
            <span>{parts[0]}&nbsp;</span>
            :
            <span>{parts[0]}&nbsp;<a href="#" title={parts[1]}>...</a>{parts[2]}</span>
        )   
    }
}

export default class Outcome extends Component {
	constructor(props) {
		super(props)
		this.state = { limit: 5, clicked: null, activeId: this.props.active.id }
		// bind needed if you intend to use handler as
		// onClick={this.onClick} 
		// but no longer if
		// onClick={ev => this.onClick(ev)}
		//this.scrollOnMouseOver = this.scrollOnMouseOver.bind(this)
		this.onMouseOver = this.onMouseOver.bind(this)
	}

	getElTypeOf(node, type) { 
		if (node.nodeName == type) {
			return node
		} else {
			// it won't work without return !!!
			return this.getElTypeOf(node.parentElement, type) 
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log('componentWillReceiveProps',this.props.active.id, this.state.activeId);
		if (this.props.active.id != this.state.activeId) {
			Array.from(this.state.clicked.childNodes).map(item=>{return Array.from(item.childNodes).map(elm=>{if (elm.nodeName=="SPAN"){return elm}})[0]}).forEach(el=>el.style.backgroundColor = 'transparent')
			this.setState({activeId: this.props.active.id});
		}
	}

	onClick(ev, index) {
		let li = this.getElTypeOf(ev.target, 'LI')
			, aLiChilds = Array.from(li.childNodes)
			, aSpans = aLiChilds.map(item=>{return Array.from(item.childNodes).map(elm=>{if (elm.nodeName=="SPAN"){return elm}})[0]});
		if (this.state.clicked) {
		//	this.state.clicked.style.backgroundColor = 'transparent'
			Array.from(this.state.clicked.childNodes).map(item=>{return Array.from(item.childNodes).map(elm=>{if (elm.nodeName=="SPAN"){return elm}})[0]}).forEach(el=>el.style.backgroundColor = 'transparent')

		}
		aSpans.forEach(el=>el.style.backgroundColor = '#cdcdcd')
		//li.style.backgroundColor = '#cdcdcd';
		this.state.clicked = li;	
	}

	scrollOnMouseOver(ev, dir) {
		if (dir == 'left') {
			this.ulEl.scrollLeft = 0
		} else if (dir == 'right') {
			let maxScrollLeft = this.ulEl.scrollWidth - this.ulEl.clientWidth;
			this.ulEl.scrollLeft = maxScrollLeft
		}
	}
	
	onMouseOver(ev) {
		let li = this.getElTypeOf(ev.target, 'LI')
		if (li.dataset.lastrow == true) {
			this.setState({ limit: this.state.limit + 1})
		}
	}

	render() {
		const { outcome } = this.props 
        const divStyle = {
            width: '800px' //'550px'
			, paddingBottom: '1em'
        }
		const ulStyle = {
			listStyleType: 'none'
            //, overflowX: 'scroll'
            , overflowX: 'hidden'
            , overflowY: 'hidden'
            , border: '1px solid black'
            //, padding: '0 0.5em'
            , padding: '0'
			, width: 'auto'
			//, height: '15em'
			, lineHeight: '1em'
			, margin: 0
            , zoom: 1
            , position: 'relative'
            , cursor: 'pointer'
		}
        // this removes line break for '-' character in Chrome
        const spanStyle = {
            whiteSpace: 'nowrap'
			, backgroundColor: 'transparent'
        }
        // use of <nobr></nobr> because 'nowrap' doesn't work for fixed fonts in IE11
		if (outcome.status == "success") {
			return (
				<div style={divStyle}>
				<h4>{outcome.status}</h4>
					<ul style={ulStyle}  ref={(el) => { this.ulEl = el; }}>
						{outcome.result.rows.slice(0, this.state.limit).map((row, index, array) =>
							<li key={index} data-lastrow={index+1==array.length?1:0} onMouseOver={this.onMouseOver} onClick={ev=>this.onClick(ev)}>{Object.keys(row).map((key, i, a) => <nobr key={index+'_'+i}><span style={spanStyle}><MyMarkup key={key+'_'+index} myItem={row[key]} myKey={key} /></span></nobr>)}</li>
						)}
					</ul>
					<div onMouseOver={(ev)=>this.scrollOnMouseOver(ev, 'left')} style={{float: 'left'}}>&lt;</div>
					<div onMouseOver={(ev)=>this.scrollOnMouseOver(ev, 'right')} style={{float: 'right'}}>&gt;</div>
				</div>
			)
		} else {
			let trans = Object.keys(outcome.result.error).map(item=>({label: item, message: outcome.result.error[item]}))
			return (
				<div style={divStyle}>
				<h4>{outcome.status}</h4>
					<ul style={ulStyle}>
						{trans.slice(0, this.state.limit).map((row, index, array) => 
							<li key={index} data-lastrow={index+1==array.length?1:0} onMouseOver={this.onMouseOver} onClick={ev=>this.onClick(ev)}>{Object.keys(row).map((key, i, a) => <nobr key={index+'_'+i}><span style={spanStyle}><MyMarkup key={key+'_'+index} myItem={row[key]} myKey={key} /></span></nobr>)}</li>
						)}
					<div onMouseOver={(ev)=>this.scrollOnMouseOver(ev, 'left')} style={{float: 'left'}}>&lt;</div>
					<div onMouseOver={(ev)=>this.scrollOnMouseOver(ev, 'right')} style={{float: 'right'}}>&gt;</div>
					</ul>
				</div>
			)
		}
	}
}

Outcome.propTypes = {
	outcome: PropTypes.object.isRequired	
}
