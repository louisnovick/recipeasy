'use strict';

//Setting up route

angular.module('recipe').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listRecipes', {
			url: '/recipe',
			templateUrl: 'modules/recipe/views/recipe.client.view.html'
		}).
		state('createRecipe', {
			url: '/recipe/create',
			templateUrl: 'modules/recipe/views/create-recipe.client.view.html'
		}).
		state('viewRecipe', {
			url: '/recipe/:recipeId',
			templateUrl: 'modules/recipe/views/view-recipe.client.view.html'
		}).
		state('editRecipe', {
			url: '/recipe/:recipeId/edit',
			templateUrl: 'modules/recipe/views/edit-recipe.client.view.html'
		});
	}
]);