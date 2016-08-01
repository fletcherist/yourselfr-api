var mongoose = require('mongoose')
var Users = mongoose.model('users')

var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

const changeAlias = async((req, res) => {
	var alias = req.body.alias
	if (!alias) {
		return res.send({status: 0, message: 'No alias provided'})
	}

	if (!goodAlias(alias) || bannedAlias(alias)) {
		return res.send({status: 0, message: 'Alias is not valid'})
	}

	Users.findById(req.session.passport.user, async((err, user) => {
		if (!user) {
			return res.send({status: 0, message: 'Ops, db error'})
		}
		if (user.alias !== alias) {
			var isFree = await(isFreeAlias(alias))
			if (!isFree) {
				return res.send({status: 0, message: 'This alias is already taken'})
			}
		}

		user.alias = alias
		user.save(() => {
			res.send({status: 1, message: 'Alias has been updated'})
		})
	}))
})

const goodAlias = (alias) => {
	var regex = new RegExp(/^[a-z\d_]{1,32}$/g)
	if (regex.test(alias)){
		return true
	} else {
		return false
	}
}

const isFreeAlias = (alias) => {
	return new Promise((resolve, reject) => {
		Users.findOne({alias: alias}, (err, user) => {
			if (user) {
				return resolve(false)
			} else {
				return resolve(true)
			}
		})
	})
}

const bannedAlias = (alias) => {
	if (!alias) {
		return false
	}
	var alias = alias.toString().toLowerCase()
	var banned = [
		'404', 'admin', 'preferences',
		'signup', 'yourselfr', 'blocked',
		'findme', 'login', 'updates',
		'feed', 'dev', 'friends'
	]
	for (var i = 0; i < banned.length; i++){
		if(banned[i] == alias){
			return true
		}
	}
	return false
}

const generateRandomAlias = () => {
	let alias = 'id' + Math.floor(Math.random() * 1000000000).toString()
	return alias
}

module.exports = changeAlias
module.exports.isFreeAlias = isFreeAlias
module.exports.bannedAlias = bannedAlias
module.exports.goodAlias = goodAlias
module.exports.generateRandomAlias = generateRandomAlias