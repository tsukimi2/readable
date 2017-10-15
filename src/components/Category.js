import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changePagetype} from '../actions'
import * as Global from '../utils/global'
import PostCol from './PostCol'

class Category extends Component {
	constructor() {	
		super(...arguments)
		const { location } = this.props
		this.title = location.pathname.substring(1)
		this.state = {
			page: {
				pagetype: Global.PAGETYPE.CATEGORY,
				title: this.title				
			}			
		}
	}

	componentWillMount() {
		this.props.dispatch(changePagetype(Global.PAGETYPE.CATEGORY, this.title));

	}

	render() {
		return(
			<div>
				<PostCol page={this.state.page}></PostCol>
			</div>
		);
	}
}

export default connect(null)(Category);
