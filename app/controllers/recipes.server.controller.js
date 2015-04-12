'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Recipe = mongoose.model('Recipe'),
	_ = require('lodash');

/**
 * Create a Recipe
 */
exports.create = function(req, res) {
  console.log(req.body);
  console.log(req.files);
  var recipe = new Recipe(req.body);
  recipe.user = req.user;
  recipe.likes.push(req.user._id);
  if(req.files.image) {
    recipe.image =req.files.image.path.substring(7);
    console.log(recipe.image);
  }  else
    recipe.image='default.jpg';
  recipe.save(function(err) {
    if (err) {
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.redirect('/#!/recipes/'+recipe._id); 
    }
  });
};

/**
 * Show the current Recipe
 */
exports.read = function(req, res) {

  var recipe = req.recipe;
  console.log(recipe);
  recipe.views += 1;
  recipe.save(function(err) {
    if (err) {
      console.log('Problem'+err);
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else 
      res.jsonp(recipe);
  });
};


/**
 * Update a Recipe
 */
exports.update = function(req, res) {
	var recipe = req.recipe ;

	recipe = _.extend(recipe , req.body);

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * Delete an Recipe
 */
exports.delete = function(req, res) {
	var recipe = req.recipe ;

	recipe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * List of Recipes
 */
exports.list = function(req, res) { 
	Recipe.find().sort('-created').populate('user', 'displayName').exec(function(err, recipes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipes);
		}
	});
};
/**
 * Likes a recipe
 */
exports.like = function(req, res) {
  var user = req.user;
  var containsValue = false;

  // Determine if user is already in 
  for(var i=0; i<req.recipe.likes.length; i++) {
    console.log('Comparing ' + req.recipe.likes[i] + ' to ' + req.user._id + ' is ' + req.recipe.likes[i].equals(req.user._id));
    if(req.recipe.likes[i].equals(req.user._id)) {
      containsValue = true;
    }
  }
  if(!containsValue) {
	req.recipe.likes.push(req.user._id);
  }
  req.recipe.save(function(err) {
    if (err) {
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(req.recipe);
	 }
  });
};

/**
 * Recipe middleware
 */
exports.recipeByID = function(req, res, next, id) {
  console.log('finding by id:'+id);
	Recipe.findById(id).populate('user', 'displayName').exec(function(err, recipe) {
	  if (err) return next(err);
	  if (! recipe) return next(new Error('Failed to load Recipe ' + id));
	  req.recipe = recipe;
	  next();
	});
};

/**
 * Recipe authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.recipe.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
