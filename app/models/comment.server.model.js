'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	commentbody: {
		type: String,
		default: '',
		required: 'Please fill in Comment name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	recipe: {
		required: 'Please set recipe id',
		type: Schema.ObjectId,
		ref: 'Recipe'
	},
});

mongoose.model('Comment', CommentSchema);