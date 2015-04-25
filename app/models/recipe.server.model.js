'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Recipe Schema
 */
var RecipeSchema = new Schema({
	recipeId: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: '',
		required: 'Please name your recipe',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
    image: {
        type: String,
        default: ''
        },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	score: {
		type: Number,
		default: 1
	},
	likes: [{
	  type: Schema.ObjectId,
          ref: 'User'
	}]
});

mongoose.model('Recipe', RecipeSchema);