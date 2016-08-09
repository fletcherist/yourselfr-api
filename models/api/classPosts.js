var express = require('express')
var mongoose = require('mongoose')
var router = express.Router()
var tools = require('./../tools.js')
var async = require('async')
var Notifications = require('./classNotifications.js')
var getCommentsById = require('./classComments.js').getCommentsById

var Posts = mongoose.model('posts')
var Users = mongoose.model('users')
var Likes = mongoose.model('likes')
var Subscriptions = mongoose.model('subscriptions')

// api/posts
const getPosts    = require('./posts/getPosts')
const getFeed     = require('./posts/getFeed')
const endlessFeed = require('./posts/endlessFeed')
const sendPost    = require('./posts/sendPost')
const removePost  = require('./posts/removePost')
const moderation  = require('./posts/moderation')
const getLastPost = require('./posts/getLastPost')
const getNewPosts = require('./posts/getNewPosts')

function favourite(req, res, next){
	var alias = req.alias;

	Users.find({alias:alias}, function(err, user){
		var user_id = user._id;
		Posts.find({created_by:user_id, favourite:1}, function(err, posts){
		});
	});
}


router.get('', function(req, res){
	return res.send({message: "Welcome to the Posts Api"});
});
//
// Publish a post.
// api/posts
router.post('', sendPost)

// api/posts/:id
router.get('/remove/:id', removePost)
router.post('/moderation', moderation)

router.get('/last/:alias', getLastPost)


// find all posts (take id of post that needed)
// go within these posts and increment counter until reaching post with the same id
// take this count as limit to getPosts and go ahead.
router.get('/new/:alias/:id', getNewPosts)


// api/posts/feed
router.get('/feed', getFeed, function(req, res){
	var feed = req.feed
	res.send(feed)
});

router.get('/endless', endlessFeed, function (req, res){
	var endlessFeed = req.endlessFeed
	res.send(endlessFeed)
})
router.get('/:alias', getPosts, function(req, res){
	var posts = req.posts
	if (!posts) {
		return res.send({status:0, error:1, message: 'There\'s no posts on this alias.'})
	}
	res.send(posts)
});
router.get('/:alias/(:offset)', getPosts, function(req, res){
	var posts = req.posts
	if (!posts) {
		return res.send({status:0, error:1, message: 'There\'s no posts on this alias.'})
	}
	res.send(posts)
});

function devRemovePost(req, res){
	var post_id = req.body.post_id
	Posts.findByIdAndRemove(post_id, function(err, posts){
		res.send({status:1, message: 'post was removed'})
	})
}

module.exports = router
module.exports.getPosts = getPosts
module.exports.getFeed = getFeed
module.exports.favourite = favourite
module.exports.devRemovePost = devRemovePost