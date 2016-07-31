/*jshint esversion: 6 */
var mongoose = require('mongoose');
var Users = mongoose.model('users');

module.exports.changeVK = (req, res) => {
	var vk = req.body.vk;
	if (!vk) vk = '';
	console.log(vk);
	Users.findById(req.session.passport.user, (err, user) => {
		user.social.vk = vk;
		user.save((err) => {
			res.send({error: 0, status: 1, message: "VK has been changed."});
		});
	});
};

module.exports.changeTwitter = (req, res) => {
	var twitter = req.body.twitter;
	if (!twitter) twitter = '';
	Users.findById(req.session.passport.user, (err, user) => {
		user.social.twitter = twitter;
		user.save((err) => {
			res.send({error: 0, status: 1, message: "Twitter has been changed."});
		});
	});
};

module.exports.changeTumblr = (req, res) => {
	var tumblr = req.body.tumblr;
	if (!tumblr) tumblr = '';
	Users.findById(req.session.passport.user, (err, user) => {
		user.social.tumblr = tumblr;
		user.save((err) => {
			res.send({error: 0, status: 1, message: "Tumblr has been changed."});
		});
	});
};

module.exports.changeInstagram = (req, res) => {
	var instagram = req.body.instagram;
	if (!instagram) instagram = '';
	Users.findById(req.session.passport.user, (err, user) => {
		user.social.instagram = instagram;
		user.save((err) => {
			res.send({error: 0, status: 1, message: "Instagram has been changed."});
		});
	});
};

module.exports.changeAskFm = (req, res) => {
	var askfm = req.body.askfm;
	if (!askfm) askfm = '';
	Users.findById(req.session.passport.user, (err, user) => {
		user.social.askfm = askfm;
		user.save((err) => {
			res.send({error: 0, status: 1, message: "askfm has been changed."});
		});
	});
};

module.exports.changeFacebook = (req, res) => {
	var facebook = req.body.facebook;
	if (!facebook) facebook = '';
	Users.findById(req.session.passport.user, (err, user) => {
		user.social.facebook = facebook;
		user.save((err) => {
			res.send({error: 0, status: 1, message: "facebook has been changed."});
		});
	});
};

