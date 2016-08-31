var express = require('express')
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')

var Users = mongoose.model('users')
var Subscriptions = mongoose.model('subscriptions')
var Posts = mongoose.model('posts')

var config = require('../config')

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.gmail.user,
        pass: config.gmail.pass
    }
})

function notifyWhenPost (id) {
	if (!id) return false
	console.log('Sending Email, because post was done')
	Users.findById(id, function(err, user){
		// Check if user exists
		if (!user) return false

		// Check if user has got an email address.
		if (!user.email) {
			console.log('This user ' + user.username + ' has no email provided')
			return false
		}

		// Getting the last post.
		Posts.findOne({created_by: user._id, type: 1}).sort({_id: -1}).exec(function(err, post){
			// Creating E-mail form

			// to: user.email, // list of receivers
			var mailOptions = {
			    from: 'Йорселфер <yourselfrbot@gmail.com>', // sender address
			    to: [user.email, 'bountique@gmail.com'], // list of receivers
			    subject: user.username + ', кто-то оставил мнение о Вас', // Subject line
			    html:  '<h3.>Пока вы не заходили на Йорселфер, там произошло много интересного.<br> Например, вот, что написали о вас ваши друзья:</h3> \
			           <p>«' + post.text + '»</p>\
			           <p><a href=\'http://yourselfr.com/' + user.alias + '\'>Посмотреть мнение на Йорселфере.</a></p>'
			}

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if (error){
			        console.log(error)
			    } else {
			        console.log('Message sent: ' + info.response)
			    }
			})
		})
	})
}

module.exports.notifyWhenPost = notifyWhenPost
