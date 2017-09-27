import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {subscribe} from 'redux-subscriber';
import {Breadcrumb} from 'react-bootstrap';
import * as Global from '../utils/global';

class Nav extends Component {
	constructor() {
		super(...arguments);
		const {store} = this.props;
		this.store = store;

		this.state = {
			page: null,
			category: ''
		};
	}

	componentDidMount() {
		this.unsubscribe_post = subscribe('post', state => {
			this.setState({ category: state.post.category });
		});		
	}

	componetWillUnmount() {
		this.unsubscribe_post();
	}

	renderBreadcrumbs(page) {
		if(page) {
			const title = page.title;
			const category_path = '/' + this.state.category;

			if(page.pagetype === Global.PAGETYPE.CATEGORY) {
				return (
					<span>
						<Link to="/">Home</Link> <span>></span> {title}
					</span>
				);
			} else if(page.pagetype === Global.PAGETYPE.POST) {
				return (
					<span>
						<Link to="/">Home</Link> <span>></span> <Link to={category_path}>{this.state.category}</Link> <span>></span> {title}
					</span>
				);
			}
		}

		return (<Link to="/">Home</Link>);
	}

	render() {
		const {page} = this.props;
		const breadcrumbs = this.renderBreadcrumbs(page);

		return(
			<Breadcrumb>
				{breadcrumbs}
			</Breadcrumb>
		);
	}
}

export default Nav;
