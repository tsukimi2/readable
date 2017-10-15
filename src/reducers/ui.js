import * as Global from '../utils/global'
import { UPDATE_POSTS_SORTBY, UPDATE_COMMENTS_SORTBY } from '../actions/constants'

const initial_ui_state = {
	posts_sortby: Global.POST_FIELD.VOTES
};

export const ui = (state=initial_ui_state, action) => {
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
