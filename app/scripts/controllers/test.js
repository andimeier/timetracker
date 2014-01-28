'use strict';

var testControllers = angular.module('testControllers', []);

testControllers.controller('TestCtrl', ['$scope', function($scope) {
	// initialize data member
	$scope.data = {};

	$scope.data.projects = [
		{ id: 1, name: 'First Project' },
		{ id: 2, name: 'Second  Project' },
		{ id: 3, name: 'Third Project' },
	];
	console.log('(after definition) Number of projects in scope: ' + $scope.data.projects.length);

	$scope.data.oneProject = {};

	$scope.selectProject = function(id) {
		id = parseInt(id);
		$scope.data.id = id;

		// copy project
		$scope.data.oneProject = angular.copy($scope.data.projects[id-1]);
		console.log('Chosen project: ' + id + ' with name ' + $scope.data.projects[id-1]);
		console.log('(after selection) Number of projects in scope: ' + $scope.data.projects.length);

		console.log('Have set data.id to [' + id + '], of type [' + typeof(id) + ']');
	}

}]);
