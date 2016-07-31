var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

const getUserById = require('./getUserById')
const vkFriends = require('../../vk/vkFriends')

const getFriends = async((req, res) => {
	console.log('trying to get friends')
	var id = req.session.passport.user
	var user = await(getUserById(id))
	var vkID = user.vkID
	var socialVK = user.social ? user.social.vk : undefined
	var friends = {}
	console.log(vkID, socialVK)
	if (vkID || socialVK) { 
		friends = await(vkFriends.findVKFriends(vkID, socialVK))	
	}
	res.send(friends)
})

module.exports = getFriends