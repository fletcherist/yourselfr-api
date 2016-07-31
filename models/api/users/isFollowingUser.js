const isFollowingUser = (authenticated, userid, userids) => {
	return new Promise((resolve, reject) => {
		// Get subscription status
		if (authenticated) {
			console.log('user is authenticated')
			var userid = userid
			var searchObj = {
				follower: userids,
				following: userid
			}

			Subscriptions.findOne(searchObj, function(err, subscription){
				if(err) throw err
				var status
				if(subscription){
					status = true
				} else {
					status = false
				}
				return resolve(status)
			})
		} else { 
			// if is not authenticated
			// means not subscribed.
			return resolve(false)
		}
	})
}

module.exports = isFollowingUser