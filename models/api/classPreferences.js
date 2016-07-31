var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var tools = require('./../tools.js');

var Posts = mongoose.model('posts');
var Users = mongoose.model('users');
var Likes = mongoose.model('likes');
var Subscriptions = mongoose.model('subscriptions');

var vkUsers = require('../vk/vkUsers');
var vkPhotos = require('../vk/vkPhotos');

var changeUsername = require('./preferences/username');
var changeAlias = require('./preferences/alias');
var changeStatus = require('./preferences/status');
var changeEmail = require('./preferences/email');
var socialNetworks = require('./preferences/socialNetworks');

function authenticate (req, res, next) {
	if(req.isAuthenticated()){
		next();
	} else {
		res.send({message: 'You have no permission to do this. Need Authentication'})
	}
}

router.post('/change/username', authenticate, changeUsername);
router.post('/change/alias', authenticate, changeAlias);
router.post('/change/status', authenticate, changeStatus);
router.post('/change/email', authenticate, changeEmail);

router.post('/change/vk', authenticate, socialNetworks.changeVK);
router.post('/change/twitter', authenticate, socialNetworks.changeTwitter);
router.post('/change/tumblr', authenticate, socialNetworks.changeTumblr);
router.post('/change/instagram', authenticate, socialNetworks.changeInstagram);
router.post('/change/askfm', authenticate, socialNetworks.changeAskFm);
router.post('/change/facebook', authenticate, socialNetworks.changeFacebook);

module.exports = router;