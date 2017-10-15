import React, {Component} from 'react'
import {connect} from 'react-redux'
import update from 'immutability-helper'
import {subscribe} from 'redux-subscriber'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import * as Global from '../utils/global'
import {getCategories} from '../actions'

class CategoryCol extends Component {	
	constructor() {
		super(...arguments)
		this.state = {
			categories: []
		}
	}	

	componentWillMount() {		
		const {getCategories} = this.props

		this.unsubscribe_state_categories = subscribe('categories', state => {
			const new_state = update(this.state.categories, {$set: state.categories})
			this.setState({ categories: new_state })
		})

		getCategories()		
	}

	componentWillUnmount() {
		this.unsubscribe_state_categories()
	}
/*
	onChangeCategory(category) {
		updateSelectedCategory(category.name)
	}
	*/

	renderCategories(categories) {
		if(categories.length === 0) {
			return (<Row key="none_row" className="show-grid">Empty<Col key="none_col"></Col></Row> )
		}

		const sorted_categories = Global.sortCopy(categories)
		return sorted_categories.map((category, index) => {
			const to_path = '/' + category.path;
			const col_key = 'col_' + category.name;
			const link_key = 'link_' + category.name;
			return (
				<Row key={index} className="show-grid">
					<Col key={col_key}>
						<span>
							<Link
								key={link_key}
								to={to_path}
							>
								{category.name}
							</Link>
						</span>
					</Col>
				</Row>
			);
		});
	}

	render() {
		const { categories } = this.props

		const title = (<span><h3>Categories</h3></span>)
		const categories_list = this.renderCategories(categories)

		return(
			<Panel header={title}>
 				<Grid key="grid">{categories_list}</Grid>
    		</Panel>			
		)
	}
}

function mapDispatchToProps (dispatch) {
	return {
		getCategories: () => dispatch(getCategories()),
		//updateSelectedCategory: (category) => dispatch(updateSelectedCategory(category))
	}
}

function mapStateToProps({ categories, page }) {
	return {
		categories,
		page
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryCol);
