import * as Global from '../utils/global'
import { CHANGE_PAGETYPE } from '../actions/constants'

const initial_pagetype_state = {
	pagetype: Global.PAGETYPE.DEFAULT,
	title: ''
};

export const page = (state=initial_pagetype_state, action) => {
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
