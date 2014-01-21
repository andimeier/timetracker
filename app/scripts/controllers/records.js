'use strict';

var timetrackerApp = angular.module('timetrackerApp', []);

timetrackerApp.controller('RecordsListCtrl', ['$scope', 'Record', function($scope, Records) {
	$scope.records = Records.query();
	$scope.orderProp = 'starttime';
}]);
 
timetrackerApp.controller('RecordsDetailCtrl', ['$scope', '$routeParams', 'Record', function($scope, $routeParams, Records) {
	$scope.record = Records.get({recordId: $routeParams.recordId}, function(record) {});
}]);
