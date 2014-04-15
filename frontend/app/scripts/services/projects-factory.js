'use strict';

var projectsFactory = angular.module('projectsFactory', ['ngResource', 'timetrackerApi']);

projectsFactory.factory('Project', ['$resource', 'Api', function($resource, Api){
	this.get = function(projectId) {
		return 'Alex';
	};
}]);



