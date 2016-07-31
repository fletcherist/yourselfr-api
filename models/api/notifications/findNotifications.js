/*jshint esversion: 6 */
var mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

var Notifications = mongoose.model('notifications');
var Users = mongoose.model('users');
var Posts = mongoose.model('posts');

var isUserExist = require('../classUsers').isUserExist;

const findNotifications = (user_id) => {
	return new Promise (resolve => {
		if (!user_id) {
			return resolve({
				status: 0,
				count: 0,
				message: 'user id is not defined'
			});
		}
		Notifications.find({user_id: user_id}, (err, notifications) => {
			console.log(notifications.length + ' notifications found');
			resolve({
				status: 1,
				count: notifications.length,
				notifications: notifications
			});
		});
	});
};