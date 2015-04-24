'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Recipes',
	function($scope, $stateParams, $http, $location, Authentication, Recipes) {
	  $scope.authentication = Authentication;
	  // Find a list of Recipes
	  $scope.find = function() {
	    $scope.recipes = Recipes.query().sort({viewCount: -1});
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
           
    }]);