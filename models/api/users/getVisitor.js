var mongoose = require('mongoose')
var Subscriptions = mongoose.model('subscriptions')


function getVisitor(req, res, next){
	req.visitor = {};
	if(req.isAuthenticated() == true){
		req.visitor.authenticated = true;

		if(req.session.passport && req.getUser._id){
			var me = req.session.passport.user;
			var you = req.getUser._id;
			
			if(me == you){
				req.visitor.owner = true;
				next();
			} else {
				req.visitor.owner = false;

				Subscriptions.findOne({follower:me, following: you}, function(err, sub){
					if(err) throw err;
					if(sub){
						req.visitor.following = true;
					} else {
						req.visitor.following = false;
					}

					next();
				});
			}
		}
	} else {
		req.visitor.authenticated = false;
		req.visitor.owner = false;
		next();
	}
}

module.exports = getVisitor