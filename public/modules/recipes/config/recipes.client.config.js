'use strict';

// Configuring the Recipes module
angular.module('recipes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Recipes', 'recipes', 'dropdown', '/recipes(/create)?');
		Menus.addSubMenuItem('topbar', 'recipes', 'List Recipes', 'recipes');
	}
]);
