var mongoose = require('mongoose');
var User = mongoose.model('users');
var FacebookStrategy = require('passport-facebook').Strategy;
var bCrypt = require('bcrypt-nodejs');
var vkPhotos = require('../vk/vkPhotos');

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
  	console.log(profile);
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));