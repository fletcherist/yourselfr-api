var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var tools = require('./../tools.js');

var Posts = mongoose.model('posts');
var Users = mongoose.model('users');
var Likes = mongoose.model('likes');
var Subscriptions = mongoose.model('subscriptions');
var Comments = mongoose.model('comments');

router.get('', function(req, res){
	res.send({message: 'Welcome to the comments! This is only for authenticated users'});
});

router.get('/all', function(req, res){
	Comments.find({}, function(err, comments){
		return res.send(comments);
	});
});

function getCommentsById(req, res, next){
	var post_id = req.params.post_id;
	Comments.find({post_id: post_id}).lean().exec(function(err, comments){
		if (!comments) {
			req.comments = [];
			next();
		}


		// For likes
		var commentsArr = [];
		var created_by_like = req.ip;

		comments.forEach(function(comment, i){
			commentsArr.push(comment.created_by);
			// What about likes?

			if(created_by_like){
				Likes.findOne({object: comment._id, created_by: created_by_like}, function(err, like){
					if(like){
						comment.isLiked = true;
					} else {
						comment.isLiked = false;
					}
				});
			} else {
				comment.isLiked = false;
			}
		});

		Users.find({_id: { $in : commentsArr}}).select('photo online alias username').lean().exec(function(err, users){
			comments.forEach(function(comment, i){
				users.forEach(function(user, e){
					if(comment.created_by == user._id){
						comments[i].user = user;
					}
				});
			});

			req.comments = comments;
			next();
		});
	});
}

router.get('/:post_id', getCommentsById, function(req, res){
	var comments = req.comments;
	return res.send(comments);
});

router.delete('/:comment_id', function(req, res){
	if (!req.isAuthenticated()) {
		return res.send({error: 1, message: 'Only authenticated users can remove comments'});
	}
	var comment_id = req.params.comment_id;
	var created_by = req.session.passport.user;

	// finding post with this comment to check the owner of the post
	Comments.findById(comment_id, function(err, comment){
		if (!comment) {
			return res.send({error: 1, message: 'Comment doesnt exist'});
		}

		Posts.findById(comment.post_id, function(err, post){
			if (!post) {
				return res.send({error: 1, message: 'Post doesnt exist.'});
			}

			// only owner of the post and owner of the comment
			// can remove the comment.
			if (created_by === post.created_by ||
				created_by === comment.created_by) {

				// removing comment
				Comments.remove({_id: comment_id}, function(err, comment){
					return res.send({error: 0, message: 'Comment has been removed'});
				})
			} else {
				return res.send({error: 1, message: 'You cant remove this comment'});
			}
		});
	});
});

router.post('', function(req, res){
	if (!req.isAuthenticated()) {
		return res.send({error: 1, message: 'Only authenticated users can add comments'});
	}

	var post_id = req.body.post_id;
	var text = req.body.text;
	var photo = req.body.photo;
	var created_by = req.session.passport.user;

	if (!post_id) {
		return res.send({error: 1, message: 'no post id given'});
	}
	if (!text) {
		return res.send({error: 1, message: 'text not given'});
	}

	Posts.findById(post_id, function(err, post){
		if (!post) {
			return res.send({error: 1, message: 'not found post with this id'});
		}


		// get last comments from this created_by
		Comments.findOne({created_by: created_by}).sort({_id: -1}).exec(function(err, comment){

			if (comment && comment.text == text) {
				return res.send({error: 1, message: 'you cant leave 2 equal comments in a row'});
			} else {
				createComment();
			}
		});		
	});

	function createComment () {
		var comment = new Comments();
		comment.post_id = post_id;
		comment.text = text;
		comment.created_by = created_by;
		if (photo) {
			comment.attachments.photo = photo;
		}
		comment.save(function(asd){
			return res.send({status: 1, message: 'Comment has been created successfully.'});
			console.log(asd);
		});
	}
});

module.exports = router;
module.exports.getCommentsById = getCommentsById;