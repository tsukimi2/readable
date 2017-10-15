import { RECEIVE_POST, VOTE_POST, RECEIVE_ALL_POSTS, RECEIVE_POSTS, ADD_POST, DELETE_POST } from '../actions/constants'

export const post = (state={}, action) => {
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

export const posts = (state=[], action) => {
	switch(action.type) {
		case RECEIVE_ALL_POSTS:
			return action.posts;
		case RECEIVE_POSTS:
			return action.posts;
		case ADD_POST:
			if(action.post && typeof action.post.id !== 'undefined') {
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
				if(index !== -1) {				
					posts[index].deleted = true
				}
				return posts;
			}

			return state;
		default:
			return state;
	}
}
