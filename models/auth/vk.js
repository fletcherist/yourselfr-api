var mongoose = require('mongoose')
var User = mongoose.model('users')
var VKontakteStrategy = require('passport-vkontakte').Strategy
var bCrypt = require('bcrypt-nodejs')
var vkPhotos = require('../vk/vkPhotos')

var config = require('../../../config')

const isFreeAlias = require('../api/preferences/alias').isFreeAlias
const generateRandomAlias = require('../api/preferences/alias').generateRandomAlias

module.exports = new VKontakteStrategy({
		clientID:     config.vkToken.clientId,
		clientSecret: config.vkToken.clientSecret,
		callbackURL:  "http://yoursel.fr/auth/vk/callback"
	},
	function(accessToken, refreshToken, profile, done) {

		User.findOne({ vkID: profile.id }, function (err, user) {
			if(user){
				console.log(user)
				return done(null, user)
			} else {
				let alias = profile.username
				if (!isFreeAlias(alias)) {
					alias = generateRandomAlias(alias)
				}

				newUser = new User()

				newUser.username = profile.displayName
				newUser.alias = alias
				newUser.social.vk = profile.profileUrl
				newUser.photo = profile.photos[0].value
				newUser.vkID = profile.id

				newUser.save(function(err, user) {
					if (err){
						console.log('Error in Saving user: '+err)
						throw err
					}

					vkPhotos.setVKPhoto(user._id)
					console.log(newUser.username + ' Registration succesful')
					return done(null, newUser)
				})
			}
		})
	}
)