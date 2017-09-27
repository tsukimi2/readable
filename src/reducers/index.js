import {combineReducers} from 'redux';
import {CHANGE_PAGETYPE, UPDATE_POSTS_SORTBY, UPDATE_COMMENTS_SORTBY, RECEIVE_CATEGORIES, RECEIVE_ALL_POSTS, RECEIVE_POSTS, RECEIVE_POST, ADD_POST, DELETE_POST, VOTE_POST, RECEIVE_COMMENTS, DELETE_COMMENT, EDIT_COMMENT, VOTE_COMMENT, ADD_COMMENT} from '../actions';
import * as Global from '../utils/global';

const initial_pagetype_state = {
	pagetype: Global.PAGETYPE.DEFAULT,
	title: ''
};

const initial_ui_state = {
	posts_sortby: Global.POST_FIELD.VOTES
};
/**********
const initial_categories_state = {
	categories: []
};

const initial_posts_state = {
	posts: []
};

const initial_post_state = {
	title: Global.POST_DEFAULT_VAL.TITLE,
	author: Global.POST_DEFAULT_VAL.AUTHOR,
	body: Global.POST_DEFAULT_VAL.BODY,
	category: Global.POST_DEFAULT_VAL.CATEGORY
};
*/

function page(state=initial_pagetype_state, action) {
	const {pagetype, title} = action;

	switch(action.type) {
		case CHANGE_PAGETYPE:
			return {
				...state,
				pagetype,
				title
			};
		default:
			return state;
	}
}

function ui(state=initial_ui_state, action) {
	const {field} = action;

	switch(action.type) {
		case UPDATE_POSTS_SORTBY:
			return {
				...state,
				posts_sortby: field
			};
		case UPDATE_COMMENTS_SORTBY:
			return {
				...state,
				comments_sortby: field
			};
		default:
			return state;
	}
}

function categories(state=[], action) {
	switch(action.type) {
		case RECEIVE_CATEGORIES:
			return action.categories;
		default:
			return state;
	}
}

function post(state={}, action) {
	const {post} = action;

	switch(action.type) {
		case RECEIVE_POST:
			return post;
		case VOTE_POST:
			return post;
		default:
			return state;
	}
}

function posts(state=[], action) {
	switch(action.type) {
		case RECEIVE_ALL_POSTS:
			return action.posts;
		case RECEIVE_POSTS:
			return action.posts;
		case ADD_POST:
			if(action.post && typeof action.post.id != 'undefined') {
				return [...state].concat([action.post]);
			}

			return state;
		case DELETE_POST:
			if(action.res && action.res.status === 200) {
				const post_id = action.res.url.substring(action.res.url.lastIndexOf('/') + 1);
				const index = state.findIndex((element) => (
					(element.id === post_id) ? true : false
				));

				let posts = [...state];
				posts[index].deleted = true;
				return posts;
			}

			return state;
		default:
			return state;
	}
}

function comments(state=[], action) {
	switch(action.type) {
		case RECEIVE_COMMENTS:
			return action.comments;
		case DELETE_COMMENT:
			const {comment} = action;
			const index = state.findIndex(element => (
				(element.id === comment.id) ? true: false
			));

			let comments = [...state];
			comments[index].deleted = comment.deleted;

			return comments;					
		default:
			return state;
	}
}

function comment(state=[], action) {
	const {comment} = action;

	switch(action.type) {
		case EDIT_COMMENT:
			return comment;
		case VOTE_COMMENT:
			return comment;
		case ADD_COMMENT:
			return comment;
		default:
			return state;
	}	
}


export default combineReducers({
	page,
	ui,
	categories,
	posts,
	post,
	comments,
	comment
});

