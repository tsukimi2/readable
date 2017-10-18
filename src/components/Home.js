import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changePagetype} from '../actions/page'
import PostCol from './PostCol'
import CategoryCol from './CategoryCol'
import * as Global from '../utils/global'

class Home extends Component {
	constructor() {	
		super(...arguments)
		this.state = {
			page: {
				pagetype: Global.PAGETYPE.DEFAULT,
				title: ''				
			}			
		}
	}

	componentWillMount() {
		this.props.dispatch(changePagetype(Global.PAGETYPE.DEFAULT, ''))
	}

	render() {
		const {page} = this.state

		return(
			<div>
 				<CategoryCol />			
				<PostCol page={page} />
			</div>
		)
	}
}

export default connect(null)(Home)
