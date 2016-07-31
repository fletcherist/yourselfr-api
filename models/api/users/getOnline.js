const getOnline = (authenticated, userid, userids, onlineTime) => {
	return new Promise ((resolve, reject) => {
		var online = {}
		if (authenticated) {
			if(userid == userids){
				online.status = true
				online.time = new Date()
			} else {
				var date = new Date(onlineTime)
				var now =  new Date()

				var timePast = Math.floor((now - date) / 1000 / 60)
				if(timePast > 15){
					online.status = false
				}
			}
			resolve(online)
		} else {
			resolve(false)
		}
	})
}

module.exports = getOnline