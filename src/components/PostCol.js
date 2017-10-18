import React, {Component} from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import ReactModal from 'react-modal';
import {Panel, Table, Glyphicon, DropdownButton, MenuItem} from 'react-bootstrap';
import {subscribe} from 'redux-subscriber';
import {Link} from 'react-router-dom';
import * as Global from '../utils/global';
import {updatePostsSortby,
	getAllPosts,
	getPosts,
	deletePost,
	votePost,
	getPostCommentsCount
} from '../actions';
import Post from './Post';


class PostCol extends Component {
	constructor() {
		super(...arguments)
		this.state = {
			posts: [],
			comments: [],
			ui: {
				posts_sortby: Global.POST_FIELD.VOTES,
				add_post_modal_open: false,
			}
		}

		this.openAddPostModal = this.openAddPostModal.bind(this)
		this.closeAddPostModal = this.closeAddPostModal.bind(this)

		this.category = ''
	}

	vote(post, option) {
		this.props.dispatch(votePost(post, option))
	}

	getCategory(page) {
		let category = ''

		if(page && page.pagetype === Global.PAGETYPE.CATEGORY) {
			category = page.title
		}

		return category
	}

	componentDidMount() {	
		const {page} = this.props;
		this.category = this.getCategory(page);

		this.unsubscribe_posts = subscribe('posts', state => {
			const new_posts = state.posts.map(post => ({
				...post,
				num_comments: 0
			}))

			const arr_post_id = state.posts.map(post => {
				return post.id
			})

			let promises = []
			for(let i = 0; i < arr_post_id.length; i++) {
				promises.push(this.props.dispatch(getPostCommentsCount(arr_post_id[i])))
			}
			Promise.all(promises).then(data => {			
				const arr_post_comments_count = data.map(post_comments => {
					if(post_comments.comments.length !== 0) {
						return {
							post_id: post_comments.comments[0].parentId,
							num_comments: post_comments.comments.filter(comment => comment.deleted === false).length
						}
					}

					return {
						post_id: null,
						num_comments: 0
					}
				})

				const new_posts_and_comment_count = new_posts.map(post => {
					return Object.assign(post, arr_post_comments_count.find(post_comments => {
						return post_comments && post.id === post_comments.post_id
					}))
				})

				this.setState(() => ({ posts: new_posts_and_comment_count }))	
			})	
		});

		this.unsubscribe_ui_posts_sortby = subscribe('ui.posts_sortby', state => {
			const new_state = update(this.state.ui, 
				{ posts_sortby: {$set: state.ui.posts_sortby}}
			);

			this.setState({ ui: new_state });
		});

		this.unsubscribe_vote = subscribe('post', state => {
			if(typeof state.post.voteScore !== 'undefined') {
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
			this.props.dispatch(getAllPosts());	
			
		} else if(page.pagetype === Global.PAGETYPE.CATEGORY) {
			this.props.dispatch(getPosts(this.category));
		}
	}

	componentWillUnmount() {
		this.unsubscribe_posts();
		this.unsubscribe_ui_posts_sortby();
		this.unsubscribe_vote();
	}

	deletePost(post_id) {
		this.props.dispatch(deletePost(post_id));
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
							that.props.dispatch(updatePostsSortby(evt));
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
								<th>Edit</th>
								<th>Category</th>
								<th>Votes</th>
								<th>Comments</th>
								<th>Timestamp</th>
								<th>Author</th>
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
								const to_path_edit = to_path + '/edit'

								return (
									<tr key={post.id}>
										<td><span onClick={this.deletePost.bind(this, post.id)}><Glyphicon glyph="trash" className="cursor-pointer" /></span></td>
										<td><span>
											<Link key={post.id} to={to_path_edit}><Glyphicon glyph="pencil" className="cursor-pointer" /></Link>
										</span></td>
										<td>{post.category}</td>
										<td><span onClick={this.vote.bind(this, post, Global.VOTE.UPVOTE)}><Glyphicon glyph="arrow-up" className="cursor-pointer" /></span> {post.voteScore} <span onClick={this.vote.bind(this, post, Global.VOTE.DOWNVOTE)}><Glyphicon glyph="arrow-down" className="cursor-pointer" /></span></td>
										<td>{post.num_comments}</td>
										<td>{ts}</td>
										<td>{post.author}</td>
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
						is_edit={true}
						is_existing_post={false}
						closeAddPostModal={this.closeAddPostModal.bind(this)}
					/>
				</ReactModal>
			</div>
		);
	}
}

function mapStateToProps({ ui, posts, post }, {page}) {
	return {
		ui,
		page,
		posts,
		post
	}
}

export default connect(mapStateToProps)(PostCol);
