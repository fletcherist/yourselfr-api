var mongoose = require('mongoose');
var Users = mongoose.model('users');
var VK = require('vksdk');
var vk = new VK({
   'appId'     : 5023767,
   'appSecret' : '6mZAz0f8JfYiZqEzZ9Y',
   'language'  : 'ru'
});

var async = require('asyncawait/async');
var await = require('asyncawait/await');

// Request 'users.get' method


module.exports.findVKUsers = () => {
	return new Promise ((resolve, reject) => {
		Users.find({}).sort({_id: -1}).lean().exec((err, users) => {
			var vkUsers = [];
			var users = users;
			users.forEach((user) => {
				if (user.vkID !== '0') {
					users.push(user);
				}
			});
			resolve(users);
		});
	});
}

module.exports.getUserByAlias = (alias) => {
	return new Promise ((resolve, reject) => {
		Users.findOne({alias: alias}, function(err, user) {
			if (!err && user) {
				return resolve(user);
			}
			return resolve(false);
		});
	});
}

module.exports.getVKUserByID = (id) => {
	return new Promise ((resolve, reject) => {
		Users.findOne({vkID: id}, function(err, user) {
			if (!err && user) {
				return resolve(user);
			}
			return resolve(false);
		});
	});
}

module.exports.getVKUserByAlias = (alias) => {
	return new Promise ((resolve, reject) => {
		vk.request('users.get', {'user_ids' : alias}, function(_o) {
			if (!_o) {
				console.log('VK server error.');
				resolve(false);
				return false;
			}
			return resolve(_o);
		});
	});
}




