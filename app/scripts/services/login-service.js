'use strict';

var loginService = angular.module('loginService', [
	'ngResource', 
	'timetrackerApi', 
	'services.config'
]);

loginService.service('Login', ['$resource', 'configuration', 'Api', function($resource, configuration, Api){
	this.login = function(username, password, done, err) {
		Api.login.login({
			user: username, 
			pass: password
		}, function(success) {
			done();
		}, function(error) {
			err('Ooh.');
		});
	};

	this.logout = function(done) {
		Api.login.logout({}, function(success) {
			done();
		});
	};
}]);
