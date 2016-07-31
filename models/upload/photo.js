var fs = require('fs');
var busboy = require('connect-busboy');
var lwip = require('lwip');
var mongoose = require('mongoose');
var Users = mongoose.model('users');
var helpers = require('./helpers');
var tools = require('../tools.js');

function uploadPhoto (req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		console.log(encoding);

		if(!helpers.isValidImage(mimetype)){
			return res.send({error:1, message:'image is not valid'});
		}

		var regex = new RegExp(/^(.*)\./);
		var filename = filename.toString().replace(regex, tools.randNumber(1000000000000000,9999999999999999999) + ".");
		var path = 'app/upload/photo/'+ filename;

		fstream = fs.createWriteStream(path);
		file.pipe(fstream);
		fstream.on('close', function () {
			lwipTime(path, filename);
		});

		var lwipTime = function(path, filename){
			lwip.open(path, function(err, image){
				if(err) throw err;

				var _imageProps = {
					width: image.width(),
					height: image.height()
				}
				var cropProp = _imageProps.width > _imageProps.height ? _imageProps.height : _imageProps.width;


				image.batch()
					// .crop(cropProp,cropProp)
					.scale(0.65)
					.writeFile(path, 'jpg', {quality: 90} ,function(err){
						if(err) throw err;
					});
			});
			res.send({message:'image was uploaded',url:filename});
		}
	});
}

module.exports.uploadPhoto = uploadPhoto;
