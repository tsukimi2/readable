import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changePagetype} from '../actions';
import * as Global from '../utils/global';
import PostCol from './PostCol';

class Category extends Component {
	constructor() {
		super(...arguments);
		const {store, location, page } = this.props;
		this.store = store;
		this.title = location.pathname.substring(1);

		this.state = {
			page: {
				pagetype: Global.PAGETYPE.CATEGORY,
				title: this.title
			}
		};
	}

	componentDidMount() {
		this.store.dispatch(changePagetype(Global.PAGETYPE.CATEGORY, this.title));
	}

	render() {
		const {page, store} = this.props;

		return(
			<div>
				<PostCol page={this.state.page} store={store}></PostCol>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		page: state.page
	};
}

export default connect(mapStateToProps)(Category);
