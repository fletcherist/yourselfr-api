/*jshint esversion: 6 */
var mongoose = require('mongoose');
var Users = mongoose.model('users');

const changeUsername = (req, res) => {
	var username = req.body.username;
	if (!username) {
		return res.send({status: 0, message: 'Username is not given'});
	}

	if(username.length > 20){
		return res.send({status:0, message: "Too long username"});
	} else if(username.length == 0){
		return res.send({status:0, message: "Username can not be empty."});
	}

	Users.findById(req.session.passport.user, (err, user) => {
		if (!user) {
			return false;
		}

		user.username = username;
		user.save(() => {
			res.send({status: 1, message: 'Username is saved.'});
		});
	});
};

module.exports = changeUsername;

