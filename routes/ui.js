var express = require('express');
var router = express.Router(); 
var path = require('path');
var mongoose = require('mongoose');
var async = require('async');
var tools = require('../models/tools.js');

var Posts = mongoose.model('posts');
var Users = mongoose.model('users');
var Likes = mongoose.model('likes');
var Stats = mongoose.model('stats');
var Subscriptions = mongoose.model('subscriptions');

var api = require('./api');

var relative = __dirname.substr(0, __dirname.length - 7);
// var relative = '/Users/yafilipp/yo'
console.log(relative);
router.use(express.static(relative + '/dist'));
router.get('*', function(req, res, next){
	res.sendFile(relative+ '/dist/index.html')
});

module.exports = router;