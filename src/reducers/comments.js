import {
	RECEIVE_POST_COMMENTS_COUNT,
	RECEIVE_COMMENTS,
	DELETE_COMMENT,
	EDIT_COMMENT,
	VOTE_COMMENT,
	ADD_COMMENT
} from '../actions/constants'

export const comments = (state=[], action) => {
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
		case RECEIVE_POST_COMMENTS_COUNT:	
			const arr_comment = action.comments

			if(arr_comment.length !== 0) {
				return {
					post_id: arr_comment[0].parentId,
					num_comments: arr_comment.length
				}
			}

			return {
				post_id: null,
				num_comments: 0
			}		
		default:
			return state;
	}
}

export const comment = (state=[], action) => {
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
