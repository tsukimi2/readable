import { RECEIVE_CATEGORIES } from './constants'
import * as Api from '../utils/api'

export const receiveCategories = categories => ({
	type: RECEIVE_CATEGORIES,
	categories
})

export const getCategories = () => dispatch => (
	Api.getCategories()
		.then(data => dispatch(receiveCategories(data)))
);