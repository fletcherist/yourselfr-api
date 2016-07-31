var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var async = require('async');

function getData(req, res, next) {
	next();
}
var Users = require('./classUsers');
var Posts = require('./classPosts');

router.get('/user/:alias', Users.getUser, Posts.getPosts, function(req, res, next){
	var user = req.getUser;
	var posts = req.posts;
	if (!user) {
		return res.send({error: 1, message: 'User is not defined'});
	}
	var object = {user: user, posts: posts};
	return res.send(object);
});

module.exports = router;