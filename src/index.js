import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import initSubscriber from 'redux-subscriber';
import thunk from 'redux-thunk';
import reducer from './reducers';
import './index.css';
import Root from './components/Root';
import registerServiceWorker from './registerServiceWorker';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
	applyMiddleware(thunk)
));
initSubscriber(store);

ReactDOM.render(
	<Root store={store} />, 
	document.getElementById('root'));
registerServiceWorker();
