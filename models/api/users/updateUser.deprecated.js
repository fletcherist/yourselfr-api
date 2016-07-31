// Deprecated function

// Change user's data!
const updateUser = function(req, res){
	update = {
		username: req.body.username,
		alias: req.body.alias,
		status: req.body.status,
		profileType: req.body.profileType,
		social: {
			vk: req.body.vk,
			twitter: req.body.twitter,
			tumblr: req.body.tumblr,
			instagram: req.body.instagram,
			askfm: req.body.askfm
		},
		email: req.body.email
	};

	if(!update.username) delete update.username;
	else {
		if(update.username.length > 20){
			return res.send({status:0, message: "вы выбрали слишком длинное имя!"});
		} else if(update.username.length == 0){
			return res.send({status:0, message: "имя не может быть пустым."});
		}
	}


	if(!update.alias){
		delete update.alias;
	}
	if(!update.status){
		delete update.status;
	} else {
		if(update.status.length > 299){
			return res.send({status:0, message: "нельзя писать о себе так много!"});
		}
	}

	if(!update.email){
		delete update.email;
	} else {
		if(!isValidEmail(update.email)){
			return res.send({status:0, message: 'такой адрес электронной почты нам не подходит'});
		}
	}
	if(!update.profileType) delete update.profileType;

	if(!update.social.vk) delete update.social.vk;
	if(!update.social.twitter) delete update.social.twitter;
	if(!update.social.tumblr) delete update.social.tumblr;
	if(!update.social.instagram) delete update.social.instagram;
	if(!update.social.askfm) delete update.social.askfm;

	console.log(update.social.vk, update.social.twitter, update.social.tumblr, update.social.instagram, update.social.askfm);
	console.log(update);

	if(update.alias){
		// if we have update alias we can say we 
		

		if(update.alias.length > 32){ // Check alias's length
			return res.send({status:0, message: "адрес страницы слишком длинный"});
		}
		if(!goodAlias(update.alias)){ // Check if alias is valid
			return res.send({status:0, message: "адрес страницы состоит из недопустимых символов"});
		}
		if(bannedAlias(update.alias)){
			return res.send({status:0, message: "извините, но, к сожалению, выбрать такой адрес страницы нельзя!"});
		}



		console.log(bannedAlias(update.alias));

		Users.findOne({alias: update.alias}, function(err, user){
			if(err) throw err;
			// It means that there's no user with this alias.
			if(!user){
				updateData();
			} else {
				// This alias may belonged to our user OR other user
				if(user._id == req.session.passport.user){
					updateData();
				} else {
					res.send({message: "Пользователь с таким адресом уже есть. Выберите другой!"});
				}
			}
		});
	} else {
		updateData();
	}
	

	function updateData(){
		console.log("Start updating data.");
		var id = req.session.passport.user;
		Users.findOneAndUpdate({_id: id}, update, function(err, doc){
			if (err) return res.send(500, { error: err });
			console.log(doc);
			return res.send({status:1, message: "Данные успешно обновлены."});
		});
	}
});


module.exports = updateUser