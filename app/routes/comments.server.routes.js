'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var comments = require('../../app/controllers/recipes.server.controller');
  var multer = require('multer');
  
  app.use(multer({ dest:'./public/uploads'}));
  // Recipes Routes
  app.route('/comment')
		.get(recipes.list)
		.post(users.requiresLogin, recipes.create);

	app.route('/comment/create')
		.get(recipes.read)
		.put(users.requiresLogin, recipes.hasAuthorization, recipes.update)
		.delete(users.requiresLogin, recipes.hasAuthorization, recipes.delete);	
};
