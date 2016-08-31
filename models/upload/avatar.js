/*jshint esversion: 6 */
var fs = require('fs');
var busboy = require('connect-busboy');
var lwip = require('lwip');
var mongoose = require('mongoose');
var Users = mongoose.model('users');
var helpers = require('./helpers');
var randomstring = require("randomstring");
var tools = require('../tools');

function uploadAvatar (req, res) {
	console.log('[uploadAvatar]: Trying to upload avatar');
	if(!req.isAuthenticated()){
		return res.send({
			error: 1,
			status: 0,
			message: 'Authentication required for uploading'
		});
	}
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if(!helpers.isValidImage(mimetype)){
			return res.send({error:1, message:'image is not valid'});
		}

		var regex = new RegExp(/^(.*)\./);
		var hash = randomstring.generate();
		var filename = filename.toString().replace(regex, hash + ".");

		var path = __dirname + 'upload/avatar/'+ filename;
		console.log('PATHAAA: ' + path)

		fstream = fs.createWriteStream(path);
		file.pipe(fstream);
		fstream.on('close', function () {
			lwipTime(path, filename);
		});

		var lwipTime = function(path, filename){
			lwip.open(path, function(err, image){
				if(err) return false;

				var _imageProps = {
					width: image.width(),
					height: image.height()
				};
				var cropProp = _imageProps.width > _imageProps.height ? _imageProps.height : _imageProps.width;


				image.batch()
					.crop(cropProp,cropProp)
					.scale(0.75)
					.writeFile(path, 'jpg', {quality: 90} ,function(err){
						if(err) throw err;
					});
			});
			finish();
		};

		var finish = function(){
			Users.findById(req.session.passport.user, function(err, user){
				user.photo = 'http://yourselfr.com/upload/avatar/'+filename;
				console.log(user);
				user.save();

				// res.redirect('/preferences');
				res.send({
					error: 0,
					status: 1,
					message: "Ваш аватар был успешно загружен!",
					src: user.photo
				});

			});
		};
	});
}


function removeAvatar (req, res) {
	if(!req.isAuthenticated()){
		console.log('[removeAvatar] authentication required');
		return res.send({status: 0, message: 'Authentication required for uploading'});
	}
	Users.findById(req.session.passport.user, function(err, user){
		if(err) throw err;
		if(user){
			console.log('[removeAvatar] successfully removed');
			user.photo = getDefaultAvatar();
			user.save(() => {
				return res.send({status:1, message:"Аватар удалён."});
			});

		}
	});
}

const getDefaultAvatar = () => {
	var url = 'http://yourselfr.com/upload/default-avatar/';
	var rand = tools.randNumber(1, 12);
	var avatar = url + rand + '.jpg';
	return avatar;
};

module.exports.uploadAvatar = uploadAvatar;
module.exports.removeAvatar = removeAvatar;
module.exports.getDefaultAvatar = getDefaultAvatar;
