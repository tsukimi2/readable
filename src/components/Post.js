import React, {Component} from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {subscribe} from 'redux-subscriber'
import update from 'immutability-helper'
import {Form, FormGroup, FormControl, Button, ControlLabel, Glyphicon, Grid, Row, Col, Label} from 'react-bootstrap'
import * as Global from '../utils/global'
import {changePagetype, getCategories, getPost, addPost, deletePost, editPost, votePost} from '../actions'
import Comments from './Comments'

class Post extends Component {
	constructor() {
		super(...arguments)
		const { post_id, is_existing_post, location } = this.props
		let tmp_is_edit = false

		this.post_id = typeof post_id !== 'undefined' ? post_id : this.getPostIdFromLocation(location, post_id)
		this.is_existing_post = (is_existing_post === false) ? is_existing_post : true

		if(!this.is_existing_post) {
			tmp_is_edit = true
		} else {
			tmp_is_edit = this.isLocationEdit(location)
		}

		this.state = {
			post: {
				id: '',
				title: '',
				author: '',
				ts: '',
				category: '',
				body: ''
			},
			categories: [],
			is_edit: tmp_is_edit
			
		}

		this.handleChangeTitle = this.handleChangeTitle.bind(this)
		this.handleChangeCategory = this.handleChangeCategory.bind(this)
		this.handleChangeBody = this.handleChangeBody.bind(this)
		this.canSubmitPost = this.canSubmitPost.bind(this)
		this.handleSubmitPost = this.handleSubmitPost.bind(this)
	}

	getPostIdFromLocation(location, post_id) {
		if(location && location.pathname) {
			let begin_index = location.pathname.lastIndexOf('/') + 1
			post_id = location.pathname.substring(begin_index)

			if(post_id === 'edit') {
				const end_index = begin_index			
				begin_index = location.pathname.lastIndexOf('/', end_index - 2) + 1		
				post_id = location.pathname.substring(begin_index, end_index)
			}
		}

		return post_id
	}

	isLocationEdit(location) {
		if(location && location.pathname) {
			const begin_index = location.pathname.lastIndexOf('/') + 1
			return (location.pathname.substring(begin_index) === 'edit') ? true : false
		}

		return false
	}

	componentDidMount() {
		this.unsubscribe_state_post = subscribe('post', state => {		
			const prev_post_id = this.state.post.id;

			const new_state = update(this.state.post, {$set: state.post});		
			this.setState({ post: new_state });

			if(this.is_existing_post && prev_post_id === '' && new_state.id !== prev_post_id) {
				this.props.dispatch(changePagetype(Global.PAGETYPE.POST, new_state.title));
			}
		});

		this.unsubscribe_get_categories = subscribe('categories', state => {			
			const arr_sorted_category = state.categories.sort((a, b) => {
				if(a.name < b.name) {
					return -1
				} else if(a.name > b.name) {
					return 1
				} else {
					return 0
				}
			})
			const new_state = update(this.state.categories, {$set: arr_sorted_category});
			const new_state_post = update(this.state.post, {
				category: { $set: arr_sorted_category[0].name }
			})

			this.setState({ categories: new_state, post: new_state_post });
		});

		this.props.dispatch(getCategories());
		if(this.is_existing_post) {
			this.props.dispatch(getPost(this.post_id));			
		}
	}

	componentWillUnmount() {
		this.unsubscribe_state_post();
		this.unsubscribe_get_categories();
	}

	onEditPostClick() {
		const prev_is_edit = this.state.is_edit
		const new_state = update(this.state.is_edit, 
			{ $set: !this.state.is_edit }
		)
		this.setState({ is_edit: new_state })

		if(prev_is_edit && this.canSubmitPost()) {		
			this.handleSubmitPost()
		}
	}

	canSubmitPost() {	
		if(this.state.post.title !== '' && this.state.post.body !== '' && this.state.post.author !== '') {
			return true;
		}

		return false;
	}

	handleChangeTitle(e) {
		const new_state = update(this.state.post, {title: {$set: e.target.value}});
		this.setState({
			post: new_state
		});
		this.props.dispatch(changePagetype(Global.PAGETYPE.POST, e.target.value))
	}

	handleChangeBody(e) {
		const new_state = update(this.state.post, {body: {$set: e.target.value}});
		this.setState({
			post: new_state
		});
	}

	handleChangeCategory(e) {
		const new_state = update(this.state.post, {category: {$set: e.target.value}});
		this.setState({
			post: new_state
		});	
	}

	handleSubmitPost() {	
		if(!this.is_existing_post) {			
			this.props.dispatch(addPost(this.state.post));
			this.props.closeAddPostModal();
		} else {
			this.props.dispatch(editPost(this.state.post))
			this.setState({ is_edit: false })
		}
	}

	customValidatePostTitle(text) {
		return (text.length > 0 && text.length < 64);
	}

	onChangePostTitle(data) {
		const new_state = update(this.state.post, {
			title: {$set: data.post_title}
		});
		this.setState({ post: new_state });
		this.props.dispatch(editPost(new_state));
	}

	vote(post, option) {
		this.props.dispatch(votePost(post, option));
	}

	renderPostTitle(is_existing_post, is_edit, post) {
		const BtnDeleteAndGoUp = withRouter(({ history }) => (
			<Glyphicon
				glyph="trash"
				className="cursor-pointer"
				onClick={() => {	
					this.props.dispatch(deletePost(this.post_id))					
					history.push('/' + this.state.post.category)
			}}/>
		))

		if(is_existing_post && !is_edit) {
			return(
				<div>
					<span id="post-title">
						{post.title}
			        </span>
			        <hr />
			        <span className="pull-right" style={{ fontSize: 16 }}>
			        	<Glyphicon glyph="pencil" className="cursor-pointer" onClick={this.onEditPostClick.bind(this)} />
						<span className="pl-5"><BtnDeleteAndGoUp className="cursor-pointer" /></span>
					</span>
				</div>
			)
		} else if(is_existing_post && is_edit) {
			return(
				<div>
					<FormGroup>
						<FormControl
							id="post-title"
							type="text"
							placeholder="Post title"
							value={post.title}
							onChange={this.handleChangeTitle}
						/>				
					</FormGroup>
					<hr />
			        <span className="pull-right">
			        	<Glyphicon glyph="pencil" className="cursor-pointer" onClick={this.onEditPostClick.bind(this)} />
						<span className="pl-5"><BtnDeleteAndGoUp className="cursor-pointer" /></span>
					</span>
				</div>			
			)
		}

		return(
			<div>
				<FormGroup>
					<FormControl
						id="post-title"
						type="text"
						placeholder="Post title"
						value={post.title}
						onChange={this.handleChangeTitle}		
					/>				
				</FormGroup>
				<hr />
			</div>
		)	
	}

	customValidatePostBody(text) {
		return (text.length > 0 && text.length < 10000);
	}

   onChangePostBody(data) {
		const new_state = update(this.state.post, {
			body: {$set: data.post_body}
		});
		this.setState({ post: new_state });
		this.props.dispatch(editPost(new_state));
   }

	renderPostBody(is_existing_post, is_edit, post, post_datetime) {
		//if(is_existing_post) {
		if(!is_edit) {
			return(
				<Grid>
					<Row>
						<Col xs={2} md={2}>
							<div className="vote-cell">
								<Glyphicon glyph="chevron-up" className="cursor-pointer" onClick={this.vote.bind(this, post, Global.VOTE.UPVOTE)} /><br />
								<div> {post.voteScore} </div>
								<Glyphicon glyph="chevron-down" className="cursor-pointer" onClick={this.vote.bind(this, post, Global.VOTE.DOWNVOTE)} />
							</div>
						</Col>
						<Col xs={10} md={10}>
							<Row>
								<span className="post-body cursor-pointer">{post.body}</span>
							</Row>
							<br />
							<Row>
								<Col xs={6} md={6}>
									<Label bsStyle="info">{post.category}</Label>
								</Col>
								<Col xs={6} md={6}>
									<Label bsStyle="info">Posted by {post.author} at {post_datetime}</Label>
								</Col>
							</Row>
						</Col>
					</Row>
				</Grid>
			);
		}

		return(
			<span>
				<FormGroup><span>Posted by <input type="text" placeholder="Username" value={post.author} onChange={this.onChangeAuthor.bind(this)} /> at now</span></FormGroup>
				<FormGroup>
					<ControlLabel>Category</ControlLabel>
					<FormControl componentClass="select" placeholder="" value={this.state.post.category} onChange={this.handleChangeCategory}>
					{
						this.state.categories.map(category => (
							<option key={category.name} value={category.name}>{category.name}</option>
						))
					}
					</FormControl>
				</FormGroup>
				<FormGroup>
					<FormControl componentClass="textarea" style={{height: 150}} placeholder="Enter your post here" value={this.state.post.body} onChange={this.handleChangeBody} />
				</FormGroup>
				<Button bsStyle="primary" onClick={this.handleSubmitPost} disabled={!this.canSubmitPost()}>Submit</Button>
			</span>
		);
	}

	onChangeAuthor(evt) {
		const new_state = update(this.state.post, {
			author: { $set: evt.target.value }
		});
		this.setState({ post: new_state });
	}

	renderComments(is_existing_post, post_id) {
		if(is_existing_post) {
			return(<span><hr /><Comments post_id={post_id} /></span>);
		}

		return (<span></span>);
	}

	render() {
		const { post, is_edit } = this.state;

		if(this.is_existing_post && Object.keys(post).length === 0) {		
			return(
				<div className="container">
					No post Found
				</div>
			)
		}

		const post_title = this.renderPostTitle(this.is_existing_post, this.state.is_edit, post);
		const post_datetime = Global.getDatetimeFromTs(post.timestamp);
		const post_body = this.renderPostBody(this.is_existing_post, is_edit, post, post_datetime);
		const comments = this.renderComments(this.is_existing_post, this.post_id);

		return (
			<div className="container">
				<Form>
					{ post_title }
					{post_body}
				</Form>
				{comments}
			</div>
		)
	}
}

function mapStateToProps({ post_id, categories, post }, {is_edit, is_existing_post}) {
	return {
		post_id,
		categories,
		post,
		is_edit,
		is_existing_post
	}
}

export default connect(mapStateToProps)(Post);
