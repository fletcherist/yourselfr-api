var mongoose = require('mongoose')
var Users = mongoose.model('users')
var TwitterStrategy = require('passport-twitter').Strategy
var bCrypt = require('bcrypt-nodejs')
var passport = require('passport')

var config = require('../../../config')

const isFreeAlias = require('../api/preferences/alias').isFreeAlias
const generateRandomAlias = require('../api/preferences/alias').generateRandomAlias

module.exports = new TwitterStrategy({
	consumerKey: config.twitterToken.consumer,
	consumerSecret: config.twitterToken.apiSecret,
	callbackURL: "http://localhost/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
		Users.findOne({ twitterID: profile.id }, function (err, user) {
			if(user){
				console.log(user)
				return done(null, user)
			} else {
				var newUser = new Users()

				let alias = profile.username
				if (!isFreeAlias(alias)) {
					alias = generateRandomAlias(alias)
				}

				newUser.username = profile.displayName
				newUser.alias = alias
				newUser.twitterID = profile.id
				newUser.photo = profile.photos[0].value,
				newUser.social.twitter = profile.username

				newUser.save(function(err, user) {
					if (err){
						console.log('Error in Saving user: '+err)
						throw err
					}

					console.log(newUser.username + ' Registration succesful')
					return done(null, newUser)
				})
			}
		})
  }
)