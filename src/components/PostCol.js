import React, {Component} from 'react';
import update from 'immutability-helper';
import ReactModal from 'react-modal';
import {Panel, Table, Glyphicon, DropdownButton, MenuItem} from 'react-bootstrap';
import {subscribe} from 'redux-subscriber';
import {Link} from 'react-router-dom';
import * as Global from '../utils/global';
import {updatePostsSortby, getAllPosts, getPosts, deletePost, votePost} from '../actions';
import Post from './Post';


class PostCol extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			posts: [],
			ui: {
				posts_sortby: Global.POST_FIELD.VOTES,
				add_post_modal_open: false,
			}
		};

		this.openAddPostModal = this.openAddPostModal.bind(this);
		this.closeAddPostModal = this.closeAddPostModal.bind(this);

		const {store} = this.props;
		this.store = store;
		this.category = '';
	}

	vote(post, option) {
		this.store.dispatch(votePost(post, option));
	}

	getCategory(page) {
		let category = '';

		if(page && page.pagetype === Global.PAGETYPE.CATEGORY) {
			category = page.title;
		}

		return category;
	}

	componentDidMount() {
		const {page} = this.props;
		this.category = this.getCategory(page);

		this.unsubscribe_posts = subscribe('posts', state => {
			this.setState({ posts: state.posts });
		});

		this.unsubscribe_ui_posts_sortby = subscribe('ui.posts_sortby', state => {
			const new_state = update(this.state.ui, 
				{ posts_sortby: {$set: state.ui.posts_sortby}}
			);

			this.setState({ ui: new_state });
		});

		this.unsubscribe_vote = subscribe('post', state => {
			if(typeof state.post.voteScore != 'undefined') {
				let index = this.state.posts.findIndex(post => (post.id === state.post.id));

				if(index !== -1) {
					const new_state = update(this.state.posts, {
						[index]: {
							voteScore: {$set: state.post.voteScore}
						}
					});
					this.setState({ posts: new_state });
				}
			}
		});

		if(page.pagetype === Global.PAGETYPE.DEFAULT) {
			this.store.dispatch(getAllPosts());		
		} else if(page.pagetype === Global.PAGETYPE.CATEGORY) {
			this.store.dispatch(getPosts(this.category));
		}
	}

	componentWillUnmount() {
		this.unsubscribe_posts();
		this.unsubscribe_ui_posts_sortby();
		this.unsubscribe_vote();
	}

	deletePost(post_id) {
		this.store.dispatch(deletePost(post_id));
	}

	openAddPostModal() {
		const new_state = update(this.state.ui, {
			add_post_modal_open: {$set: true}
		});
		this.setState({ ui: new_state });	
	}

	closeAddPostModal() {
		const new_state = update(this.state.ui, {
			add_post_modal_open: {$set: false}
		});
		this.setState({ ui: new_state });
	}

	renderTitle(posts_sortby) {
		const sortby_title = posts_sortby && posts_sortby.NAME ? posts_sortby.NAME : '';
		let that = this;

		return (
			<span>
				<h3>Posts</h3>
				<span>Sort by </span>
				<DropdownButton
					id="btnSortby"
					title={sortby_title}
					onSelect={
						function(evt) {
							that.store.dispatch(updatePostsSortby(evt));
						}
					}
				>
					<MenuItem eventKey={Global.POST_FIELD.VOTES}>{Global.POST_FIELD.VOTES.NAME}</MenuItem>
					<MenuItem eventKey={Global.POST_FIELD.TIMESTAMP}>{Global.POST_FIELD.TIMESTAMP.NAME}</MenuItem>
				</DropdownButton> 

				<span className="pl-1" onClick={this.openAddPostModal}><Glyphicon glyph="plus" className="cursor-pointer" /></span>
			</span>
		);
	}

	renderEmptyPostCol(posts) {
		if(posts.length === 0) {
			return(
				<tr>
					<td colSpan="5">No posts found</td>
				</tr>
			);
		}

		return (<tr></tr>);
	}

	render() {
		const ui = this.state.ui;

		const arr_filtered_posts = this.state.posts.filter((post) => post.deleted === false);
		const arr_filtered_sorted_posts = Global.immutableSort(arr_filtered_posts, Global.compareFunc(ui.posts_sortby.VAL));

		const empty_postcol = this.renderEmptyPostCol(arr_filtered_sorted_posts);

		return(
			<div>
				<Panel header={this.renderTitle(ui.posts_sortby)}>
					<Table responsive>
						<thead>
							<tr>
								<th>Delete</th>
								<th>Category</th>
								<th>Votes</th>
								<th>Timestamp</th>
								<th>Post</th>
							</tr>
						</thead>
						<tbody>
						{empty_postcol}
						{
							arr_filtered_sorted_posts.map(post => {
								const [date, time] = new Date(post.timestamp).toLocaleString('en-US').split(', ');
								const ts = date + ' ' + time;
								const to_path = '/posts/' + post.id;

								return (
									<tr key={post.id}>
										<td><span onClick={this.deletePost.bind(this, post.id)}><Glyphicon glyph="trash" className="cursor-pointer" /></span></td>
										<td>{post.category}</td>
										<td><span onClick={this.vote.bind(this, post, Global.VOTE.UPVOTE)}><Glyphicon glyph="arrow-up" className="cursor-pointer" /></span> {post.voteScore} <span onClick={this.vote.bind(this, post, Global.VOTE.DOWNVOTE)}><Glyphicon glyph="arrow-down" className="cursor-pointer" /></span></td>
										<td>{ts}</td>
										<td><Link key={post.id} to={to_path}>{post.title}</Link></td>
									</tr>
								)
							})
						}
						</tbody>
					</Table>
				</Panel>

				<ReactModal
					isOpen={this.state.ui.add_post_modal_open}
					onRequestClose={this.closeAddPostModal}
					contentLabel='Modal'
				>
					<Post
						store={this.store}
						post_id={Global.NEW}
						closeAddPostModal={this.closeAddPostModal.bind(this)}
					/>
				</ReactModal>
			</div>
		);
	}
}

export default PostCol;
