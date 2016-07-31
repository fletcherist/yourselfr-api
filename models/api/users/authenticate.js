function authenticate (req, res, next) {
	if(req.isAuthenticated()){
		next()
	} else {
		console.log('no permission')
		res.send({message: 'You have no permission to do this. Need Authentication'})
	}
}

module.exports = authenticate