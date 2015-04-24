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
	views: {
		type: Number,
		default: 0
	},
	likes: [{
	  type: Schema.ObjectId,
          ref: 'User'
	}]
});

mongoose.model('Recipe', RecipeSchema);