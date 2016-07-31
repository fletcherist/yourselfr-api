var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var router = express.Router();
var tools = require('./../tools.js');


var Posts = mongoose.model('posts');
var Users = mongoose.model('users');
var Likes = mongoose.model('likes');
var Stats = mongoose.model('stats');

// Count class
var Count = function(){
	this.Posts = function(callback){
		Posts.count({}, function(err, posts){
			if(err) throw err;
			callback(null, posts);
		});
	};
	this.Users = function(callback){
		Users.count({}, function(err, users){
			if(err) throw err;
			callback(null, users);
		});
	};
	this.Likes = function(callback){
		Likes.count({}, function(err, likes){
			if(err) throw err;
			callback(null, likes);
		});
	};
	this.Visits = function(callback){
		Stats.findOne({}, function(err, stats){
			if(err) throw err;
			var visits = stats.coverage.visits;
			callback(null, visits);
		});
	};
	this.Uptime = function(callback){
		callback(null, process.uptime());
	};
};


function apiRequestsCount(req, res, next){
	Stats.findOneAndUpdate({}, {$inc: {"coverage.visits": 1} }, function(err, resp){
		if(err) throw err;

		if(!resp){
			setRequestsCounter();
		}

		next();
	});	
}

function setRequestsCounter(){
	var counter = new Stats();
	counter.visits += 1;
	counter.save();
}



function getStatistics(req, res, next){
	var statistics = {};

	// Including count class
	var count = new Count();

	var timeCatch_Start = new Date().getTime();

	async.series({
		countPosts: count.Posts,
		countLikes: count.Likes,
		countUsers: count.Users,
		countVisits: count.Visits,
		uptime: count.Uptime
	}, function(err, results){

		var timeCatch_Second = new Date().getTime();
		results.ping = timeCatch_Second - timeCatch_Start;

		req.getStatistics = results;
		next();
	});
}




module.exports = router;

module.exports.getStatistics = getStatistics;
module.exports.apiRequestsCount = apiRequestsCount;