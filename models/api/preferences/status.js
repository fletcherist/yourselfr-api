/*jshint esversion: 6 */
var mongoose = require('mongoose');
var Users = mongoose.model('users');

const changeStatus = (req, res) => {
	var status = req.body.status || '';
	if (status.length > 299) {
		return res.send({status: 0, message: 'Too long status'});
	}

	Users.findById(req.session.passport.user, (err, user) => {
		user.status = status;
		user.save(() => {
			return res.send({status: 1, message: 'Status was updated'});
		});
	});
};

module.exports = changeStatus;