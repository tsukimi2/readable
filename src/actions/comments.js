import uuid from 'js-uuid'
import * as Api from '../utils/api';
import { UPDATE_COMMENTS_SORTBY,
	RECEIVE_POST_COMMENTS_COUNT,
	RECEIVE_COMMENTS,
	DELETE_COMMENT,
	EDIT_COMMENT,
	VOTE_COMMENT,
	ADD_COMMENT
} from './constants'

export const updateCommentsSortby = field => ({
	type: UPDATE_COMMENTS_SORTBY,
	field
});

export const receiveComments = comments => ({
	type: RECEIVE_COMMENTS,
	comments
});

export const getComments = post_id => dispatch => (
	Api.getComments(post_id)
		.then(data => dispatch(receiveComments(data)))
);

export const receivePostCommentsCount = comments => ({
	type: RECEIVE_POST_COMMENTS_COUNT,
	comments
})

export const getPostCommentsCount = post_id => dispatch => (
	Api.getComments(post_id)
		.then(data => dispatch(receivePostCommentsCount(data)))
);

export const handleDeleteComment = comment => ({
	type: DELETE_COMMENT,
	comment
});

export const deleteComment = id => dispatch => (
	Api.deleteComment(id)
		.then(data => dispatch(handleDeleteComment(data)))
);

export const handleEditComment = comment => ({
	type: EDIT_COMMENT,
	comment
});

export const editComment = (id, body) => dispatch => (
	Api.editComment(id, body)
		.then(data => dispatch(handleEditComment(data)))	
);

export const handleVoteComment = comment => ({
	type: VOTE_COMMENT,
	comment
});

export const voteComment = (id, option) => dispatch => (
	Api.voteComment(id, option)
		.then(data => dispatch(handleVoteComment(data)))
);

export const handleAddComment = comment => ({
	type: ADD_COMMENT,
	comment
});

export const addComment = (comment, post_id) => dispatch => {
	comment['id'] = uuid.v4();
	comment['timestamp'] = Date.now();
	comment['parentId'] = post_id;

	return(Api.addComment(comment)
		.then(data => dispatch(handleAddComment(data)))
	)
};
