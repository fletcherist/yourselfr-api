var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	alias: String,
	email: String,
	password: String,
	about: String,
	status: String,
	photo: {type: String, default: 'http://yoursel.fr/upload/avatar/nophoto.png'},
	absPathPhoto: {type: String, default: ''},
	header: {type: String, default: 'noheader.png'},
	background: String,
	social: {
		vk: {type: String, default: ''},
		twitter: {type: String, default: ''},
		tumblr: {type: String, default: ''},
		instagram: {type: String, default: ''},
		askfm: {type: String, default: ''},
		facebook: {type: String, default: ''}
	},
	created_at: {type: Date, default: Date.now},
	profileType: {type: Number, default: 1}, // 1 — Open. 2 — Moderating.
	stats: {
		posts: {type: Number, default: 0},
		likes: {type: Number, default: 0},
		followers: {type: Number, default: 0},
		following: {type: Number, default: 0},
		visits: {type: Number, default: 0},
		unpublishedPosts: {type: Number, default: 0, min:0},
		getStarted: {type:Boolean, default: false}
	},
	online: {
		status: Boolean,
		time: Date
	},
	vkID: {type: String, default: '0'},
	twitterID: {type: String, default: '0'},
	ban: {
		status: {type: Boolean, default: false},
		reason: {type: String, deafult: ""}
	},
	preferences: {
		notify: {
			post: {type: Boolean, default: true},
			follower: {type: Boolean, default: true}
		},
		photo: {type: Boolean, default: false},
		background: {type: Boolean, default: false}
	},
	pseudo: {type:Boolean, default: false},
	isFollowing: {type: Boolean, default: false},
	developer: {type: Number, default: 0} // 0 - usual; 1 - moderator; 2 - superadmin
});

var postSchema = new mongoose.Schema({
	text: String,
	type: {type: Number, default: 1},
	created_by: String,
	created_at: {type: Date, default: Date.now},
	favourite: {type: Boolean , default: false},
	likes: {type: Number, default: 0},
	attachments: {
		photo: String
	}
});

var likeSchema = new mongoose.Schema({
	object: String,
	created_by: String,
	created_at: {type: Date, default: Date.now}
});

var commentSchema = new mongoose.Schema({
	text: String,
	post_id: String,
	created_at: {type: Date, default: Date.now},
	created_by: String,
	likes: {type: Number, default: 0},
	attachments: {
		photo: String
	}
});

var subscriptionsSchema = new mongoose.Schema({
	follower: String,
	following: String
});

var statSchema = new mongoose.Schema({
	coverage: {
		visits: {type: Number, default: 0},
		likes:  {type: Number, default: 0},
		posts:  {type: Number, default: 0}
	}
});


/*
	Key codes:
		1 - post
		2 - follower
		3 - likePost
		4 - likeComment
		5 - comment
		6 - new friend
		0 - system
*/
var notificationSchema = new mongoose.Schema({
	user_id: {type: String},
	keyCode: {type: Number, default: 0},
	item_id: {type: String},
	message: {type: String, default: ''},
	created_at: {type: Date, default: Date.now},
	checked: {type: Boolean, default: false}
});

mongoose.model('users', userSchema);
mongoose.model('posts', postSchema);
mongoose.model('likes', likeSchema);
mongoose.model('comments', commentSchema);
mongoose.model('stats', statSchema);
mongoose.model('subscriptions', subscriptionsSchema);
mongoose.model('notifications', notificationSchema);
