var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var tools = require('./../tools.js');
var async = require('async');

var Users = mongoose.model('users');
var Subscriptions = mongoose.model('subscriptions');
var Notifications = require('./classNotifications.js');


router.post('/follow', function(req, res){
	if(!req.isAuthenticated()){
		return res.send({status: -1, message:"Чтобы подписаться на этого пользователя, вы должны зарегистрироваться."});
	}

	//Only ID'S
	// No aliases because trouble trouble you

	var follower = req.session.passport.user;
	var following = req.body.following;

	if(!following){
		return res.send({status:0, message:"Вы не выбрали объект подписки."});
	}

	var subs = {};
	Users.findOne({alias: following}, function (err, user) {
		if(err) throw err;
		if(!user){
			return res.send({status:0, message:"Пользователя, на которого Вы хотите подписаться, не существует."});
		} else {
			subs.follower = follower;
			following = user._id;
			subs.following = user._id;
			subscribe();
		}
	});

	

	// Users.findById(following, function(err, user){
	// 	if(err) throw err;
	// 	if(!user){
	// 		return res.send({status:0, message:"Пользователя, на которого Вы хотите подписаться, не существует."});
	// 	} else {
	// 		subs.follower = follower;
	// 		subs.following = user._id;
	// 		subscribe();
	// 	}
	// });
	
	
	function subscribe(){
		Subscriptions.findOne(subs, function(err, subscription){
			if(!err){
				// There is a subscription between follower and following
				if(subscription){
					// Delete this subscription
					Subscriptions.remove(subs, function(err){
						if(err) throw err;

						// Decrementing the value of followers of user
						updateFollowers(false);


						Subscriptions.count({following:following}, function(err, count){
							Notifications.removeNotification({
								user_id: following,
								keyCode: 2,
								item_id: follower
							});
							return res.send({status:2, message:"Подписка успешно отменена", current: count});
						});
						
					});
				} else {
					var newSubcription = new Subscriptions({
						follower: follower,
						following: following
					});
					newSubcription.save(function(err){
						// Incrementing the value of followers
						updateFollowers(true);



						Subscriptions.count({following:following}, function(err, count){
							Notifications.createNotification({
								user_id: following,
								keyCode: 2,
								item_id: follower
							});
							return res.send({status:1, message:"Подписка успешно оформлена", current: count});
						});
					});
				}
			}
		});
	}
	function updateFollowers(index){
		// true - increment
		// false - decrement
		if (index === true){
			var increment = 1;
		} else if(index === false){
			var increment = -1;
		}
		Users.findById(following, function(err, user){
			if(!user){
				return 0;
			}

			if(user.stats.followers == 0 && increment == -1){
				user.stats.followers = 0;
			} else {
				user.stats.followers = user.stats.followers + increment;
			}
			
			console.log(user.stats.followers);
			user.save();
		});
		Users.findById(follower, function(err, user){
			if(user.stats.following <= 0 && increment == -1){
				user.stats.following = 0;
			} else {
				user.stats.following = user.stats.following + increment;
			}
			
			user.save();
		});
	}
});

router.get('/status/:following', function(req, res){
 	if (!req.isAuthenticated()) {
 		res.send({error: 1, message: 'This method [REQUEST_FOLLOWING_STATUS] requires authentication'});
 	}
	var follower = req.session.passport.user;
	var following = req.params.following; // Alias
	if(!following || !follower){
		return res.send({message: "Невозможно получить статус, так как один из  недоступен."});
	}
	if(follower == following){
		return res.send({message:"Если считать, что Вы подписались на самого себя, то пожалуйста!"});
	}

	console.log("FOLLOWER: "+follower);
	console.log("FOLLOWING: "+following);

	Users.findOne({alias: new RegExp('^'+following+'$', "i")}, function(err, user){
		if(user){
			var userid = user._id;
			var searchObj = {
				follower: follower,
				following: userid
			}
			getStatus(searchObj);
		}
	});
	var getStatus = function(searchObj){
		Subscriptions.findOne(searchObj, function(err, subscription){
			if(err) throw err;
			var status;
			if(subscription){
				status = true;
			} else {
				status = false;
			}
			res.send({status: status});
		});
	}
	
});

function getFollowers(req, res, next){
	var alias = req.params.alias;
	if(alias){
		alias = alias.toLowerCase();
	} else {
		req.getFollowers = {status:0};
		return res.redirect('/404');
	}
	// Find a man, whoose followers we gonna find
	var User = Users.findOne({alias: alias}).select('username alias');
	User.exec(function(err, user){
		if(err) throw err;
		if(user){
			var following = user._id;
			var query = Subscriptions.find({following: following}).select('follower');

			query.exec(function(err, subscriptions){
				if(tools.isEmpty(subscriptions)){
					req.getFollowers = {status:2, user:user, followers:{}};
					return next();
				}

				var followersArr = [];
				for(var i=0; i<subscriptions.length; i++){
					followersArr.push(subscriptions[i].follower);
				}

				var secondQuery = Users.find({ _id : { $in: followersArr } }).select({username:1, alias:1, photo:1, status:1, 'online.status':1, background: 1}).lean().sort({_id: -1});

				secondQuery.exec(function(err, followers){
					var myID = 'test id';
					if (req.isAuthenticated()) {
						myID = req.session.passport.user;
					}

					// this about you.
					async.each(followers, function(follower, callback){
						Subscriptions.findOne({follower: myID, following: follower._id}, function(err, subscription){
							if(subscription){
								console.log('follower_id', follower._id);
								follower.isFollowing = true;
							} else {
								follower.isFollowing = false;
							}
							callback(null);
						});
					}, function(err){
						req.getFollowers = {status: 1, user: user, followers: followers}
						return next();
					});
				});
			});
		} else {
			req.getFollowers = {status: 0}
			return next();
		}
	});
}

function getFollowing(req, res, next){
	var alias = req.params.alias;
	console.log(alias);
	if(!alias){
		req.getFollowers = {status:0};
		// next();
		return res.send({following: [], error: 0, message: 'No following'});
	}
	alias = alias.toLowerCase();

	// Find a man, whoose followers we gonna find
	Users.findOne({alias: alias}, function(err, user){
		if(err) throw err;
		if(!user){
			return noFollowing();
		}

		var follower = user._id;
		Subscriptions.find({follower: follower}).select('following').exec(function(err, subscriptions){
			if(tools.isEmpty(subscriptions)){
				return noFollowing();
			}

			var followingArr = [];
			subscriptions.forEach(function(subscription){
				followingArr.push(subscription.following);
			});

			var secondQuery = Users.find({ _id : { $in: followingArr } }).select({username:1, alias:1, photo:1, status:1, 'online.status':1, 'background':1}).lean().sort({_id: -1});
			secondQuery.exec(function(err, following){
				if(!following){
					// Return no following.
					noFollowing();

					// Trouble has occured with following list
					// Because there is a list of following people, but not such users.
					fixFollowing(subscriptions);
				}
				req.getFollowing = {following: following};
				return next();
			});
		});
	});

	function noFollowing(){
		req.getFollowing = {following: []};
		return next();
		// return res.send({following: [], error: 0, message: 'No following'});
	}
}

// Remove an undefined subscriptions from subscriptions list.
function fixFollowing(subscriptions){
	subscriptions.forEach(function(subscription){
		var following = subscription.following;
		Users.findOne({following:following}, function(err, user){
			if(!user){
				removeSubscriptions(subscription);
			}
		});
	});

	function removeSubscriptions(subscription){
		var follower = subscription.follower;
		var following = subscription.following;
		if(!follower || !following){
			console.log('cant remove subscription because follower or following is undefined');
		}
		Subscriptions.remove({following:following}, function(err){
			console.log('Subscription with ' + follower + ' and' + following + ' was fixed');
		});
	}

}

router.get('/followers/:alias', getFollowers, function(req, res){
	res.send(req.getFollowers);
});


router.get('/following/:alias', getFollowing, function(req, res){
	res.send(req.getFollowing);
});


module.exports = router;
module.exports.getFollowers = getFollowers;
module.exports.getFollowing = getFollowing;