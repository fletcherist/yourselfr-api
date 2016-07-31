var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var tools = require('./../tools.js');
var async = require('async');
var Notifications = require('./classNotifications.js');
var getCommentsById = require('./classComments.js').getCommentsById;

var Posts = mongoose.model('posts');
var Users = mongoose.model('users');
var Likes = mongoose.model('likes');
var Subscriptions = mongoose.model('subscriptions');

// api/posts
function getPosts(req, res, next){
	var alias = req.params.alias || undefined;
	if(alias){
		alias = alias.toLowerCase();
	}
	var type  = req.params.type;
	var offset = req.params.offset ? req.params.offset : 0; // Load more function
	var limit = req.limit || 25;

	Users.findOne({alias: alias}, function(err, user){
		if(!user) {
			req.posts = null;
			next();
		} else {
			var user_id = user._id;
			Posts.find({created_by: user_id, type: 1}).sort({_id: -1}).skip(offset).limit(limit).lean().exec(function(err, posts){
				var created_by_like = req.ip;
				if(created_by_like){
					async.each(posts, function(post, callback){
						Likes.findOne({object: post._id, created_by: created_by_like}, function(err, like){
							if(like){
								post.isLiked = true;
							} else {
								post.isLiked = false;
							}

							req.params.post_id = post._id;
							getCommentsById(req, res, function(){
								post.comments = req.comments;
								callback(null);
							});
							
						});
					}, function(err){
						req.posts = posts;
						next();
					});
				} else {
					posts.forEach(function(post){
						post.isLiked = false;
					});
					req.posts = posts;
					next();
				}
			});
		}
	});
}

function feed(req, res, next){
	if (!req.isAuthenticated()){
		return res.send({error: 1, message: 'Feed is only for authenticated users.'});
	};
	var id = req.session.passport.user;

	Subscriptions.find({follower: id}, function(err, subscriptions){
		if(!subscriptions){
			req.feed = [];
			return next();
		}
		var subsArr = [];
		subscriptions.forEach(function(subscription){
			subsArr.push(subscription.following);
		});
			
		Posts.find({created_by: { $in : subsArr}}).limit(15).lean().sort({_id: -1}).exec(function(err, posts){
			if(tools.isEmpty(posts)){
				req.feed = [];
				return next();
			}

			// For likes
			var postsArr = [];

			var created_by_like = req.ip;

			posts.forEach(function(post, i){
				postsArr.push(post.created_by);
				// What about likes?

				if(created_by_like){
					Likes.findOne({object: post._id, created_by: created_by_like}, function(err, like){
						if(like){
							post.isLiked = true;
						} else {
							post.isLiked = false;
						}
					});
				} else {
					post.isLiked = false;
				}
			});

			Users.find({_id: { $in : postsArr}}).select('photo online alias username').lean().exec(function(err, users){
				posts.forEach(function(post, i){
					users.forEach(function(user, e){
						if(post.created_by == user._id){
							posts[i].user = user;
						}
					});
				})
				req.feed = posts;
				return next();
			});
		});
	});
}

function endlessFeed(req, res, next){
	Posts.find().limit(15).lean().sort({_id: -1}).exec(function(err, posts){
		if(tools.isEmpty(posts)){
			req.endlessFeed = [];
			return next();
		}

		// For likes
		var postsArr = [];

		var created_by_like = req.ip;

		posts.forEach(function(post, i){
			postsArr.push(post.created_by);
			// What about likes?

			if(created_by_like){
				Likes.findOne({object: post._id, created_by: created_by_like}, function(err, like){
					if(like){
						post.isLiked = true;
					} else {
						post.isLiked = false;
					}
				});
			} else {
				post.isLiked = false;
			}
		});

		Users.find({_id: { $in : postsArr}}).select('photo online alias username').lean().exec(function(err, users){
			posts.forEach(function(post, i){
				users.forEach(function(user, e){
					if(post.created_by == user._id){
						posts[i].user = user;
					}
				});
			})
			req.endlessFeed = posts;
			next();
		});
	});
}


function favourite(req, res, next){
	var alias = req.alias;

	Users.find({alias:alias}, function(err, user){
		var user_id = user._id;
		Posts.find({created_by:user_id, favourite:1}, function(err, posts){
		});
	});
}


router.get('', function(req, res){
	return res.send({message: "Welcome to the Posts Api"});
});
//
// Publish a post.
// api/posts
router.post('', function(req, res){
	var alias = req.body.created_by ? req.body.created_by.toLowerCase() : undefined;
	if(!alias){
		return res.send({message: "Empty alias"});
	}
	var photo = req.body.photo || undefined;
	var text = compileText(req.body.text);

	Users.findOne({alias: alias}, function(err, user){
		if(err) throw err;
		if(!user){
			return res.send({error: 1, message: "User not found."});
		}
			if(photo){

			} else {
				if(!text || text == ''){
					return res.send({error:1, message: "пустое сообщение отправить нельзя"});
				}
			}
			
			if(text.length > 400){
				return res.send({error:1, message: "Максимальная длина поста — 299 символов"});
			}
			// Check if this post not equals to the previous one
			// If it is -> Error message
			// Otherwise continue
			
			Posts.findOne({}).sort({_id: -1}).exec(function(err, post){
				if(post){
					if(post.text == text){
						return res.send({message: "Вы не можете отправить две одинаковые записи подряд."});
					}
				}
				// Check user profile type
				// If 1 send to wall.
				// If 2 send to moderating
				var newPost = new Posts();

				if(user.profileType == 2){
					newPost.type = 2;
					user.stats.unpublishedPosts += 1;
					user.save();
				} else {
					newPost.type = 1;
				}
				newPost.text = text;
				newPost.created_by = user._id;

				if(photo && photo !== 'undefined'){
					newPost.attachments.photo = photo;	
				}
				
				newPost.save(function(err, post){
					if(err) throw err;

					var message = (user.profileType == 1) ? "" : "Запись появится в блоге, как только "+ user.username + " её одобрит.";

					//Count the value of user's posts after publishing.
					tools.countUserPosts(user._id);
					Notifications.notifyWhenPost(user._id);
					Notifications.createNotification({
						user_id: user._id,
						keyCode: 1,
						item_id: post._id
					});


					return res.send({status: 1, message: message});
				});
			});
	});

	function compileText(text){
			var text = text;
			if(!text){
				return "";
			}
			// Replace all method
			String.prototype.replaceAll = function(search, replace){
			  return this.split(search).join(replace);
			}

			// Parse smile images into symbols

			// Symbols ## mean that is smile
			// Parse smile images into symbols
			var fReg = /<img[^>]*>/ig;
			var sReg = /tag=\"(.{0,10})\"/ig;


			var fArr = text.match(fReg); //Array with html codes of images
			var sArr = text.match(sReg); //Array with smile codes from html

			if(fArr && sArr){
				for(var i=0; i<fArr.length; i++){
					var smile = sArr[i].toString().slice(5, sArr[i].length -1);;
					text = text.replace(fArr[i], smile);
				}
			}

			console.log(text);
			
			text = escapeHtml(text);
			text = makeLinks(text);
			text = makeSmiles(text);


			console.log(text);
			return text;

			function escapeHtml(text) {
				var text = text
					// .replace(/\&nbsp;/g, " ")
					// .replace(/<div>/g, "\n")
					// .replace(/<\/div>/g, "\n")
					// .replace(/<br>/g, "\r\n")

					// .replace(/&/g, "&amp;")
					// .replace(/</g, "&lt;")
					// .replace(/>/g, "&gt;")
					// .replace(/"/g, "&quot;")
					// .replace(/'/g, "&#039;")
					// .replace(/^\s|\s$/g, '');
				return text;
			}

			function makeLinks(text){
				return text
					.replace(/http:\/\/[\S]{0,}/g, '<a href=\'$&\'>$&</a>')
					.replace(/^[a-zA-Z0-9.]{0,30}\.(org|ru|com|co)[.^\/]?.{0,70}/g, '<a href=\'http://$&\'>$&</a>)')
					.replace(/^[^http\/\/][a-zA-Z0-9.]{0,30}\.(org|ru|com)[.^\/]?.{0,70}/g, '<a href=\'http://$&\'>$&</a>');
			}

			function makeSmiles(text){
				var text = text;
				var emoji = {
					1:  {title: ':)', source: "D83DDE0A"},
					2:  {title: ':-D', source: "D83DDE03"},
					3:  {title: ';-)', source: "D83DDE09"},
					4:  {title: 'xD',  source: "D83DDE06"},
					5:  {title: ';-P', source: "D83DDE1C"},
					6:  {title: ':-p', source: "D83DDE0B"},
					7:  {title: '8-)', source: "D83DDE0D"},
					8:  {title: 'B-)', source: "D83DDE0E"},
					9:  {title: ':-(', source: "D83DDE12"},
					10: {title: ';-]', source: "D83DDE0F"},
					11: {title: '3(',  source: "D83DDE14"},
					12: {title: ":'(", source: "D83DDE22"},
					13: {title: ':_(', source: "D83DDE2D"},
					14: {title: ':((', source: "D83DDE29"},
					15: {title: ':o',  source: "D83DDE28"},
					16: {title: ':|',  source: "D83DDE10"},
					17: {title: '3-)',  source: "D83DDE0C"},
					18: {title: 'O:)',  source: "D83DDE07"},
					19: {title: '8|',  source: "D83DDE33"},
					20: {title: '<3',  source: "2764"},
					21: {title: ':<3',  source: "D83DDE18"},
					22: {title: ':))',  source: "D83DDE02"},
					23: {title: ';o',  source: "D83DDE30"},
					24: {title: ':-]',  source: "263A"},
					25: {title: '}:)',  source: "D83DDE08"},
					26: {title: ':like:',  source: "D83DDC4D"},
					27: {title: ':dislike:',  source: "D83DDC4E"},
					28: {title: ':applouse:',  source: "D83DDC4F"},
					29: {title: ':shit:',  source: "D83DDCA9"},
					30: {title: ':kappa:', source: "kappa"},
					31: {title: ':moon:', source: "D83CDF1D"},
					32: {title: ':darkmoon:', source: "D83CDF1A"},
					33: {title: ':bird:', source: "D83DDC26"},
					34: {title: ':18:', source: "D83DDD1E"},
					35: {title: ':sun:', source: "D83CDF1E"},
					36: {title: ':panda:', source: "D83DDC3C"},
					37: {title: ':ufo:', source: "D83DDC7D"}
				}
				
				for(var i=1; i<=37; i++){
					// Pictured Smiles
					// text = text.replaceAll("/" + emoji[i].title + "/", " <img src='images/emoji/"+ emoji[i].source +".png' width='18'> ");

					// Usual text smiles
					text = text.replaceAll(emoji[i].title, " <img src='images/emoji/"+ emoji[i].source +".png' width='18'> ");
				}
				return text;
			}
	}
});


// POST A STICKER
// router.post('/sticker/post', function(req, res){
// 	var id = req.body.id;
// 	var target = req.body.target;

// 	if(!id || !target){
// 		return res.send({message: "No id or target, false"});
// 	}

// 	var type = 'baach';

// 	Users.findOne({alias: target}, function(err, user){
// 		if(err) throw err;
// 		if(user){
// 			var send = '<img src=\'images/stickers/'+ type +'/'+ id +'.png\' width=\'120\'>';

// 			var sticker = new Posts();
// 			sticker.created_by = user._id;
// 			sticker.text = send;
// 			sticker.save(function(err){
// 				if(err) throw err;

				
// 				res.send({status:1, message: "Sticker was posted."});
// 				tools.countUserPosts(user._id);

// 				return;
// 			});

// 		} else {
// 			return res.send({message: "There's no user to post a sticker"});
// 		}
// 	});
	
// });

// api/posts/:id
router.get('/remove/:id', function(req, res){
	if (!req.isAuthenticated()) {
		return res.send({status: 0, error:1, message: 'This method is only for authenticated users.'});
	}
	console.log('[Removing Like] on id: ' + req.params.id);
	// Here i check if the post creator's id and user ids are ==
	var id = req.params.id; // Post id.
	

	if(!id){
		return res.send({message: "No parametrs sent"});
	}
	
	var user_ids = req.session.passport.user; // User ids.


	Posts.findById(id, function(err, post){
		if(!err){
			if(!post){
				return res.send({message: "Такой пост не найден, возможно, он уже был удалён."});
			}

			if(post.created_by == user_ids){
				Posts.remove({_id: id}, function(err){
					if(err) throw err;

					removeLikesOnPost(id);
					Users.findById(user_ids, function(err, user){
						if(err) throw err;
						user.stats.posts = user.stats.posts - 1;

						if(post.type == 2){

							user.stats.unpublishedPosts -= 1;
						}

						user.save();
						res.send({status: 1, message: "This post was removed"});
					});

				});
			} else {
				res.send({message: "You are going to delete post which is not yours! Go away!"});
			}
		}

		function removeLikesOnPost(id){
			Likes.remove({object: id}, function(err){
				if(err) throw err;

				// Likes were removed.
			});
		}
	});
});
router.post('/moderation', function(req, res){
	var action = req.body.action;
	var id = req.body.id;

	console.log(action, id);
	if(!action || !id){
		console.log(id);
		console.log(action);
		res.send({message: 'empty query'});
	} else {
		Posts.findById(id, function(err, post){
			if(err) throw err;
			if(post){
				Users.findById(post.created_by, function(err, user){
					if (err) throw err;
					if(user){
						if(user._id == req.session.passport.user){
							startModeration();
						} else {
							return res.send({message: "you have not permission to moderate this post."});
						}
					} else {
						return res.send({message:"Серверная ошибка!!"});
					}

					function startModeration(){
						if(action == 'accept'){
							post.type = 1;
							user.stats.unpublishedPosts -= 1;

							post.save();
							user.save();
							res.send({status: 1, message: ""});
						} else if (action == 'remove'){
							Posts.findByIdAndRemove(id, function(err){
								if(err) throw err;
								res.send({status: 0, message: "Удалено"});
							});
						} else {
							res.send({message: 'wrong action'});
						}
					}
				});
			}
		});
	}
});

router.get('/last/:alias', function(req, res){
	var alias = req.params.alias;
	console.log('alias', alias);
	if (!alias)  {
		return res.send({error: 1, message: 'Please provide an alias!'});
	} else {
		Users.findOne({alias: alias}, function(err, user){
			if (user) {
				var user_id = user._id;
				Posts.findOne({created_by: user_id}).sort({_id: - 1})
					.exec(function(err, post){
						if (!post) {
							return res.send({error: 1, message: 'There\'s no post or user with this alias.'});
						}
						return res.send(post);
					})
			} else {
				return res.send({error: 1, message: 'cant find user with this alias'});
			}
		});
	}
});


// find all posts (take id of post that neede)
// go within these posts and increment counter until reaching post with the same id
// take this count as limit to getPosts and go ahead.
router.get('/new/:alias/:id', function(req, res){
	var id = req.params.id;
	var alias = req.params.alias;

	Users.findOne({alias: alias}, function(err, user){
		if (!user) {
			return res.send({message: 'No user with this alias', error: 1});
		}
		var user_id = user._id;
		Posts.findById(id, function(err, post){
			if (!post) {
				return res.send({message: 'No post with this ID', error: 1});
			}
		})
		Posts.find({created_by: user_id}).sort({_id: - 1}).lean()
			.exec(function(err, posts){
				if (!posts) {
					return res.send({error: 1, message: 'There\'s no post or user with this alias.'});
				}

				// initial value for count
				var count = 0;
				for (var i=0; i < posts.length; i++){
					// never do !== there bc this is comparing id with string
					if (posts[i]._id != id) {
						count++;
					} else {
						break;
					}
				}
				req.limit = count;
				if (count === 0) {
					return res.send({status: 0, message: 'Not need for update', posts:[]});
				}
				getPosts(req, res, function(){
					// console.log('posts', req.posts);
					return res.send({status: 1, posts: req.posts});
				});
				
			})
	});
});


// api/posts/feed
router.get('/feed', feed, function(req, res){
	var feed = req.feed;
	res.send(feed);
});

router.get('/endless', endlessFeed, function (req, res){
	var endlessFeed = req.endlessFeed;
	res.send(endlessFeed);
})
router.get('/:alias', getPosts, function(req, res){
	var posts = req.posts;
	if (!posts) {
		return res.send({status:0, error:1, message: 'There\'s no posts on this alias.'})
	}
	res.send(posts);
});
router.get('/:alias/(:offset)', getPosts, function(req, res){
	var posts = req.posts;
	if (!posts) {
		return res.send({status:0, error:1, message: 'There\'s no posts on this alias.'})
	}
	res.send(posts);
});

function devRemovePost(req, res){
	var post_id = req.body.post_id;
	Posts.findByIdAndRemove(post_id, function(err, posts){
		res.send({status:1, message: 'post was removed'});
	});
}

module.exports = router;

module.exports.getPosts = getPosts;
module.exports.feed = feed;
module.exports.favourite = favourite;
module.exports.devRemovePost = devRemovePost;