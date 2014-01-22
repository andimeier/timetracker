'use strict';

var recordControllers = angular.module('recordControllers', []);

recordControllers.controller('RecordListCtrl', ['$scope', 'Record', function($scope, Record) {
	$scope.records = Record.query();
	$scope.orderProp = 'starttime';
}]);
 
recordControllers.controller('RecordDetailCtrl', ['$scope', '$routeParams', 'Record', function($scope, $routeParams, Record) {
	$scope.record = Record.get({recordId: $routeParams.recordId}, function(record) {});
}]);
