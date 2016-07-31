var mongoose = require('mongoose')
var Users = mongoose.model('users')

const isUserExist = (id) => {
	return new Promise((resolve, reject) => {
		Users.findById(id, (err, user) => {
			if (user) {
				resolve(true)
			} else {
				resolve(false)
			}
		})
	})
}

module.exports = isUserExist