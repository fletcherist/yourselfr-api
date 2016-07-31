var mongoose = require('mongoose');
var User = mongoose.model('users');
var LocalStrategy = require('passport-local').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var bCrypt = require('bcrypt-nodejs');

var login = require('./auth/login');
var signup = require('./auth/signup');
var vk = require('./auth/vk');

module.exports = function(passport){

	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			if (user && user.username) {
				console.log('deserializing user:', user.username);
			}
			return done(err, user);
		});
	});

	passport.use('login', login);
	passport.use('signup', signup);
	passport.use(vk);
};
