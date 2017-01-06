/*jshint esversion: 6 */
var fs = require('fs')
var busboy = require('connect-busboy')
var mongoose = require('mongoose')
var Users = mongoose.model('users')
var helpers = require('./helpers')
var randomstring = require("randomstring")

const cloudinary = require('cloudinary')
cloudinary.config(CONFIG.cloudinary)

function uploadBackground (req, res) {
	if(!req.isAuthenticated()){
		console.log('authentication required')
		return res.send({message: 'Authentication required for uploading'})
	}

	req.pipe(req.busboy)
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if(!helpers.isValidImage(mimetype)){
			return res.send({error:1, message:'image is not valid'})
		}

	const handleUpload = result => {
		console.log(result)
		Users.findById(req.session.passport.user, function(err, user){
			if (!result || !result.url || !result.eager || !result.eager[0]) {
				res.send({
					error: 1,
					status: 0,
					message: 'Error while uploading. Try later..'
				})
			}
			user.background = result.url

			user.save(() => {
				res.send({
					error: 0,
					status: 1,
					message:"Фон страницы был успешно загружен.",
					error: 0,
					src: user.background
				})
			})
		})
	}

	const params = {
		width: 1024,
		height: 768,
		crop: 'fill',
		gravity: 'face',
		format: 'jpg',
		quality: 'auto',
		flags: 'progressive',
		eager: {
			crop: "fill",
			width: 100,
			height: 100,
			gravity: 'face',
			quality: 'auto',
			format: 'jpg',
			flags: "progressive",
		}
	}

		const stream = cloudinary.uploader.upload_stream(handleUpload, params)
		file.pipe(stream)
	})
}

function removeBackground (req, res) {
	if(!req.isAuthenticated()){
		return res.send({message: 'Authentication required for uploading'})
		console.log('authentication required')
	}
	Users.findById(req.session.passport.user, function(err, user){
		if(err) throw err
		if(user){
			if(user.background === ''){
				res.send({status:1, message:"Фон страницы был успешно удалён."})
			} else {
				user.background = '0'
				user.save()
				res.send({status:1, message:"Фон страницы был успешно удалён."})
			}
		}
	})
}

module.exports.uploadBackground = uploadBackground
module.exports.removeBackground = removeBackground
