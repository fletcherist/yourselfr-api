var mongoose = require('mongoose');
var User = mongoose.model('users');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var bCrypt = require('bcrypt-nodejs');
var vkPhotos = require('../vk/vkPhotos');

module.exports = new VKontakteStrategy({
		clientID:     5023767,
		clientSecret: '6mZAz0f8JfYiZqEzZ9Y',
		callbackURL:  "http://yoursel.fr/auth/vk/callback"
	},
	function(accessToken, refreshToken, profile, done) {

		User.findOne({ vkID: profile.id }, function (err, user) {
			if(user){
				console.log(user);
				return done(null, user);
			} else {
				newUser = new User();

				newUser.username = profile.displayName;
				newUser.alias = profile.username;
				newUser.social.vk = profile.profileUrl;
				newUser.photo = profile.photos[0].value;
				newUser.vkID = profile.id;

				newUser.save(function(err, user) {
					if (err){
						console.log('Error in Saving user: '+err);
						throw err;
					}

					vkPhotos.setVKPhoto(user._id);
					console.log(newUser.username + ' Registration succesful');
					return done(null, newUser);
				});
			}
		});
	}
)