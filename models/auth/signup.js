var mongoose = require('mongoose')
var User = mongoose.model('users')
var LocalStrategy = require('passport-local').Strategy
var bCrypt = require('bcrypt-nodejs')

var config = require('../../../config')

module.exports = new LocalStrategy({
	passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {
	console.log('New registration was started ' + username)
	var email = req.body.email

	if(!username || !password) {
		req.flash('message', 'Not all data passed.')
		return done(null, false)
	}
	if(password.length < 6){
		req.flash('message', 'минимальная длина пароля - 6 символов')
		return done(null, false)
	}
	if(username.length > 25){
		req.flash('message', 'вы выбрали слишком длинное имя')
		return done(null, false)
	}
	var alias = username.toLowerCase()
	if(!goodAlias(alias)){
		alias = 'id' + Math.floor(Math.random() * 1000000000).toString()
	}

	// find a user in mongo with provided username
	User.findOne({ 'alias' :  username }, function(err, user) {
		// In case of any error, return using the done method
		if (err){
			console.log('Error in SignUp: '+err)
			return done(err)
		}
		// already exists
		if (user) {
			console.log('User already exists with username: '+username)
			req.flash('message', 'пользователь с таким именем уже есть')
			return done(null, false)
		} else {
			// if there is no user, create the user

			// Otherwise create new account
			var newUser = new User()

			// set the user's local credentials
			newUser.username = username
			newUser.alias = alias
			newUser.password = createHash(password)
			if(email){
				newUser.email = email
			}
			console.log(email)


			// save the user
			newUser.save(function(err) {
				if (err){
					console.log('Error in Saving user: '+err)
					throw err
				}
				console.log(newUser.username + ' Registration succesful')
				if(email){
					sendRegistrationEmail(email, username, password)
				}
				return done(null, newUser)
			})
		}
	})
})

var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

var goodAlias = function(alias){
	var regex = new RegExp(/^[a-z1-9\d_]{1,32}$/g)
	if (regex.test(alias)){
		return true
	} else {
		return false
	}
}

var sendRegistrationEmail = function(email, emailLogin, emailPassword){
	var nodemailer = require('nodemailer')

	var emailPassword = emailPassword.substr(0, emailPassword.length -1) + '*'
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: config.gmail.user,
	        pass: config.gmail.pass,
	    }
	})

	var mailOptions = {
	    from: 'Yourselfr <yourselfrbot@gmail.com>',
	    to: email,
	    subject: 'Добро пожаловать на Йорселфер.',
	    text: 'Вы успешно зарегистрировались!',
	    html: 'Спасибо за регистрацию на <a href=\"http://yourselfr.com\">Yourselfr.com</a><br> \
	           Ваши данные: <br> \
	           <b>Логин</b>: '+ emailLogin + '<br>\
	           <b>Пароль</b>: '+ emailPassword + '<br>\
	           <p>С этого момента Вы будете получать уведомления, когда кто-нибудь оставит мнение о Вас.</p>\
	           <p>с любовью, yourselfr.</p>'
	}

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error)
	    } else {
	        console.log('Message sent: ' + info.response)
	    }
	})
}