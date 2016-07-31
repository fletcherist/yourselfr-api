var mongoose = require('mongoose')
var Users = mongoose.model('users')

var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

var getOnline = require('./getOnline')
var isFollowingUser = require('./isFollowingUser')

const getUser = async((req, res, next) => {
	var alias = req.params.alias || undefined
	if(alias){
		alias = alias.toLowerCase()
	}

	Users.findOne({alias: alias}).select('username alias status social profileType stats photo header background online').exec(async((err, user) => {
		if(err) throw err
		if(user === null){
			req.getUser = null
			res.send({error: 1, message:'This user is not defined'})
		} else {
			var resUser = user
			var authenticated = req.isAuthenticated()
			var userid = user._id

			if (authenticated) {
				var userids = req.session.passport.user || undefined
				var online = await(getOnline(authenticated, userid, userids, user.online.time))
				if (online) {
					user.online = online
				}
				resUser.isFollowing = await (isFollowingUser(authenticated, userid, userids))
			} else {
				resUser.isFollowing = false
			}

			// User visits manager
			user.stats.visits += 1
			user.save()
			req.getUser = resUser
			return next()
		}
	}))
})


module.exports = getUser