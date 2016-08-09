// POST A STICKER
// router.post('/sticker/post', function(req, res){
// 	var id = req.body.id;
// 	var target = req.body.target;

// 	if(!id || !target){
// 		return res.send({message: "No id or target, false"});
// 	}

// 	var type = 'baach';

// 	Users.findOne({alias: target}, function(err, user){
// 		if(err) throw err;
// 		if(user){
// 			var send = '<img src=\'images/stickers/'+ type +'/'+ id +'.png\' width=\'120\'>';

// 			var sticker = new Posts();
// 			sticker.created_by = user._id;
// 			sticker.text = send;
// 			sticker.save(function(err){
// 				if(err) throw err;

				
// 				res.send({status:1, message: "Sticker was posted."});
// 				tools.countUserPosts(user._id);

// 				return;
// 			});

// 		} else {
// 			return res.send({message: "There's no user to post a sticker"});
// 		}
// 	});
	
// });
