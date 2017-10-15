import {combineReducers} from 'redux'
import { ui } from './ui'
import { page } from './page'
import { categories } from './categories'
import { post, posts } from './posts'
import { comment, comments } from './comments'

export default combineReducers({
	page,
	ui,
	categories,
	posts,
	post,
	comments,
	comment
});

