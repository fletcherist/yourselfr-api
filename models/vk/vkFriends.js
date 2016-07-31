/*jshint esversion: 6 */
// #
// # VK Freinds on Yourselfr.
// # 

var mongoose = require('mongoose');
var Users = mongoose.model('users');
var VK = require('vksdk');
var vk = new VK({
   'appId'     : 5023767,
   'appSecret' : '6mZAz0f8JfYiZqEzZ9Y',
   'language'  : 'ru'
});

var vkUsers = require('./vkUsers');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

const findVKFriends = async ((vkID, socialVK) => {
	return new Promise ((resolve, reject) => {
		var search = '';
		if (!vkID) {
			var user = await (vkUsers.getVKUserByAlias(socialVK));
			if (user && user.response) {
				search = user.response[0].id;
			}
		} else {
			search = vkID;
		}
		
		console.log(search);
		vk.request('friends.get', {user_id: search}, (_o) => {
			if (!_o || !_o.response) {
				console.log('[findVKFriends] VK server error.');
				return resolve(false);
			}
			var friends = _o.response.items;
			console.log(`[findVKFriends] ${friends.length} were found`);
			Users.find({vkID: { $in: friends }}).select('username profileType alias status photo background social').exec((err, users) => {
				return resolve(users);
			});
		});
	});
});

module.exports.findVKFriends = findVKFriends;