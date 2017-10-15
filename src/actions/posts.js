import uuid from 'js-uuid'
import * as Api from '../utils/api'
import * as Global from '../utils/global'
import { UPDATE_POSTS_SORTBY,
	RECEIVE_ALL_POSTS,
	RECEIVE_ALL_POSTS_AND_COMMENTS,
	RECEIVE_POSTS,
	RECEIVE_POST,
	ADD_POST,
	DELETE_POST,
	VOTE_POST
} from './constants'

export const updatePostsSortby = field => ({
	type: UPDATE_POSTS_SORTBY,
	field
});

export const receiveGetAllPosts = posts => ({
	type: RECEIVE_ALL_POSTS,
	posts
});

export const getAllPosts = () => dispatch => (
	Api.getAllPosts()
		.then(data => dispatch(receiveGetAllPosts(data)))
);

export const receiveGetAllPostsAndComments = posts => ({
	type: RECEIVE_ALL_POSTS_AND_COMMENTS,
	posts
})

export const getAllPostsAndComments = () => dispatch => (
//	Api.getAllPostsAndComments()
//		.then(data => dispatch(receiveGetAllPostsAndComments()))
	Api.getAllPosts()
		.then(data => {
			console.log('data')
			console.log(data)
		})
)

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
