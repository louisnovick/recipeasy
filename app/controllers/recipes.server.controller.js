'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Recipe = mongoose.model('Recipe'),
	_ = require('lodash'),
	Imagemin = require('imagemin');
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
		var imgPath = req.files.image.path.substring(7);
		recipe.image = imgPath;
		console.log(recipe.image);
	}  else

		recipe.image='../modules/core/img/assets/noupload.png';

	//Finds the extension type of the uploaded image
	var ext = req.files.image.extension.toLowerCase();

	//Chooses the compression type based on extension type for minification
	if (ext == 'png')
		var compType = Imagemin.optipng({ optimizationLevel: 3 });
	else if(ext == 'gif') 
		var compType = Imagemin.gifsicle({ interlaced: true });
	else
		var compType = Imagemin.jpegtran({ progressive: true });


	//Minifies the images uploaded so we save on load times
	var imagemin = new Imagemin().src(imgPath).use(compType);
	imagemin.run(function(err, files) {        
	  if (err) {             
	    return next(err);        
	  }
	  //Had to do for loop for files array, even though
	  //there is only one, or it breaks
	  for (var i = 0; i < files.length; i++) {
		  recipe.image=files[i].path;
	  } 		
	});

	
	var makeId = function() {
		//info for creating a unique identifier
		var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
			tempId = '';
		//generates the id
	    for(var i=0; i < 6; i+=1) {
	        tempId += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    console.log("tempId before DB look: "+tempId);
		//checks to see if there's a recipe with this id
		Recipe.find({ recipeId: tempId }, function(err, recipes) {
			if (recipes.length > 0) {
				//if there's a match, make a different name
				makeId();
			} else {
				//If it is unique, sets it as recipe ID
				recipe.recipeId=tempId;
				console.log("tempId after DB "+tempId);
				console.log("RecipeId after DB "+recipe.recipeId);
				console.log(recipe);
				//Saves recipe to DB
				recipe.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
			  			res.redirect('/#!/recipes/'+recipe._id); 
					}
				});
			}
		});
	};
	makeId();
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
	Recipe.find().sort('-score').populate('user', 'displayName').exec(function(err, recipes) {
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
	req.recipe.score++;
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
 * Likes a recipe
 */
exports.dislike = function(req, res) {
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
	req.recipe.score--;
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
