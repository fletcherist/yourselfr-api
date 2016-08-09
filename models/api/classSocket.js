// var mongoose = require('mongoose')
// var Users = mongoose.model('users')

const initialize = (socket) => {
	socket.on('visit', (alias) => {
		console.log(alias)
		socket.broadcast.emit('updateCounters', alias)
	})
}

module.exports = initialize