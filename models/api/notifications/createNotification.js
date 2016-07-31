/*jshint esversion: 6 */
var mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

var Notifications = mongoose.model('notifications');
var Users = mongoose.model('users');
var Posts = mongoose.model('posts');

var isUserExist = require('../classUsers').isUserExist;

const createNotification = (notification) => {
	/*
		notification = {
			user_id: required,
			keyCode: required,
			item_id: required,
			message: ...
		}
	*/
	return new Promise (resolve => {
		if (!notification.user_id || 
			!notification.keyCode || 
			!notification.item_id) {
			return resolve({status: 0, message: 'not enough data'});
		}

		Users.findById(notification.user_id, (err, user) => {
			if (!user) {
				return resolve({status: 0, message: 'there is no user with this id'});
			}
			var newNotification = new Notifications();
			newNotification.user_id = notification.user_id;
			newNotification.keyCode = notification.keyCode;
			newNotification.item_id = notification.item_id;
			newNotification.save((res, notification) => {
				return resolve({status: 1, message: 'notification has been saved'});
			});
		});
		
	});
};

module.exports = createNotification;
