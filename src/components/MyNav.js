import React, {Component} from 'react'
import {connect} from 'react-redux'
import {subscribe} from 'redux-subscriber'
import {Link} from 'react-router-dom'
import {Breadcrumb} from 'react-bootstrap'
import * as Global from '../utils/global'
//import {updateSelectedCategory} from '../actions/categories'

class MyNav extends Component {
	constructor() {
		super(...arguments)
		const {store} = this.props
		this.store = store

		this.state = {
			page: null,
			category: ''
		}
	}

	componentDidMount() {
		this.unsubscribe_post = subscribe('post', state => {
			this.setState({ category: state.post.category })
		})
	}

	componetWillUnmount() {
		this.unsubscribe_post()
	}

	renderBreadcrumbs(page, category) {
		if(page) {
			const title = page.title
			const category_path = '/' + category

			if(page.pagetype === Global.PAGETYPE.CATEGORY) {
				return (
					<span>
						<Link to="/">Home</Link> <span>></span> {title}
					</span>
				)
			} else if(page.pagetype === Global.PAGETYPE.POST) {
				return (
					<span>
						<span><Link to="/">Home</Link></span> <span>></span> <span><Link to={category_path}>{this.state.category}</Link></span> <span>></span> {title}
					</span>
				)
			}
		}

		return (<Link to="/">Home</Link>);
	}

	render() {
		const {page} = this.props
		const {category} = this.state
		const breadcrumbs = this.renderBreadcrumbs(page, category)

		return(
			<Breadcrumb>
				{breadcrumbs}
			</Breadcrumb>
		);
	}
}

function mapStateToProps({}, {page}) {
	return {
		page
	}
}

export default connect(mapStateToProps)(MyNav);
