var fs = require('fs');
var busboy = require('connect-busboy');
var mongoose = require('mongoose');
var Users = mongoose.model('users');
var helpers = require('./helpers');
var tools = require('../tools.js');

const CONFIG = require('../../config')
const cloudinary = require('cloudinary')
cloudinary.config(CONFIG.cloudinary)

function uploadPhoto (req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		console.log(encoding);

		if(!helpers.isValidImage(mimetype)){
			return res.send({error:1, message:'image is not valid'});
		}

		const params = {
			width: 640,
			height: 480,
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
				res.send({message:'image was uploaded',url:result.url})
			})
		}

		const stream = cloudinary.uploader.upload_stream(handleUpload, params)
		file.pipe(stream)
	});
}

module.exports.uploadPhoto = uploadPhoto;
