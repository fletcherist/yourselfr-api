const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')
const Likes = mongoose.model('likes')

const moderation = (req, res) => {
	var action = req.body.action;
	var id = req.body.id;

	console.log(action, id);
	if(!action || !id){
		console.log(id);
		console.log(action);
		res.send({message: 'empty query'});
	} else {
		Posts.findById(id, function(err, post){
			if(err) throw err;
			if(post){
				Users.findById(post.created_by, function(err, user){
					if (err) throw err;
					if(user){
						if(user._id == req.session.passport.user){
							startModeration();
						} else {
							return res.send({message: "you have not permission to moderate this post."});
						}
					} else {
						return res.send({message:"Серверная ошибка!!"});
					}

					function startModeration(){
						if(action == 'accept'){
							post.type = 1;
							user.stats.unpublishedPosts -= 1;

							post.save();
							user.save();
							res.send({status: 1, message: ""});
						} else if (action == 'remove'){
							Posts.findByIdAndRemove(id, function(err){
								if(err) throw err;
								res.send({status: 0, message: "Удалено"});
							});
						} else {
							res.send({message: 'wrong action'});
						}
					}
				});
			}
		});
	}
}

module.exports = moderation