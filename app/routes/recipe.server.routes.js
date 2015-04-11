'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	recipes = require('../../app/controllers/recipe.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/recipe')
		.get(recipes.list)
		.post(users.requiresLogin, recipes.create);

	app.route('/recipe/:recipeId')
		.get(recipes.read)
		.put(users.requiresLogin, recipes.hasAuthorization, recipes.update)
		.delete(users.requiresLogin, recipes.hasAuthorization, recipes.delete);

	// Finish by binding the article middleware
	app.param('recipeId', recipes.recipeByID);
};