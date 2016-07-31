var mongoose = require('mongoose')
var Users = mongoose.model('users')

const findMe = (req, res) => {
	if(req.isAuthenticated()){
		var userid = req.session.passport.user
		Users.findById(userid, function(err, user){
			if(err) throw err
			var url = user.alias
			res.send({url:url})
		});
	}
}

module.exports = findMe