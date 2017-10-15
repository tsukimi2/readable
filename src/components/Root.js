import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import Home from './Home';
import Category from './Category';
import Post from './Post';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

const Root = ({ store }) => (
	<Provider store={store}>
		<BrowserRouter history={createBrowserHistory()}>
			<div>
				<PropsRoute path="/" component={App} />
				<PropsRoute exact path="/" component={Home} />
				<PropsRoute path="/posts/:post_id" component={Post} />
				<PropsRoute exact path="/:category" component={Category} />
			</div>
		</BrowserRouter>
	</Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root;
