var mongoose = require('mongoose')
var Users = mongoose.model('users')

function getMyself(req, res, next){
	if(req.session && req.session.passport && req.session.passport.user){
		var id = req.session.passport.user;
		Users.findById(id).select('username alias status email social profileType stats photo header background online').exec(function(err, user){
			req.getMyself = user;
			return next();
		});
	} else {
		req.getMyself = undefined;
		return next();
	}
}

module.exports = getMyself