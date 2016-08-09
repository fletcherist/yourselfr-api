const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')
const getPosts = require('./getPosts')

const getNewPosts = (req, res) => {
	var id = req.params.id;
	var alias = req.params.alias;

	Users.findOne({alias: alias}, function(err, user){
		if (!user) {
			return res.send({message: 'No user with this alias', error: 1});
		}
		var user_id = user._id;
		Posts.findById(id, function(err, post){
			if (!post) {
				return res.send({message: 'No post with this ID', error: 1});
			}
		})
		Posts.find({created_by: user_id}).sort({_id: - 1}).lean()
			.exec(function(err, posts){
				if (!posts) {
					return res.send({error: 1, message: 'There\'s no post or user with this alias.'});
				}
				// initial value for count
				var count = 0;
				for (var i=0; i < posts.length; i++){
					// never do !== there bc this is comparing id with string
					if (posts[i]._id != id) {
						count++;
					} else {
						break;
					}
				}
				req.limit = count;
				if (count === 0) {
					return res.send({status: 0, message: 'Not need for update', posts:[]});
				}
				getPosts(req, res, function(){
					// console.log('posts', req.posts);
					return res.send({status: 1, posts: req.posts});
				});
				
			})
	});
}

module.exports = getNewPosts