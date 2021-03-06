'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var recipes = require('../../app/controllers/recipes.server.controller');
  var multer = require('multer');
  
  app.use(multer({ dest:'./public/uploads'}));
  // Recipes Routes
  app.route('/recipes')
		.get(recipes.list)
		.post(users.requiresLogin, recipes.create);

	app.route('/recipes/:recipeId')
		.get(recipes.read)
		.put(users.requiresLogin, recipes.hasAuthorization, recipes.update)
		.delete(users.requiresLogin, recipes.hasAuthorization, recipes.delete);
	//adds a route for likes
	app.route('/recipes/like/:recipeId')
        .put(users.requiresLogin, recipes.like);

   	//adds a route for likes
	app.route('/recipes/dislike/:recipeId')
        .put(users.requiresLogin, recipes.dislike);
  
	// Finish by binding the Recipe middleware
	app.param('recipeId', recipes.recipeByID);
	
};
