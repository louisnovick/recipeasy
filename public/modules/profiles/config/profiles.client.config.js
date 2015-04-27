'use strict';

// Configuring the profiles module
angular.module('profiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Profiles', 'profiles', 'dropdown', '/profiles(/create)?');
		Menus.addSubMenuItem('topbar', 'profiles', 'List Profiles', 'profiles');
	}
]);
