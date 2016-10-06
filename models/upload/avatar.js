var fs = require('fs')
var busboy = require('connect-busboy')
var lwip = require('lwip')
var mongoose = require('mongoose')
var Users = mongoose.model('users')
var helpers = require('./helpers')
var randomstring = require("randomstring")
var tools = require('../tools')

const cloudinary = require('cloudinary')
cloudinary.config({
	cloud_name: 'houn4pnlm',
	api_key: '731783814288342',
	api_secret: 'YP_5DwpW4OdLfX5iEU7bjVdbnJc'
})


function uploadAvatar (req, res) {
	console.log('[uploadAvatar]: Trying to upload avatar')
	if(!req.isAuthenticated()){
		return res.send({
			error: 1,
			status: 0,
			message: 'Authentication required for uploading'
		})
	}
	var fstream
	req.pipe(req.busboy)
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if(!helpers.isValidImage(mimetype)){
			return res.send({error:1, message:'image is not valid'})
		}

		const params = {
			width: 350,
			height: 350,
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
				user.photo = result.url
				user.photo_thumb = result.eager[0].url

				user.save(() => {
					console.log(user.photo, user.photo_thumb)
					res.send({
						error: 0,
						status: 1,
						message: "Ваш аватар был успешно загружен!",
						src: user.photo
					})
				})
			})
		}

		const stream = cloudinary.uploader.upload_stream(handleUpload, params)
		file.pipe(stream)
	})
}


function removeAvatar (req, res) {
	if(!req.isAuthenticated()){
		console.log('[removeAvatar] authentication required')
		return res.send({status: 0, message: 'Authentication required for uploading'})
	}
	Users.findById(req.session.passport.user, function(err, user){
		if(err) throw err
		if(user){
			console.log('[removeAvatar] successfully removed')
			user.photo = getDefaultAvatar()
			user.save(() => {
				return res.send({status:1, message:"Аватар удалён."})
			})

		}
	})
}

const getDefaultAvatar = () => {
	var url = 'http://yoursel.fr/upload/default-avatar/'
	var rand = tools.randNumber(1, 12)
	var avatar = url + rand + '.jpg'
	return avatar
}

module.exports.uploadAvatar = uploadAvatar
module.exports.removeAvatar = removeAvatar
module.exports.getDefaultAvatar = getDefaultAvatar
