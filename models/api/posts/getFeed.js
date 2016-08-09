var mongoose = require('mongoose')
var Posts = mongoose.model('posts')
var Users = mongoose.model('users')
var Likes = mongoose.model('likes')
var Subscriptions = mongoose.model('subscriptions')
var tools = require('../../tools.js')

function getFeed(req, res, next){
	if (!req.isAuthenticated()){
		return res.send({error: 1, message: 'Feed is only for authenticated users.'})
	}
	var id = req.session.passport.user

	Subscriptions.find({follower: id}, function(err, subscriptions){
		if(!subscriptions){
			req.feed = []
			return next()
		}
		var subsArr = []
		subscriptions.forEach(function(subscription){
			subsArr.push(subscription.following)
		})
			
		Posts
			.find({created_by: { $in : subsArr}})
			.limit(15).lean()
			.sort({_id: -1}).exec(function(err, posts){
			if(tools.isEmpty(posts)){
				req.feed = []
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
				req.feed = posts
				return next()
			})
		})
	})
}

module.exports = getFeed