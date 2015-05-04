'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io', 'cgNotify'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('comments');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('profiles');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('recipes');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
//'use strict';

// Configuring the Articles module
/*angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);*/
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var article = new Articles({
				title: this.title,
				content: this.content
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('comments').config(['$stateProvider',
	function($stateProvider) {
		// Comments state routing
		$stateProvider.
		state('listComments', {
			url: '/comments',
			templateUrl: 'modules/comments/views/list-comments.client.view.html'
		}).
		state('createComment', {
			url: '/comments/create',
			templateUrl: 'modules/comments/views/create-comment.client.view.html'
		}).
		state('viewComment', {
			url: '/comments/:commentId',
			templateUrl: 'modules/comments/views/view-comment.client.view.html'
		}).
		state('editComment', {
			url: '/comments/:commentId/edit',
			templateUrl: 'modules/comments/views/edit-comment.client.view.html'
		});
	}
]);
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
'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
	function($resource) {
		return $resource('comments/:commentId', { commentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};
		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);
'use strict';

// Configuring the profiles module
angular.module('profiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Profiles', 'profiles', 'dropdown', '/profiles(/create)?');
		Menus.addSubMenuItem('topbar', 'profiles', 'List Profiles', 'profiles');
	}
]);
'use strict';

//Setting up route
angular.module('profiles').config(['$stateProvider',
	function($stateProvider) {
		// Profiles state routing
		$stateProvider.
		state('listProfiles', {
			url: '/profiles',
			templateUrl: 'modules/profiles/views/list-profiles.client.view.html'
		}).
		state('createProfile', {
			url: '/profiles/create',
			templateUrl: 'modules/profiles/views/create-profile.client.view.html'
		}).
		state('viewProfile', {
			url: '/profiles/:profileId',
			templateUrl: 'modules/profiles/views/view-profile.client.view.html'
		}).
		state('editProfile', {
			url: '/profiles/:profileId/edit',
			templateUrl: 'modules/profiles/views/edit-profile.client.view.html'
		});
	}
]);
'use strict';

// Profiles controller
angular.module('profiles').controller('ProfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profiles',
	function($scope, $stateParams, $location, Authentication, Profiles) {
		$scope.authentication = Authentication;

		// Create new Profile
		$scope.create = function() {
			// Create new Profile object
			var profile = new Profiles ({
				name: this.name
			});

			// Redirect after save
			profile.$save(function(response) {
				$location.path('profiles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Profile
		$scope.remove = function(profile) {
			if ( profile ) { 
				profile.$remove();

				for (var i in $scope.profiles) {
					if ($scope.profiles [i] === profile) {
						$scope.profiles.splice(i, 1);
					}
				}
			} else {
				$scope.profile.$remove(function() {
					$location.path('profiles');
				});
			}
		};

		// Update existing Profile
		$scope.update = function() {
			var profile = $scope.profile;

			profile.$update(function() {
				$location.path('profiles/' + profile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Profiles
		$scope.find = function() {
			$scope.profiles = Profiles.query();
		};

		// Find existing Profile
		$scope.findOne = function() {
			$scope.profile = Profiles.get({ 
				profileId: $stateParams.profileId
			});
		};
	}
]);
'use strict';

//Profiles service used to communicate Profiles REST endpoints
angular.module('profiles').factory('Profiles', ['$resource',
	function($resource) {
		return $resource('profiles/:profileId', { profileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Recipes module
angular.module('recipes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Recipes', 'recipes', 'dropdown', '/recipes(/create)?');
		Menus.addSubMenuItem('topbar', 'recipes', 'List Recipes', 'recipes');
		Menus.addSubMenuItem('topbar', 'recipes', 'New Recipe', 'recipes/create');
	}
]);

'use strict';

//Setting up route
angular.module('recipes').config(['$stateProvider',
	function($stateProvider) {
		// Photos state routing
		$stateProvider.
		state('listRecipes', {
			url: '/recipes',
			templateUrl: 'modules/recipes/views/list-recipes.client.view.html'
		}).
		state('createRecipe', {
			url: '/recipes/create',
			templateUrl: 'modules/recipes/views/create-recipe.client.view.html'
		}).
		state('viewRecipe', {
			url: '/recipes/:recipeId',
			templateUrl: 'modules/recipes/views/view-recipe.client.view.html'
		}).
		state('editRecipe', {
			url: '/recipes/:recipeId/edit',
			templateUrl: 'modules/recipes/views/edit-recipe.client.view.html'
		});
	}
]);
'use strict';

//note addition of $http
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Recipes', 'Socket',  
	function($scope, $stateParams, $http, $location, Authentication, Recipes, Socket) {
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

	  Socket.on('recipe.created', function(recipe) {
	    console.log(recipe);
	    console.log(recipe.name);
		//alert('New Recipe, ' + recipe.name + 'Added');
		//res.redirect('/recipes');
	  });
}]);
'use strict';

//Recipes service used to communicate Recipes REST endpoints
angular.module('recipes').factory('Recipes', ['$resource',
	function($resource) {
		return $resource('recipes/:recipeId', { recipeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);