'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Recipe = mongoose.model('Recipe');

/**
 * Globals
 */
var user, recipe;

/**
 * Unit tests
 */
describe('Recipe Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			recipe = new Recipe({
				// Add model fields
				// ...
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return recipe.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Recipe.remove().exec();
		User.remove().exec();

		done();
	});
});