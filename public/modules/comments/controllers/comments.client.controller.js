'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comments', 'Socket',
	function($scope, $stateParams, $location, Authentication, Comments, Socket) {
		$scope.authentication = Authentication;

		// Create new Comment
		$scope.create = function() {
			// Create new Comment object
			var comment = new Comments ({
				commentbody: this.commentbody,
				recipe: this.recipeId
			});

			// Redirect after save
			comment.$save(function(response) {
				$location.path('recipes/' + recipe._id);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			$scope.$apply();
			this.commentbody = '';
			$scope.comments = Comments.query();
			/*Socket.on('comment.created', function(comment) {
				console.log(comment);
				alert('New Comment');
			});*/
		};

		// Remove existing Comment
		$scope.remove = function( comment ) {
			var recipeId = this.recipe._id;
			if ( comment ) { comment.$remove();

				for (var i in $scope.comments ) {
					if ($scope.comments [i] === comment ) {
						$scope.comments.splice(i, 1);
					}
				}
			} else {
				$scope.comment.$remove(function() {
					$location.path('recipes/'+recipeId);
				});
			}
		};

		// Update existing Comment
		$scope.update = function() {
			var comment = $scope.comment ;

			comment.$update(function() {
				$location.path('comments/' + comment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Comments
		$scope.find = function() {
			$scope.comments = Comments.query();
		};
		// Find a list of comments on a particular blog
		$scope.findByrecipeId = function(){
			$scope.comments = Comments.get({
				recipe : this.recipeId
			});
		};
		// Find existing Comment
		$scope.findOne = function() {
			$scope.comment = Comments.get({ 
				commentId: $stateParams.commentId
			});
		};
	}
]);