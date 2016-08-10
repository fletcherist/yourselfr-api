var mongoose = require('mongoose')
var Posts = mongoose.model('posts')
var Users = mongoose.model('users')
var Likes = mongoose.model('likes')

var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

const onlineManager = () => {

}

const getOnlineUsers = () => {
	return new Promise ((resolve, reject) => {
		Users.find({'online.status': true}, (err, users) => {
			if (err) reject(err)
			resolve(users)
		})
	})
}

const howManyAreOnline = () => {
	return new Promise ((resolve, reject) => {
		Users.count({'online.status': true}, (err, count) => {
			if (err) reject(err)
			resolve(count)
		})
	})
}

const formatLastVisited = (lastVisited) => {
	if (!lastVisited) return false
	lastVisited = (lastVisited / 1000 / 60).toFixed(0)
	return lastVisited
}

const howLongWereTheyOnline = async(() => {
	return new Promise ((resolve, reject) => {
		let onlineUsers = await(getOnlineUsers())
		let goodUsers = []
		onlineUsers.forEach((user) => {
			let lastVisited = new Date() - user.online.time
			// days
			goodUsers.push({
				id: user._id,
				time: lastVisited
			})
		})
		resolve(goodUsers)
	})
})

const trackOnlineUsers = async(() => {
	let onlineUsers = await(howLongWereTheyOnline())
	let count = await(howManyAreOnline())
	// console.log(`tracking ${count} online users`)
	if (onlineUsers.length === 0 ) {
		return false
	}
	onlineUsers.forEach((user) => {
		let lastVisited = formatLastVisited(user.time)
		console.log(lastVisited)
		if (lastVisited > 4) {
			console.log(await (makeUserOffline(user.id)))
		}
	})
})

const makeUserOffline = (userID) => {
	return new Promise ((resolve, reject) => {
		if (!userID) reject('No userID provided')
		Users.findById(userID, (err, user) => {
			if (err) reject('db error')
			if (!user) reject('user is not exist')
			user.online.status = false
			user.online.time = new Date()
			user.save(() => {
				resolve(`${user.username}'s is getting offline`)
			})
		})
	})
}

trackOnlineUsers()
setInterval(trackOnlineUsers, 30000)

module.exports = onlineManager
exports.howManyAreOnline = howManyAreOnline
exports.trackOnlineUsers = trackOnlineUsers