function isValidImage(mimetype){
	console.log(mimetype);
	if(mimetype == 'image/jpeg' || mimetype == 'image/png'){
		return true;
	}
	return false;
}

module.exports.isValidImage = isValidImage;