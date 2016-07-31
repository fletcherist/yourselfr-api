var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Promise = require('bluebird')

var isFreeAliasFunction = require('../preferences/alias').isFreeAlias

const isFreeAlias = async((req, res) => {
	var alias = req.params.alias;
	if (!alias) {
		res.send({status: 0, message: 'No alias provided'});
	}
	if (await(isFreeAliasFunction(alias))) {
		res.send({status: 1, message: `'${alias}' is free`});
	} else {
		res.send({status: 0, message: `'${alias}' has already taken`});
	}
})

module.exports = isFreeAlias