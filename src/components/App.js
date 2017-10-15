import React, { Component } from 'react'
import update from 'immutability-helper'
import {subscribe} from 'redux-subscriber'
import {Navbar, NavDropdown, Nav, MenuItem} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import '../App.css'
import * as Global from '../utils/global'
import MyNav from './MyNav'
import {getCategories} from '../actions/categories'

class App extends Component {
	constructor() {
		super(...arguments)
		this.state = {
			selected_category: Global.All,
			categories: []
		}
	}

	componentWillMount() {
		const { location } = this.props
		let selected_category = this.getCategoryFromLoc(location)
		if(selected_category === '') {
			selected_category = Global.All
		} else if (selected_category === null) {
			selected_category = ''
		}

		this.unsubscribe_state_categories = subscribe('categories', state => {
			const new_state = update(this.state.categories, {$set: state.categories})
			this.setState({ categories: new_state })
		})

		this.unsubscribe_state_page = subscribe('page', state => {		
			let selected_category = ''
			if(state.page.pagetype === Global.PAGETYPE.DEFAULT) {
				selected_category = Global.All		
			} else if(state.page.pagetype === Global.PAGETYPE.CATEGORY) {
				selected_category = state.page.title
			}

			this.setState({ selected_category: selected_category })
		})

		this.props.dispatch(getCategories())
	}

	componentWillUnmount() {
		this.unsubscribe_state_categories()
		this.unsubscribe_state_page()
	}

	getCategoryFromLoc(location) {
		if(location && location.pathname) {
			const first_index = location.pathname.indexOf('/', 1)
			const tmp = location.pathname.substr(1, first_index - 1)

			if(tmp !== 'posts') {
				const begin_index = location.pathname.lastIndexOf('/') + 1
				return location.pathname.substring(begin_index)
			} else {
				return null
			}
		}

		return ''
	}

	render() {
		const { page } = this.props
		const { categories, selected_category } = this.state
		const dropdown_label = 'Category: ' + selected_category

		const menuitem_all_link_key = 'link_' + Global.All + '.name'
		const menuitem_all_to_path = '/'
		const MenuItemAll = () => (
			<Link
				key={menuitem_all_link_key}
				to={menuitem_all_to_path}
			>
				{Global.All}
			</Link>
		)

		return (
			<div>
				<Navbar inverse collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<span>{Global.APPNAME}</span>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavDropdown eventKey={3} title={dropdown_label} id="basic-nav-dropdown">
								<MenuItem key={Global.All} value={Global.All}><MenuItemAll /></MenuItem>
								{
									categories.map(category => {
										const link_key = 'link_' + category.name
										const to_path = '/' + category.path

										const LinkCategory = () => (
											<Link
												key={link_key}
												to={to_path}
											>
												{category.name}
											</Link>
										)

										return(
											<MenuItem key={category.name} value={category.name}>
												<LinkCategory />
											</MenuItem>
										)
									})			
								}
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
  				<MyNav page={page}></MyNav>
  			</div>
    	);
		
	}
}

function mapStateToProps({ page, selected_category }) {
	return {
		page,
		selected_category
	}
}

export default connect(mapStateToProps)(App);
