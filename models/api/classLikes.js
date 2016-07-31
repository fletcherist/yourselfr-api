var express = require('express')
var mongoose = require('mongoose')
var router = express.Router()
var tools = require('./../tools.js')

var Posts = mongoose.model('posts')
var Users = mongoose.model('users')
var Likes = mongoose.model('likes')
var Comments = mongoose.model('comments')

var Notifications = require('./classNotifications.js')

// api/likes

// Set a like
router.post('', function(req, res){
	var object = req.body.object
	var created_by = req.ip
	if(!object){
		return res.send({message: "Empty query"})
	}
	Posts.findById(object, function(err, post){
		if(!post){
			return res.send({message: "error"})
		}
		Likes.findOne({object: object, created_by: created_by}, function(err, like){

			if(err) throw err

			var status
			console.log(like)
			if(like){
				Likes.remove({object: object, created_by: created_by}, function(err, result){})

				if(post.likes > 0){
					post.likes -= 1
				} else {
					post.likes = 0
				}
				status = 0

				// Remove notification
				Notifications.removeNotification({
					user_id: post.created_by,
					keyCode: 3,
					item_id: post._id
				}).then(res => console.log(res))

			} else {
				var newLike = new Likes()
				newLike.object = object
				newLike.created_by = created_by
				newLike.save(function(err){
					if(err) throw err
				})

				status = 1
				post.likes += 1

				Notifications.createNotification({
					user_id: post.created_by,
					keyCode: 3,
					item_id: post._id
				}).then(res => console.log(res))
			}
			post.save(function(){
				return res.send({status: status, now: post.likes})
			})
		})
	})
})

router.post('/comment', function(req, res){
	var object = req.body.object
	var created_by = req.ip
	if(!object){
		return res.send({message: "Empty query"})
	}
	Comments.findById(object, function(err, comment){
		if(!comment){
			return res.send({message: "No comment on this id"})
		}
		Likes.findOne({object: object, created_by: created_by}, function(err, like){

			if(err) throw err

			var status
			console.log(like)
			if(like){
				Likes.remove({object: object, created_by: created_by}, function(err, result){})

				if(comment.likes > 0){
					comment.likes -= 1
				} else {
					comment.likes = 0
				}
				status = 0
			} else {
				var like = new Likes()
				like.object = object
				like.created_by = created_by
				like.save(function(err){
					if(err) throw err
				})

				status = 1
				comment.likes += 1
			}
			comment.save(function(){
				return res.send({status: status, now: comment.likes})
			})
		})
	})
})

// api/likes/:id
router.get('/:id', function(req, res){
	var id = req.params.id

	Likes.find({object: id}, function(err, likes){
		var likes = likes
		var created_by = req.session.like

		likes.forEach(function(like){
			if(like.created_by == created_by){
				like.owner = true
			}
		})
		res.send(likes)

	})
})


router.post('/favourite', function(req, res, next){
	var post_id = req.body.post_id

	Posts.findById(post_id, function(err, post){
		if (err) throw err
		if (!post){
			return es.send({error:1, message:'this post does not exist'})
		}

		if (req.session.passport.user == post.created_by){
			if (post.favourite == false){
				post.favourite = true
			} else {
				post.favourite = false
			}


			post.save(function(){
				var status = post.favourite
				switch (status){
					case true:
						return res.send({message:'post wa added to favourite list', status:status})
					break
					case false:
						return res.send({message:'post was removed from your favourite list', status:status})
					break
				}
				
			})
		} else {
			return res.send({error:1, message:'you have no control on this post'})
		}
	})
})

module.exports = router