import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changePagetype} from '../actions/page'
import CategoryCol from './CategoryCol'
import PostCol from './PostCol'
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
		return(
			<div>
				<CategoryCol></CategoryCol>
				<PostCol page={this.state.page}></PostCol>
			</div>
		)
	}
}

//export default connect(null, { actions })(Home)
export default connect(null)(Home)
