'use strict';

angular.module('timetrackerApp')
 .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Login',
		function ($rootScope, $scope, $location, $routeParams, Login) {

	$scope.data = {};

 	// any message to be displayed?
 	console.log('paramer=' + JSON.stringify($routeParams));

 	if ($routeParams.msg) {
 		$scope.data.message = $routeParams.msg;
 	}

 	$scope.submitLoginForm = function() {

 		var username = $scope.logindata.username,
 			password = $scope.logindata.password;

 		Login.login({
 			user: username, 
 			pass: password
 		}, function(success) {
 			$scope.loginSuccess = 1;
 			console.log('WENT OK');

 			// store username/password of logged in user globally
 			$rootScope.username = username;
 			$rootScope.password = password;
 			$rootScope.loggedIn = true;

 			$location.path('/');

 		}, function(error) {
 			$scope.loginError = 1;
			console.log('WENT NOT OK');
 		});
 	}

 	$scope.logout = function() {

 		Login.logout({}, function(success) {
	 		// remove global user info
			$rootScope.username = null;
			$rootScope.password = null;
			$rootScope.loggedIn = false;

			$location.path('/login').search({ 'msg':'You have been logged out successfully.' });
 		});
 	}

  }]);
