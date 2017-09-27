const API = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:3001';
const headers = {
	'Accept': 'application/json',
	'Authorization': 'testing'
};
const post_headers = {
	'Authorization': 'testing',
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

export const getCategories = () =>
	fetch(`${API}/categories`, {headers})
    .then(res => res.json())
    .then(data => data.categories);

export const getAllPosts = () =>
	fetch(`${API}/posts`, {headers})
    .then(res => res.json());

export const getPosts = (category) =>
	fetch(`${API}/${category}/posts`, {headers})
    .then(res => res.json());

export const getPost = (post_id) =>
	fetch(`${API}/posts/${post_id}`, {headers})
	.then(res => res.json());

export const addPost = (post) =>
	fetch(`${API}/posts`, {
		method: 'POST',
		headers: post_headers,
		body: JSON.stringify(post)
	})
	.then(res => res.json());

export const deletePost = (post_id) =>
	fetch(`${API}/posts/${post_id}`, {method: 'DELETE', headers});
//    .then(res => res.json());

export const editPost = (post) =>
	fetch(`${API}/posts/${post.id}`, {
		method: 'PUT',
		headers: post_headers,
		body: JSON.stringify(post)
	})
	.then(res => res.json());

export const votePost = (post, option) =>
	fetch(`${API}/posts/${post.id}`, {
		method: 'POST',
		headers: post_headers,
		body: JSON.stringify({
			option
		})
	})
	.then(res => res.json());

export const getComments = (post_id) =>
	fetch(`${API}/posts/${post_id}/comments`, { headers })
	.then(res => res.json());

export const deleteComment = id => 
	fetch(`${API}/comments/${id}`, {
		method: 'DELETE',
		headers: headers,
	})
	.then(res => res.json());

export const editComment = (id, body) =>
	fetch(`${API}/comments/${id}`, {
		method: 'PUT',
		headers: post_headers,
		body: JSON.stringify({
			body: body,
			timestamp: Date.now()
		})
	})
	.then(res => res.json());

export const voteComment = (id, option) =>
	fetch(`${API}/comments/${id}`, {
		method: 'POST',
		headers: post_headers,
		body: JSON.stringify({
			option
		})
	})
	.then(res => res.json());

export const addComment = (comment) =>
	fetch(`${API}/comments`, {
		method: 'POST',
		headers: post_headers,
		body: JSON.stringify(comment)
	})
	.then(res => res.json());

