'use strict';

//note addition of $http
angular.module('comments').controller('CommentsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Comments',  
	function($scope, $stateParams, $http, $location, Authentication, Comments) {
	  $scope.authentication = Authentication;

	   //Downvote a recipe
	  $scope.create = function() {
	    var comment = new Comments ({
	    	recipeId: $scope.recipe.recipeId,
	    	comment: $scope.comment.content,
	    	user: $scope.authentication.user
	    });
	    $http.put('comment/create').success(function() {
              // Update the recipe with our user ID.
              recipe.likes.push($scope.authentication.user._id);
	    });

	  };  
}]);