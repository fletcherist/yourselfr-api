/*jshint esversion: 6 */
var mongoose = require('mongoose');
var Users = mongoose.model('users');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

const changeEmail = (req, res) => {
	var email = req.body.email;
	if (!email) {
		return res.send({status: 0, message: 'Email is not provided'});
	}
	if (!isValidEmail(email)) {
		return res.send({status: 0, message: 'Email is not valid'});
	}

	Users.findById(req.session.passport.user, (err, user) => {
		user.email = email;
		user.save(() => {
			return res.send({status: 1, message: 'Email was changed.'});
		});
	});
};

const isValidEmail = (email) => { 
	var email = email;
	var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
	if(regex.test(email)){
		return true;
	} else {
		return false;
	}
};

module.exports = changeEmail;
module.exports.isValidEmail = isValidEmail;