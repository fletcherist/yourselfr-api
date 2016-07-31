var mongoose = require('mongoose');
var User = mongoose.model('users');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) {
		console.log(`${username} is trying to log in.`);
		// check in mongo if a user with username exists or not
		// ALIAS = LOGIN
		console.log(username);
		if (!username) {
			req.flash('message', 'username not given');
			return done(null, false);
		}
		User.findOne({ 'alias' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err) {
					console.log('some error');
					return done(err);
				}
				// Username does not exist, log the error and redirect back
				if (!user){
					console.log('User Not Found with username ' + username);
					req.flash('message', 'there is no user with this alias');
					return done(null, false);
				}
				// User exists but wrong password, log the error
				if (!isValidPassword(user, password)){
					console.log('Invalid Password');
					req.flash('message', 'invalid password');
					return done(null, false); // redirect back to login page
				}
				// User and password both match, return user from done method
				// which will be treated like success
				var loginMsg = 'you have been log in successfully';
				console.log(loginMsg);
				req.flash('message', loginMsg);
				return done(null, user);
			}
		);
	}
);

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
};