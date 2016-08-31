/*jshint esversion: 6 */
var express = require('express')
var mongoose = require('mongoose')
var router = express.Router()
var tools = require('./../tools.js')

var Posts = mongoose.model('posts')
var Users = mongoose.model('users')
var Likes = mongoose.model('likes')
var Subscriptions = mongoose.model('subscriptions')

const vkUsers = require('../vk/vkUsers')
const vkPhotos = require('../vk/vkPhotos')
const vkFriends = require('../vk/vkFriends')

const getOnline = require('./users/getOnline')
const isFollowingUser = require('./users/isFollowingUser')
const isUserExist = require('./users/isUserExist')
const getUserById = require('./users/getUserById')

const getVisitor = require('./users/getVisitor')
const getMyself = require('./users/getMyself')
const authenticate = require('./users/authenticate')

// const getFinePeople = require('./users/getFinePeople')
// console.log(getFinePeople)
const getFriends = require('./users/getFriends')

const onlineManager = require('./users/onlineManager')

router.get('/friends', authenticate, getFriends)

const isFreeAlias = require('./users/isFreeAlias')

router.get('/isfree/:alias', isFreeAlias)

router.all('/', function(req, res){
	res.send({message: 'Welcome to the Users api'})
});

const getUser = require('./users/getUser')
router.get('/:alias', getUser, function(req, res){
	if(req.getUser == null){
		res.send({user:0})
	} else {
		res.send(req.getUser);
	}
})

const findMe = require('./users/findMe')
router.post('/findme', findMe)


module.exports = router;

module.exports.getUser      = getUser
module.exports.getVisitor   = getVisitor
module.exports.getMyself    = getMyself

module.exports.authenticate = authenticate
// module.exports.getFinePeople = getFinePeople
module.exports.getUserById = getUserById
module.exports.isUserExist = isUserExist
