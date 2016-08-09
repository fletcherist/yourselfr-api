const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')
const Likes = mongoose.model('likes')
var tools = require('../../tools.js')

function endlessFeed(req, res, next){
	Posts.find().limit(15).lean().sort({_id: -1}).exec(function(err, posts){
		if(tools.isEmpty(posts)){
			req.endlessFeed = []
			return next()
		}

		// For likes
		var postsArr = []

		var created_by_like = req.ip

		posts.forEach(function(post, i){
			postsArr.push(post.created_by)
			// What about likes?

			if(created_by_like){
				Likes.findOne({object: post._id, created_by: created_by_like}, function(err, like){
					if(like){
						post.isLiked = true
					} else {
						post.isLiked = false
					}
				})
			} else {
				post.isLiked = false
			}
		})

		Users.find({_id: { $in : postsArr}}).select('photo online alias username').lean().exec(function(err, users){
			posts.forEach(function(post, i){
				users.forEach(function(user, e){
					if(post.created_by == user._id){
						posts[i].user = user
					}
				})
			})
			req.endlessFeed = posts
			next()
		})
	})
}

module.exports = endlessFeed