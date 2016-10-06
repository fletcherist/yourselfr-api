// Requiring node modules
var express = require("express")
var mongoose = require('mongoose')
var router = express.Router()

var fs = require('fs')
var busboy = require('connect-busboy')
var lwip = require('lwip')
var Users = mongoose.model('users')
var tools = require('./tools.js')

var avatar = require('./upload/avatar')
var background = require('./upload/background')
var photo = require('./upload/photo')

router.use(busboy())

router.post('/avatar', avatar.uploadAvatar)
router.post('/avatar/delete', avatar.removeAvatar)

router.post('/background', background.uploadBackground)
router.post('/background/delete', background.removeBackground)

router.post('/photo', photo.uploadPhoto)

module.exports = router
