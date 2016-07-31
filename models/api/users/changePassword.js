// // Change password
// var bCrypt = require('bcrypt-nodejs');
// router.post('/change_password', function(req, res){
// 	var oldPassword = req.body.oldPassword;
// 	var newPassword = req.body.newPassword;

// 	if(!oldPassword || !newPassword){
// 		return res.send({message: "Вы забыли прислать один из паролей"});
// 	}

// 	if(oldPassword == newPassword){
// 		return res.send({message: "Старый и новый пароли должны отличаться друг от друга"});
// 	}


// 	var id = req.session.passport.user;
// 	Users.findById(id, function(err, user){
// 		if(err) throw err;
// 		if (user) {
// 			// 
// 			// Continue this.
// 			//
// 		};
// 	});
// });