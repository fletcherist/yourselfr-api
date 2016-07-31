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


function setVKPhoto (userID) {
	return new Promise ((resolve, reject) => {
		if (!userID) {
			console.log('userID is not defined');
			resolve(false);
			return false;
		}

		Users.findById(userID, (err, user) => {
			if (!user) {
				console.log('User with this id not found.');
				resolve(false);
				return false;
			}

			var vkID = user.vkID;
			if (!vkID) {
				console.log('User is not connected with VK');
				resolve(false);
				return false;
			}

			vk.request('users.get', {'user_id' : vkID, fields: ['photo_max']}, function(_o) {
				if (!_o || !_o.response || !_o.response[0]) {
					console.log('VK server error.');
					resolve(false);
					return false;
				}
			    console.log(_o.response[0].photo_max);
			    var photo = _o.response[0].photo_max;
			    user.photo = photo;
			    user.save(() => {
			    	console.log(`User «${user.username}» photo was changed`);
			    	resolve(false);
			    	return false;
			    });
			});
		});
	})
}

const setPhotosForAllVKUsers = async (() => {
	var users = await (vkUsers.findVKUsers());
	users.forEach((user) => {
		await (setVKPhoto(user._id));
		await (Promise.delay(1000));
	})
});

module.exports.setVKPhoto = setVKPhoto;
module.exports.setPhotosForAllVKUsers = setPhotosForAllVKUsers;
