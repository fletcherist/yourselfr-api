// router.post('/header', function(req, res) {
// 	var fstream;
// 	req.pipe(req.busboy);
// 	req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
// 		console.log("Uploading: " + filename); 

// 		console.log(mimetype);

// 		var regex = new RegExp(/^(.*)\./);
// 		var filename = filename.toString().replace(regex, req.session.passport.user + ".");
		
// 		var path = 'app/public/upload/header/'+filename;

// 		fstream = fs.createWriteStream(path);
// 		file.pipe(fstream);
// 		fstream.on('close', function () {
// 			finish();

// 			var finish = function(){
// 				Users.findById(req.session.passport.user, function(err, user){
// 					user.header = filename;
// 					user.save();
// 					res.send({status:1, message:"Шапка Вашего профиля была загружена."});
// 				});
// 				console.log("File uploaded!");
// 			}
// 		});
// 	});
// });

// Header removing method
// router.post('/header/delete', function(req, res){
// 	Users.findById(req.session.passport.user, function(err, user){
// 		if(err) throw err;
// 		if(user){
// 			if(user.header == 'noheader.png'){
// 				res.send({status:1, message:"Шапка профиля удалена."});
// 			} else {
// 				user.header = 'noheader.png';
// 				user.save();
// 				res.send({status:1, message:"Шапка профиля удалена."});
// 			}
// 		}
// 	});
// });