const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')
const Likes = mongoose.model('likes')

const removePost = (req, res) => {
	if (!req.isAuthenticated()) {
		return res.send({status: 0, error:1, message: 'This method is only for authenticated users.'})
	}
	console.log('[Removing Like] on id: ' + req.params.id)
	// Here i check if the post creator's id and user ids are ==
	var id = req.params.id // Post id.
	

	if(!id){
		return res.send({message: "No parametrs sent"})
	}
	
	var user_ids = req.session.passport.user // User ids.


	Posts.findById(id, function(err, post){
		if(!err){
			if(!post){
				return res.send({message: "Такой пост не найден, возможно, он уже был удалён."})
			}

			if(post.created_by == user_ids){
				Posts.remove({_id: id}, function(err){
					if(err) throw err

					removeLikesOnPost(id)
					Users.findById(user_ids, function(err, user){
						if(err) throw err
						user.stats.posts = user.stats.posts - 1

						if(post.type == 2){

							user.stats.unpublishedPosts -= 1
						}

						user.save()
						res.send({status: 1, message: "This post was removed"})
					})

				})
			} else {
				res.send({message: "You are going to delete post which is not yours! Go away!"})
			}
		}

		function removeLikesOnPost(id){
			Likes.remove({object: id}, function(err){
				if(err) throw err

				// Likes were removed.
			})
		}
	})
}

module.exports = removePost