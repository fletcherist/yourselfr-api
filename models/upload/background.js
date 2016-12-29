/*jshint esversion: 6 */
var fs = require('fs');
var busboy = require('connect-busboy');
var mongoose = require('mongoose');
var Users = mongoose.model('users');
var helpers = require('./helpers');
// var crop = require('./crop');
var randomstring = require("randomstring");

function uploadBackground (req, res) {
	if(!req.isAuthenticated()){
		console.log('authentication required');
		return res.send({message: 'Authentication required for uploading'});
	}

	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if(!helpers.isValidImage(mimetype)){
			return res.send({error:1, message:'image is not valid'});
		}

		var hash = randomstring.generate();
		var regex = new RegExp(/^(.*)\./);
		filename = filename.toString().replace(regex, hash + ".");
		var filenameToWrite = hash + '.jpg';

		var path = 'upload/background/' + filename;
		var pathToWrite = 'upload/background/' + filenameToWrite;

		fstream = fs.createWriteStream(path);
		file.pipe(fstream);
		fstream.on('close', function () {
			// lwipTime(path, filename);
		});

		// var lwipTime = function(path, filename){
		// 	console.log('heha');
		// 	lwip.open(path, function(err, image){
		// 		if(err) throw err;

		// 		var scale = 1;
		// 		if (image.width() > 800) {
		// 			scale = 0.7;
		// 		}
		// 		if (image.width() > 1400) {
		// 			scale = 0.6;
		// 		}
		// 		if (image.width() > 1800) {
		// 			scale = 0.5;
		// 		}
		// 		image.batch()
		// 			// .crop(800,800)
		// 			.scale(scale)
		// 			.writeFile(pathToWrite, 'jpg', {quality: 90} ,function(err){
		// 				if(err) throw err;
		// 				crop.cropBackground(filenameToWrite);
		// 				crop.makeLowQualityBlur(filenameToWrite);
		// 			});
		// 	});
		// 	finish();
		// };

		var finish = function(){
			Users.findById(req.session.passport.user, function(err, user){
				user.background = filenameToWrite;
				user.save();
				// res.redirect('/preferences');
				res.send({
					status: 1,
					message:"Фон страницы был успешно загружен.",
					error: 0,
					src: user.background
				});
			});
			console.log("File uploaded!");
		};
	});
}

function removeBackground (req, res) {
	if(!req.isAuthenticated()){
		return res.send({message: 'Authentication required for uploading'});
		console.log('authentication required');
	}
	Users.findById(req.session.passport.user, function(err, user){
		if(err) throw err;
		if(user){
			if(user.background === ''){
				res.send({status:1, message:"Фон страницы был успешно удалён."});
			} else {
				user.background = '0';
				user.save();
				res.send({status:1, message:"Фон страницы был успешно удалён."});
			}
		}
	});
}

module.exports.uploadBackground = uploadBackground;
module.exports.removeBackground = removeBackground;
