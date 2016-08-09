const mongoose = require('mongoose')
const Posts = mongoose.model('posts')
const Users = mongoose.model('users')

const getLastPost = (req, res) => {
	var alias = req.params.alias
	console.log('alias', alias)
	if (!alias)  {
		return res.send({error: 1, message: 'Please provide an alias!'})
	} else {
		Users.findOne({alias: alias}, function(err, user){
			if (user) {
				var user_id = user._id
				Posts.findOne({created_by: user_id}).sort({_id: - 1})
					.exec(function(err, post){
						if (!post) {
							return res.send({error: 1, message: 'There\'s no post or user with this alias.'})
						}
						return res.send(post)
					})
			} else {
				return res.send({error: 1, message: 'cant find user with this alias'})
			}
		})
	}
}

module.exports = getLastPost