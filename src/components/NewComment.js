import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, Button} from 'react-bootstrap'
import {subscribe} from 'redux-subscriber'
import update from 'immutability-helper'
import {addComment} from '../actions'

class NewComment extends Component {
	constructor() {
		super(...arguments);
		const {post_id} = this.props;
		this.post_id = post_id;
		this.state = {
			comment: {
				author: '',
				body: ''
			}
		};
	}

	componentDidMount() {
		this.unsubscribe_comment = subscribe('comment', state => {
			const new_state = update(this.state.comment, {
				author: {$set: ''},
				body: {$set: ''}
			});
			this.setState({ comment: new_state });
		});
	}

	componentWillUnmount() {
		this.unsubscribe_comment();
	}

	handleChangeAuthor(evt) {
		const new_state = update(this.state.comment, {
			author: { $set: evt.target.value }
		});
		this.setState({ comment: new_state });
	}

	handleChangeBody(evt) {
		const new_state = update(this.state.comment, {
			body: { $set: evt.target.value }
		});
		this.setState({ comment: new_state });
	}

	handleSubmitComment() {
		this.props.dispatch(addComment(this.state.comment, this.post_id));
	}

	canSubmitComment() {
		if(this.state.comment.author !== '' && this.state.comment.body !== '') {
			return false;
		}

		return true;
	}

	render() {
		return(
			<Form>
				<hr />
				<h3 className="subheader pt-5 pb-10">Add Comment</h3>
				<div className="comments pt-10">
					<FormGroup controlId="formControlsText">
						User: {'\u00A0'}
						<input type="text"
							id="formControlsText"
							placeholder="Username"
							value={this.state.comment.author}
							onChange={this.handleChangeAuthor.bind(this)}			
						/>				
					</FormGroup>

					<FormGroup controlId="formControlsTextarea">
						<FormControl componentClass="textarea" placeholder="Comment" value={this.state.comment.body} onChange={this.handleChangeBody.bind(this)} />
					</FormGroup>
					<Button bsStyle="primary" onClick={this.handleSubmitComment.bind(this)} disabled={this.canSubmitComment()}>Submit Comment</Button>
				</div>
			</Form>
		);
	}
}

function mapStateToProps({comment}) {
	return {
		comment
	}
}

export default connect(mapStateToProps)(NewComment);
