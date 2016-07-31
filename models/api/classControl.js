var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var router = express.Router();
var tools = require('./../tools.js');


var Posts = mongoose.model('posts');
var Users = mongoose.model('users');
var Likes = mongoose.model('likes');
var Stats = mongoose.model('stats');
var Subscriptions = mongoose.model('subscriptions');

// Count class
var Control = function(){
	this.countUnpublishedPosts = function(){
		Users.find({profileType : 2}, function(err, users){
			users.forEach(function(cuser, i){
				Users.findById(cuser._id, function(err, user){
					async.parallel([
						function(callback){
							Posts.count({type: 2, created_by: user._id}, function(err, count){
								user.stats.unpublishedPosts = count;
								callback(null);
							});
						}
					], function(){
						user.save();
					});
				});
			});
		});
	};
	this.banUser = function(userID, reason){
		if(!userID || !reason){
			return false;
		}
		Users.findById(userID, function(err, user){
			if (err) throw err;
			if(user){
				user.ban.status = true;
				user.ban.reason = reason;
				user.save(function(err){
					if(err) throw err;
					return true;
				});
			}
		});
	};
	this.unbanUser = function(userID){
		if(!userID){
			return false;
		}
		Users.findById(userID, function(err, user){
			if(err) throw err;
			if(user){
				user.ban.status = false;
				user.ban.reason = "";
				user.save(function(err){
					if(err) throw err;
					return true;
				});
			}
		});
	};

	this.deleteUser = function(userID){
		console.log(userID);
		Users.remove({_id: userID}, function(err){
			if(err) throw err;
			return true;
		});
	};

	
	this.recountPosts = function(){
		Users.find({}, function(err, users){
			users.forEach(function(user){
				Posts.count({created_by: user._id}, function(err, count){
					user.stats.posts = count;
					user.save();
				});
			});
		});
	};
};


var fixPhotoPaths = function(req, res, next){
	Users.find({photo: {$ne : 'nophot.png'}}, function(err, users){
		users.forEach(function(user){
			var reg = /\/([a-z0-9]{0,}\.(png|jpg|jpeg))$/;

			if(user.photo.match(reg)){
				var photoName = user.photo.match(reg);

				// take only name and extension 
				// blalbla.jpg
				photoName = photoName[1].toString();

				user.photo = 'http://yourselfr.com/upload/avatar/' + photoName;

				console.log(user.photo);
				user.save();
			}
		});
		res.send({status:1, message:'photo paths were fixed to absolute'});
	});
};

var recountSubscriptions = function(req, res, next){
	Users.find({}, function(err, users){
		for(var i=0;i<users.length; i++){
			// Counting  followers
			var id = users[i];
			Users.findById(id, function(err, user){
				async.parallel([
					function(callback){
						Subscriptions.count({following: user._id}, function(err, count){
							user.stats.followers = count;
							callback(null);
						});
					},
					function(callback){
						Subscriptions.count({follower: user._id}, function(err, count){
							user.stats.following = count;
							callback(null);
						});
					},
				], function(){
					user.save();
				});
			});
		}
		
		var message = "Followers and following were recounted on " + i + " guys";
		console.log(message);

		res.send({status:1, message:message});
	});
};

var cropAllBackgrounds = require('../upload/crop').cropAllBackgrounds;
var cropBackgrounds = function (req, res) {
	cropAllBackgrounds();
	res.send({status: 1, message: 'Backgrounds are cropped!'});
};

var setPhotosForAllVKUsers = require('../vk/vkPhotos').setPhotosForAllVKUsers
var setVKAvatars = (req, res) => {
	setPhotosForAllVKUsers();
	res.send({status: 1, message: 'Photos were set for all VK users.'});
};


router.post('', function(req, res){
	Users.find({}).sort({_id: -1}).exec(function(err, users){
		res.send({status: 1, users:users});
	});
});

router.post('/count-unpublished-posts', function(req, res){
	control.countUnpublishedPosts();
	return res.send({message: "Неопобликованные посты всех пользователей пересчитаны."});
});

router.post('/recount-posts', function(req, res){
	control.recountPosts();
	return res.send({message: "Счётчик постов всех пользователей пересчитан."});
});

router.post('/ban/user', function(req, res){
	var userID = req.body.userID;
	var reason = req.body.reason;

	if(key == original){
		if(control.banUser(userID, reason)){
			return res.send({message: "Пользователь был забанен успешно."});
		} else {
			return res.send({message: "Возникли какие-то трудности при бане пользователя."});
		}
	}
});

router.post('/unban/user', function(req, res){
	var userID = req.body.userID;
	if(control.unbanUser(userID, reason)){
		return res.send({message: "Пользователь был забанен успешно."});
	} else {
		return res.send({message: "Возникли какие-то трудности при бане пользователя."});
	}
});

router.post('/delete/user', function(req, res){
	var userID = req.body.userID;
	control.deleteUser(userID);
	return res.send({message: "Пользователь был удалён успешно."});
});


module.exports = router;

module.exports.fixPhotoPaths = fixPhotoPaths;
module.exports.recountSubscriptions = recountSubscriptions;
module.exports.cropBackgrounds = cropBackgrounds;
module.exports.setVKAvatars = setVKAvatars;