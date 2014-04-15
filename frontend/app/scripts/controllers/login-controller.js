'use strict';

angular.module('timetrackerApp')
.controller('LoginCtrl', [
	'$rootScope', 
	'$scope', 
	'$location', 
	'$routeParams', 
	'Login',
		function ($rootScope, $scope, $location, $routeParams, Login) {

	var loginData = $scope.loginData = {
		username: null,
		password: null,
		errorMessage: null,
		successMessage: null
	};
	
	//#this.loginData = $scope.loginData = new LoginData();

 	if ($routeParams.msg) {
 		$scope.data.message = $routeParams.msg;
 	}

 	$scope.submitLoginForm = function() {
		Login.login(loginData.username, loginData.password, function() {
			// login went ok
 			// store username/password of logged in user globally
 			$rootScope.username = username;
			$rootScope.loggedIn = true;

 			$location.path('/');
		}, function(err){
			loginData.errorMessage = err;
		});
 	}

 	$scope.logout = function() {
		Login.logout(function() {
			// remove global user info
			$rootScope.username = null;
			$rootScope.loggedIn = false;

			$location.path('/login').search({ 'msg':'You have been logged out successfully.' });
		});
 	}
}]);
