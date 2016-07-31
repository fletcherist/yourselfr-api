var express = require('express')
var router = express.Router()

var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

var notifyWhenPost = require('./notifications/notifyWhenPost')
var createNotification = require('./notifications/createNotification')
var removeNotification = require('./notifications/removeNotification')
var findNotifications = require('./notifications/findNotifications')

router.get('', async((req, res) => {
	var user_id = req.session.passport.user
	var notifications = await(findNotifications(user_id))
	res.send(notifications)
}))

module.exports = router
module.exports.notifyWhenPost = notifyWhenPost
module.exports.createNotification = createNotification
module.exports.removeNotification = removeNotification
module.exports.findNotifications = findNotifications
