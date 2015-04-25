'use strict';

//note addition of $http
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Recipes',  
	function($scope, $stateParams, $http, $location, Authentication, Recipes) {
	  $scope.authentication = Authentication;

	  $scope.likes = 0;
	  $scope.isLiked = false;
		// Create new Recipe
	  $scope.create = function() {
	    // Create new Recipe object
	    var recipe = new Recipes ({
	      name: this.name,
	      notes: this.content
	    });
	    recipe.$save(function(response) {
	      $location.path('recipes/' + response._id);

	      // Clear form fields
	      $scope.name = '';
	      $scope.content = '';

              $scope.image = '';
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
            
	  };

	  // Remove existing Recipe
	  $scope.remove = function(recipe) {
	    if ( recipe ) { 
	      recipe.$remove();
              
	      for (var i in $scope.recipes) {
		if ($scope.recipes [i] === recipe) {
		  $scope.recipes.splice(i, 1);
		}
	      }
	    } else {
	      $scope.recipe.$remove(function() {
		$location.path('recipes');
	      });
	    }
	  };

	  // Update existing Recipe
	  $scope.update = function() {
	    var recipe = $scope.recipe;

	    recipe.$update(function() {
	      $location.path('recipes/' + recipe._id);
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
	  };

	  // Find a list of Recipes
	  $scope.find = function() {
	    $scope.recipes = Recipes.query();
	  };

	  $scope.homeFind = function() {
	    $scope.recipes = Recipes.query();
	    //$scope.latestRecipes = Recipes.query();
	  };

	  // Find existing Recipe
	  $scope.findOne = function() {
            console.log('Finding one:' + $stateParams.recipeId);
	    $scope.recipe = Recipes.get({ 
	      recipeId: $stateParams.recipeId
	    },function(){
                console.log('Recipe found');
                var user = $scope.authentication.user;
                var containsValue=false;
                console.log('ID '+$scope.authentication.user._id);
                $scope.likes = $scope.recipe.likes.length;
                for(var i=0; i<$scope.recipe.likes.length; i++) {
                  console.log('Comparing ' + $scope.recipe.likes[i] + ' to ' + user._id + ' is ' + ($scope.recipe.likes[i]===user._id).toString());
                  if($scope.recipe.likes[i]===user._id) {
                    containsValue = true;
                  }
                }
                $scope.isLiked = containsValue;
              });

	  };
          
	  //Upvote a recipe
	  $scope.likeThis = function() {
	    var recipe = $scope.recipe;
	    $http.put('recipes/like/' + recipe._id).success(function() {
              // Update the recipe with our user ID.
              recipe.likes.push($scope.authentication.user._id);
              
              $scope.recipe.score++;
              $scope.isLiked=true;
	    });

	  };   

	   //Downvote a recipe
	  $scope.dislikeThis = function() {
	    var recipe = $scope.recipe;
	    $http.put('recipes/dislike/' + recipe._id).success(function() {
              // Update the recipe with our user ID.
              recipe.likes.push($scope.authentication.user._id);
              
              $scope.recipe.score--;
              $scope.isLiked=true;
	    });

	  };  
}]);