import React, {Component} from 'react';
import {connect} from 'react-redux';
import {subscribe} from 'redux-subscriber';
import update from 'immutability-helper';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import * as Global from '../utils/global';
import {getCategories, changePagetype} from '../actions';

class CategoryCol extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			categories: []
		};
		
		const {store} = this.props;
		this.store = store;
	}

	componentDidMount() {
		const {getCategories} = this.props;

		this.unsubscribe_state_categories = subscribe('categories', state => {
			const new_state = update(this.state.categories, {$set: state.categories});
			this.setState({ categories: new_state });
		});

		getCategories();		
	}

	componentWillUnmount() {
		this.unsubscribe_state_categories();
	}

	renderCategories(categories) {
		if(categories.length === 0) {
			return (<Row key="none_row" className="show-grid">Empty<Col key="none_col"></Col></Row> );
		}

		const sorted_categories = Global.sortCopy(categories);
		return sorted_categories.map((category, index) => {
			const to_path = '/' + category.path;
			const col_key = 'col_' + category.name;
			const link_key = 'link_' + category.name;
			return (
				<Row key={index} className="show-grid">
					<Col key={col_key}>
						<Link
							key={link_key}
							to={to_path}
						>
							{category.name}
						</Link>
					</Col>
				</Row>
			);
		});
	}

	render() {
		const title = (<span><h3>Categories</h3></span>);
		const categories = this.renderCategories(this.state.categories);

		return(
			<Panel header={title}>
 				<Grid key="grid">{categories}</Grid>
    		</Panel>			
		);
	}
}

function mapDispatchToProps (dispatch) {
	return {
		getCategories: () => dispatch(getCategories())
	}
}


export default connect(null, mapDispatchToProps)(CategoryCol);
