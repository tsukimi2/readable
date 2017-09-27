import uuid from 'js-uuid';
import * as Api from '../utils/api';
import * as Global from '../utils/global';

export const CHANGE_PAGETYPE = 'CHANGE_PAGETYPE';
export const UPDATE_POSTS_SORTBY = 'UPDATE_POSTS_SORTBY';
export const UPDATE_COMMENTS_SORTBY = 'UPDATE_COMMENTS_SORTBY';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const RECEIVE_ALL_POSTS = 'RECEIVE_ALL_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const RECEIVE_POST = 'RECEIVE_POST';
export const ADD_POST = 'ADD_POST';
export const DELETE_POST = 'DELETE_POST';
export const VOTE_POST = 'VOTE_POST';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const VOTE_COMMENT = 'VOTE_COMMENT';
export const ADD_COMMENT = 'ADD_COMMENT';

export function changePagetype(pagetype, title) {
	return {
		type: CHANGE_PAGETYPE,
		pagetype,
		title
	};
}

export const updatePostsSortby = field => ({
	type: UPDATE_POSTS_SORTBY,
	field
});

export const updateCommentsSortby = field => ({
	type: UPDATE_COMMENTS_SORTBY,
	field
});

export const receiveCategories = categories => ({
	type: RECEIVE_CATEGORIES,
	categories
});

export const getCategories = () => dispatch => (
	Api.getCategories()
		.then(data => dispatch(receiveCategories(data)))
);

export const receiveGetAllPosts = posts => ({
	type: RECEIVE_ALL_POSTS,
	posts
});

export const getAllPosts = () => dispatch => (
	Api.getAllPosts()
		.then(data => dispatch(receiveGetAllPosts(data)))
);

export const receivePosts = posts => ({
	type: RECEIVE_POSTS,
	posts
});

export const getPosts = category => dispatch => (
	Api.getPosts(category)
		.then(data => dispatch(receivePosts(data)))
);

export const receivePost = post => ({
	type: RECEIVE_POST,
	post
});

export const getPost = post_id => dispatch => {
	if(post_id === Global.NEW) {
		return (dispatch(receivePost({
			title: Global.POST_DEFAULT_VAL.TITLE,
			body: Global.POST_DEFAULT_VAL.BODY,
			author: Global.POST_DEFAULT_VAL.AUTHOR,
			category: Global.POST_DEFAULT_VAL.CATEGORY,
			voteScore: Global.POST_DEFAULT_VAL.VOTESCORE
		})))
	} else {
		return (Api.getPost(post_id)
			.then(data => dispatch(receivePost(data)))
		)
	}
};

export const handleAddPost = res => ({
	type: ADD_POST,
	post: res
});

export const addPost = (post) => dispatch => {
	post['id'] = uuid.v4();
	post['timestamp'] = Date.now();

	return(Api.addPost(post)
		.then(data => dispatch(handleAddPost(data)))
	)
};

export const handleDeletePost = res => ({
	type: DELETE_POST,
	res
});

export const deletePost = (post_id) => dispatch => (
	Api.deletePost(post_id)
		.then(data => dispatch(handleDeletePost(data)))
);

export const editPost = (post) => dispatch => (
	Api.editPost(post)
		.then(data => dispatch(receivePost(data)))
);

export const handleVotePost = res => ({
	type: VOTE_POST,
	post: res
});

export const votePost = (post, option) => dispatch => (
	Api.votePost(post, option)
		.then(data => dispatch(handleVotePost(data)))
);

export const receiveComments = comments => ({
	type: RECEIVE_COMMENTS,
	comments
});

export const getComments = post_id => dispatch => (
	Api.getComments(post_id)
		.then(data => dispatch(receiveComments(data)))
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
