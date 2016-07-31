var mongoose = require('mongoose')
var Users = mongoose.model('users')

function getFinePeople(req, res, next){
	Users.find({avatar: {$ne:'http://yourselfr.com/upload/avatar/nophoto.png'}})
		.sort({'stats.visits':-1})
		.limit(18)
		.select('username alias photo status')
		.exec(function(err, users){
			req.getFinePeople = users;
			next();
		});
}

module.exports = getFinePeople