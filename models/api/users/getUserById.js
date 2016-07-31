var mongoose = require('mongoose')
var Users = mongoose.model('users')

const getUserById = (id) => {
	return new Promise((resolve, reject) => {
		Users.findById(id).select('username profileType alias status photo background social vkID email created_at').exec(function(err, user){
			return resolve(user)
		})
	})
}

module.exports = getUserById