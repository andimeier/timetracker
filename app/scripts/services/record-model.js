'use strict';

var recordModel = angular.module('recordModel', ['ngResource', 'timetrackerApi']);

recordModel.factory('Record', ['$resource', 'Api', function($resource, Api){
	this.get = function(recordId) {
	};
}]);



