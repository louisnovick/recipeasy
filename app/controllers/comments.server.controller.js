'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Comment = mongoose.model('Comment'),
	_ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function(req, res) {
	var comment = new Comment(req.body);
	comment.user = req.user;

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(comment);
			res.jsonp(comment);
		}
	});
};

/**
 * Show the current Comment
 */
exports.read = function(req, res) {
	res.jsonp(req.comment);
};

/**
 * Update a Comment
 */
exports.update = function(req, res) {
	var comment = req.comment ;

	comment = _.extend(comment , req.body);

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * Delete an Comment
 */
exports.delete = function(req, res) {
	var comment = req.comment ;

	comment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * List of Comments
 */
exports.list = function(req, res) { 
	Comment.find().sort('-created').populate('user', 'displayName').exec(function(err, comments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comments);
		}
	});
};


exports.findByRecipeId = function(req,res, next, id){
	Comment.find({recipe: id},{},{},{}).sort('-created').populate('user','displayName').exec(function(err, comments) {
		if(err){
			console.log('comments of a recipe');
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(comments);
		}
	});
};

/**
 * Comment middleware
 */
exports.commentByID = function(req, res, next, id) { Comment.findById(id).populate('user', 'displayName').populate('recipe','name').exec(function(err, comment) {
		if (err) return next(err);
		if (! comment) return next(new Error('Failed to load Comment ' + id));
		req.comment = comment ;
		next();
	});
};

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
