/*jshint esversion: 6 */
var mongoose = require('mongoose')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

var Notifications = mongoose.model('notifications')
var Users = mongoose.model('users')
var Posts = mongoose.model('posts')

var isUserExist = require('../classUsers').isUserExist

const removeNotification = (notification) => {
	return new Promise(resolve => {
		if (!notification.user_id ||
			!notification.item_id || 
			!notification.keyCode) {
			return resolve({status: 0, message: 'notification elements is not enough'})
		}
		Notifications.findOneAndRemove(notification, (err) => {
			return resolve({status: 1, message: 'notification was removed'})
		})
	})
}

module.exports = removeNotification