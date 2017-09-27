import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {subscribe} from 'redux-subscriber';
import update from 'immutability-helper';
import {Form, FormGroup, FormControl, Button, ControlLabel, Glyphicon, Grid, Row, Col, Label} from 'react-bootstrap';
import InlineEdit from 'react-edit-inline';
import * as Global from '../utils/global';
import {changePagetype, getCategories, getPost, addPost, editPost, votePost} from '../actions';
import Comments from './Comments';

class Post extends Component {
	constructor() {
		super(...arguments);

		const {store, post_id, location} = this.props;
		this.store = store;
		this.post_id = this.getPostIdFromLocation(location, post_id);
		this.is_existing_post = (this.post_id === Global.NEW) ? false : true;

		this.state = {
			post: {
				id: '',
				title: '',
				author: '',
				ts: '',
				category: '',
				body: ''
			},
			categories: []
		};

		this.handleChangeTitle = this.handleChangeTitle.bind(this);
		this.handleChangeCategory = this.handleChangeCategory.bind(this);
		this.handleChangeBody = this.handleChangeBody.bind(this);
		this.canSubmitPost = this.canSubmitPost.bind(this);
		this.handleSubmitPost = this.handleSubmitPost.bind(this);
	}

	getPostIdFromLocation(location, post_id) {
		if(location && location.pathname) {
			let begin_index = location.pathname.lastIndexOf('/') + 1;
			post_id = location.pathname.substring(begin_index);
		}

		return post_id;
	}

	componentDidMount() {
		this.unsubscribe_state_post = subscribe('post', state => {
			const prev_post_id = this.state.post.id;

			const new_state = update(this.state.post, {$set: state.post});
			this.setState({ post: new_state });

			if(this.is_existing_post && prev_post_id === '' && new_state.id !== prev_post_id) {
				this.store.dispatch(changePagetype(Global.PAGETYPE.POST, new_state.title));
			}
		});

		this.unsubscribe_get_categories = subscribe('categories', state => {
			const new_state = update(this.state.categories, {$set: state.categories });
			this.setState({ categories: new_state });
		});

		this.store.dispatch(getCategories());
		this.store.dispatch(getPost(this.post_id));
	}

	componentWillUnmount() {
		this.unsubscribe_state_post();
		this.unsubscribe_get_categories();
	}

	canSubmitPost() {
		if(this.state.post.title !== '' && this.state.post.body !== '' && this.state.post.author !== '') {
			return false;
		}

		return true;
	}

	handleChangeTitle(e) {
		const new_state = update(this.state.post, {title: {$set: e.target.value}});
		this.setState({
			post: new_state
		});
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
		this.store.dispatch(addPost(this.state.post));
		this.props.closeAddPostModal();
	}

	customValidatePostTitle(text) {
		return (text.length > 0 && text.length < 64);
	}

	onChangePostTitle(data) {
		const new_state = update(this.state.post, {
			title: {$set: data.post_title}
		});
		this.setState({ post: new_state });
		this.store.dispatch(editPost(new_state));
	}

	vote(post, option) {
		this.store.dispatch(votePost(post, option));
	}

	renderPostTitle(is_existing_post) {
		if(is_existing_post) {
			return(
				<div id="post-title" className="cursor-pointer">
					<InlineEdit
						validate={this.customValidatePostTitle.bind(this)}
						activeClassName="inline-editing"
						text={this.state.post.title}
						paramName="post_title"
						change={this.onChangePostTitle.bind(this)}
		         /> <Glyphicon glyph="pencil" />
				</div>
			);
		}

		return(
			<FormGroup controlId="formControlsText">
				<FormControl
					id="post-title"
					type="text"
					placeholder="Post title"
					value={this.state.post.title}
					onChange={this.handleChangeTitle}		
				/>				
			</FormGroup>
		);
	}

	customValidatePostBody(text) {
		return (text.length > 0 && text.length < 10000);
	}

   onChangePostBody(data) {
		const new_state = update(this.state.post, {
			body: {$set: data.post_body}
		});
		this.setState({ post: new_state });
		this.store.dispatch(editPost(new_state));
   }

	renderPostBody(is_existing_post, post, post_datetime) {
		if(is_existing_post) {
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
								<span className="post-body cursor-pointer">
									<InlineEdit
										validate={this.customValidatePostBody.bind(this)}
										activeClassName="editing"
										text={this.state.post.body}
										paramName="post_body"
										change={this.onChangePostBody.bind(this)}
									/>
								</span> <Glyphicon glyph="pencil" />
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
				<FormGroup controlId="formControlsSelect">
					<ControlLabel>Category</ControlLabel>
					<FormControl componentClass="select" placeholder="" value={this.state.post.category} onChange={this.handleChangeCategory}>
					{
						this.state.categories.map(category => (
							<option key={category.name} value={category.name}>{category.name}</option>
						))
					}
					</FormControl>
				</FormGroup>
				<FormGroup controlId="formControlsTextarea">
					<FormControl componentClass="textarea" style={{height: 150}} placeholder="Enter your post here" value={this.state.post.body} onChange={this.handleChangeBody} />
				</FormGroup>
				<Button bsStyle="primary" onClick={this.handleSubmitPost} disabled={this.canSubmitPost()}>Submit</Button>
			</span>
		);
	}

	onChangeAuthor(evt) {
		const new_state = update(this.state.post, {
			author: { $set: evt.target.value }
		});
		this.setState({ post: new_state });
	}

	renderComments(is_existing_post, store, post_id) {
		if(is_existing_post) {
			return(<span><hr /><Comments store={store} post_id={post_id} /></span>);
		}

		return (<span></span>);
	}

	render() {
		const {post} = this.state;
		const pass_to_title_page = {
			pagetype: Global.PAGETYPE.POST,
			title: post.title
		};

		const post_title = this.renderPostTitle(this.is_existing_post);
		const post_datetime = Global.getDatetimeFromTs(this.state.post.timestamp);
		const post_body = this.renderPostBody(this.is_existing_post, post, post_datetime);
		const comments = this.renderComments(this.is_existing_post, this.store, this.post_id);

		return (
			<div className="container">
				<Form>
					{post_title}
					<hr />
					{post_body}
				</Form>
				{comments}
			</div>
		)
	}
}

export default Post;
