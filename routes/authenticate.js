var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

var vkFriends = require('../models/vk/vkFriends');
var api = require('./api');

module.exports = function(passport){
	router.get('/', async((req, res) => {
		console.log("Trying to authenticate..");
		if(req.isAuthenticated()){
			var id = req.session.passport.user;
			var user = await(api.users.getUserById(id));
			var response = {
				authenticated: true,
				user: user
			};
			res.send(response);
		} else {
			res.send({
				message: 'Not Authenticated',
				authenticated: false
			});
		}
	}));

	//log in
	router.get('/login', function(req, res){
		if(req.isAuthenticated()){
			res.redirect('/');
			return;
		} else {
			res.send({status: 0, message: 'you are not authenticated'});
		}
	});

	// auth/login
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure',
		failureFlash: true
	}));

	// auth/signup
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure',
		failureFlash: true
	}));

	// auth/vk
	// Signup or login via vkontakte
	router.get('/vk', passport.authenticate('vkontakte', {
		successRedirect: '/i/get-started',
		failureRedirect: '/login',
	}));

	// auth/logout
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});





	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.status(200);
		var message = req.flash('message')[0] || 'ошибка';
		res.send({state: 'success', user: req.user ? req.user : null, message:message});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.status(200);
		var message = req.flash('message')[0] || 'ошибка';
		res.send({state: 'failure', user: null, message:message});
	});

	router.get('/vk/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }),
		function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/i/get-started');
	});

	router.use(function(req, res){
		res.send("Awwh, we have not support your authentication method yet!");
	});


	return router;
};
