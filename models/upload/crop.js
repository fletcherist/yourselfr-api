var fs = require('fs');
var busboy = require('connect-busboy');
var lwip = require('lwip');
var mongoose = require('mongoose');
var Users = mongoose.model('users');
var helpers = require('./helpers');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

function cropBackground (filename) {
	return new Promise ((resolve, reject) => {
		console.log('GET '  + filename + ' For Cropping.');

		var regex = /\.png|\.jpg/;
		if(!regex.test(filename)){
			resolve(false);
			return false;
		}
		var path = 'app/upload/background/'+ filename;
		var savePath = 'app/upload/background_cropped/' + filename;
		lwip.open(path, function(err, image){
			if (err) {
				resolve(false);
				return false;
			}

			var _imageProps = {
				width: image.width(),
				height: image.height()
			}
			var cropProp = _imageProps.width > _imageProps.height ? _imageProps.height : _imageProps.width;
			var cropWidth = _imageProps.width > 500 ? 500 : _imageProps.width;
			var cropHeight = _imageProps.height > 150 ? 150 : _imageProps.height;
			image.batch()
				.crop(cropWidth, cropHeight)
				.writeFile(savePath, {quality: 50}, function(err){
					console.log('IMAGE ' + filename + ' Was Cropped.');

					resolve(false);
					return false;
				});
			
		});
	});	
}

function makeLowQualityBlur (filename) {
	return new Promise ((resolve, reject) => {
		console.log('GET '  + filename + ' For Blurring.');

		var regex = /\.png|\.jpg/;
		if(!regex.test(filename)){
			resolve(false);
			return false;
		}
		var path = 'app/upload/background/'+ filename;
		var savePath = 'app/upload/background_blur/' + filename;
		lwip.open(path, function(err, image){
			if (err) {
				resolve(false);
				return false;
			}
			image.batch()
				.scale(0.05)
				.writeFile(savePath, {quality: 50}, function(err){
					console.log('IMAGE ' + filename + ' Was Blurred.');

					resolve(false);
					return false;
				});
			
		});
	});	
}

const cropAllBackgrounds = async (() => {
	var path = 'app/upload/background';
	var items = fs.readdirSync(path);
	if (!items) {
		return false;
	}
	items.forEach((item) => {
		await (cropBackground(item));
		await (Promise.delay(3000));
	}) 	
});

module.exports.cropAllBackgrounds = cropAllBackgrounds;
module.exports.cropBackground = cropBackground;
module.exports.makeLowQualityBlur = makeLowQualityBlur;