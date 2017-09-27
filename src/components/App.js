import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';
import {connect} from 'react-redux';
import '../App.css';
import * as Global from '../utils/global';
//import Title from './Title';
import Nav from './Nav';

class App extends Component {
	render() {
		const { page } = this.props

		return (
      	<div className="App">
				<Navbar inverse collapseOnSelect>
    				<Navbar.Header>
      				<Navbar.Brand>
        					<a href="#">{Global.APPNAME}</a>
      				</Navbar.Brand>
      				<Navbar.Toggle />
    				</Navbar.Header>
				</Navbar>	
				<Nav page={page}></Nav>
      	</div>
    	);
	}
}

function mapStateToProps(state) {
	return {
		page: state.page
	};
}

export default connect(mapStateToProps)(App);
