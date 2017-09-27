import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changePagetype} from '../actions';
import CategoryCol from './CategoryCol';
import PostCol from './PostCol';
import * as Global from '../utils/global';

class Home extends Component {
	constructor() {
		super(...arguments);
		const {store } = this.props;
		this.store = store;

		this.state = {
			page: {
				pagetype: Global.PAGETYPE.DEFAULT,
				title: ''
			}
		};
	}

	componentDidMount() {
		this.store.dispatch(changePagetype(Global.PAGETYPE.DEFAULT, ''));
	}

	render() {
		const {page, store} = this.props;

		return(
			<div>
				<CategoryCol store={store}></CategoryCol>
				<PostCol page={this.state.page} store={store}></PostCol>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		page: state.page,
//		category: null
	};
}

export default connect(mapStateToProps)(Home);
