'use strict';

// Configuring the Articles module
angular.module('recipe').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Recipes', 'recipe', 'dropdown', '/recipe(/create)?');
		Menus.addSubMenuItem('topbar', 'recipe', 'List Recipes', 'recipe');
		Menus.addSubMenuItem('topbar', 'recipe', 'New Recipe', 'recipe/create');
	}
]);