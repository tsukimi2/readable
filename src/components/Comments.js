import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem, Glyphicon, DropdownButton, MenuItem} from 'react-bootstrap';
import {subscribe} from 'redux-subscriber';
import update from 'immutability-helper';
import InlineEdit from 'react-edit-inline';
import {updateCommentsSortby, getComments, deleteComment, editComment, voteComment} from '../actions';
import * as Global from '../utils/global';
import NewComment from './NewComment';


class Comments extends Component {
	constructor() {
		super(...arguments);
		const { post_id } = this.props;
		this.post_id = post_id;
		this.state = {
			comments: [],
			ui: {
				comments_sortby: Global.COMMENT_FIELD.VOTES
			}
		};
	}

	componentDidMount() {
		this.unsubscribe_comments = subscribe('comments', state => {
			const new_state = update(this.state.comments, {
				$set: state.comments
			});
			this.setState({ comments: new_state });
		});

		this.unsubscribe_comment = subscribe('comment', state => {
			const index = this.state.comments.findIndex(comment => (comment.id === state.comment.id));
			let new_state = null;
			if(index !== -1) {
				new_state = update(this.state.comments, {
					[index]: { $set: state.comment }
				});
			} else {
				new_state = update(this.state.comments, {
					$push: [ state.comment ]
				});
			}
			this.setState({ comments: new_state });
		});

		this.unsubscribe_ui_comments_sortby = subscribe('ui.comments_sortby', state => {
			const new_state = update(this.state.ui, 
				{ comments_sortby: {$set: state.ui.comments_sortby}}
			);

			this.setState({ ui: new_state });
		});

		this.props.dispatch(getComments(this.post_id));
	}

	componentWillUnmount() {
		this.unsubscribe_comments();
		this.unsubscribe_comment();
		this.unsubscribe_ui_comments_sortby();
	}

	deleteComment(id) {
		this.props.dispatch(deleteComment(id));
	}

	customValidateCommentBody(text) {
		return (text.length > 0 && text.length < 10000);
	}

	onChangeCommentBody(comment_id, data) {
		const {comment_body} = data;
		const index = this.state.comments.findIndex(comment => (comment.id === comment_id));
		const new_state = update(this.state.comments, {
			[index]: {
				body: { $set: comment_body }
			}
		});
		this.setState({ comments: new_state });
		this.props.dispatch(editComment(comment_id, comment_body));
	}

	vote(id, opt) {
		this.props.dispatch(voteComment(id, opt));
	}

	renderEmptyCommentList(comments) {
		if(comments.length === 0) {
			return(<span className="comments">No comments found</span>);
		}

		return (<span></span>);
	}

	render() {
		const that = this

		const sortby_title = this.state.ui.comments_sortby && this.state.ui.comments_sortby.NAME ? this.state.ui.comments_sortby.NAME : '';

		const arr_filtered_comments = this.state.comments.filter((comment) => comment.deleted === false && comment.parentDeleted === false);
		const arr_filtered_sorted_comments = Global.immutableSort(arr_filtered_comments, Global.compareFunc(this.state.ui.comments_sortby.VAL));

		const empty_comment_list = this.renderEmptyCommentList(arr_filtered_sorted_comments);

		return(
			<div>
				<div className="pt-5 pb-10">
					<h3 className="subheader">Comments</h3>
					<div className="pull-right">
						<span>Sort By </span>
						<DropdownButton
							id="btnSortby"
							title={sortby_title}
							onSelect={
								function(evt) {
									that.props.dispatch(updateCommentsSortby(evt));
								}
							}
						>
							<MenuItem eventKey={Global.POST_FIELD.VOTES}>{Global.POST_FIELD.VOTES.NAME}</MenuItem>
							<MenuItem eventKey={Global.POST_FIELD.TIMESTAMP}>{Global.POST_FIELD.TIMESTAMP.NAME}</MenuItem>
						</DropdownButton>
					</div>
				</div>
				{empty_comment_list}
				<ListGroup>
				{
					arr_filtered_sorted_comments.map(comment => {
						const dt = Global.getDatetimeFromTs(comment.timestamp);
					
						return(
							<ListGroupItem key={comment.id} className="comments">
								<div className="comment-body cursor-pointer">
									<InlineEdit
										validate={this.customValidateCommentBody.bind(this)}
										activeClassName="editing"
										text={comment.body}
										paramName="comment_body"
										change={this.onChangeCommentBody.bind(this, comment.id)}
									/> <Glyphicon glyph="pencil" />
								</div><br />
								<div><Glyphicon glyph="thumbs-up" className="cursor-pointer" onClick={this.vote.bind(this, comment.id, Global.VOTE.UPVOTE)} /> <Glyphicon glyph="thumbs-down" className="cursor-pointer" onClick={this.vote.bind(this, comment.id, Global.VOTE.DOWNVOTE)} /> {comment.voteScore}</div>
								<div>{comment.author} on {dt} <Glyphicon glyph="trash" className="cursor-pointer" onClick={this.deleteComment.bind(this, comment.id)} /></div>
							</ListGroupItem>
						)
					})	
				}
					<NewComment
						post_id={this.post_id}
					></NewComment>
				</ListGroup>
			</div>
		);
	}
}

function mapStateToProps({ ui, comments, comment }) {
	return {
		ui,
		comments,
		comment
	}
}

export default connect(mapStateToProps)(Comments)
