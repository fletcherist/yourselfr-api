// Requiring node modules
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var tools = require('../models/tools.js');

// Requiring classes
var classUsers = require('../models/api/classUsers');
var classPosts = require('../models/api/classPosts');
var classLikes = require('../models/api/classLikes');
var classPreferences = require('../models/api/classPreferences');
var classSubscriptions = require('../models/api/classSubscriptions');
var classStatistics = require('../models/api/classStatistics');
var classControl = require('../models/api/classControl');
var classComments = require('../models/api/classComments');
var classNotifications = require('../models/api/classNotifications');
var classAll = require('../models/api/classAll');


// Count visit site
var Stats = mongoose.model('stats');
router.use(classStatistics.apiRequestsCount);

router.use('/users', classUsers);
router.use('/posts', classPosts);
router.use('/likes', classLikes);
router.use('/preferences', classUsers.authenticate, classPreferences);
router.use('/notifications', classUsers.authenticate, classNotifications);
router.use('/comments', classComments);
router.use('/subscriptions', classSubscriptions);
router.use('/statistics', classStatistics);
router.use('/control', classControl);
router.use('/all', classAll);
router.use('/:method', function(req, res){
	var method = req.params.method;
	return res.send({message: "Method '"+method+"' is not defined!"});
});


module.exports = router;
module.exports.users = classUsers;
module.exports.posts = classPosts;
module.exports.subscriptions = classSubscriptions;
module.exports.statistics = classStatistics;
module.exports.control = classControl;
module.exports.comments = classComments;
module.exports.preferences = classPreferences;
module.exports.notifications = classNotifications;