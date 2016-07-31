var mongoose = require('mongoose');
var User = mongoose.model('users');
var TwitterStrategy = require('passport-twitter').Strategy;
var bCrypt = require('bcrypt-nodejs');
var vkPhotos = require('../vk/vkPhotos');


const TWITTER_CONSUMER_KEY = '';
const TWITTER_CONSUMER_SECRET = '';

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    
  	console.log(profile);
    // User.findOne({ vkID: profile.id }, function (err, user) {
    // 	if(user){
    // 		console.log(user);
    // 		return done(null, user);
    // 	} else {
    // 		newUser = new User();

    // 		newUser.username = profile.displayName;
    // 		newUser.alias = profile.username;
    // 		newUser.social.vk = profile.profileUrl;
    // 		newUser.photo = profile.photos[0].value;
    // 		newUser.vkID = profile.id;

    // 		newUser.save(function(err, user) {
    // 			if (err){
    // 				console.log('Error in Saving user: '+err);
    // 				throw err;
    // 			}

    // 			vkPhotos.setVKPhoto(user._id);
    // 			console.log(newUser.username + ' Registration succesful');
    // 			return done(null, newUser);
    // 		});
    // 	}
    // });
  }
));