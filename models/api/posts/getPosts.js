const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')
const Likes = mongoose.model('likes')
const async = require('async')
const getCommentsById = require('../classComments.js').getCommentsById

function getPosts(req, res, next){
	var alias = req.params.alias || undefined
	if(alias){
		alias = alias.toLowerCase()
	}
	var type  = req.params.type
	var offset = req.params.offset ? req.params.offset : 0
	var limit = req.limit || 25

	Users.findOne({alias: alias}, function(err, user){
		if(!user) {
			req.posts = null
			next()
		} else {
			var user_id = user._id
			Posts
				.find({created_by: user_id, type: 1})
				.sort({_id: -1})
				.skip(offset)
				.limit(limit)
				.lean()
				.exec(function(err, posts){
				var created_by_like = req.ip
				if(created_by_like){
					async.each(posts, function(post, callback){
						Likes.findOne({object: post._id, created_by: created_by_like}, function(err, like){
							if(like){
								post.isLiked = true
							} else {
								post.isLiked = false
							}

							req.params.post_id = post._id
							getCommentsById(req, res, function(){
								post.comments = req.comments
								callback(null)
							})
						})
					}, function(err){
						req.posts = posts
						next()
					})
				} else {
					posts.forEach(function(post){
						post.isLiked = false
					})
					req.posts = posts
					next()
				}
			})
		}
	})
}

module.exports = getPosts