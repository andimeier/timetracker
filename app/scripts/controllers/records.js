'use strict';

var recordControllers = angular.module('recordControllers', []);

recordControllers.controller('RecordListCtrl', ['$scope', 'Record', function($scope, Record) {
	$scope.records = Record.query();
	$scope.orderProp = 'starttime';

	$scope.onerecord = {};

	$scope.editRecord = function(rec) {
		$scope.onerecord = rec;
	};

}]);
 
recordControllers.controller('RecordDetailCtrl', ['$scope', '$routeParams', 'Record', function($scope, $routeParams, Record) {
	//$scope.onerecord = Record.get({recordId: $routeParams.recordId}, function(record) {});

	$scope.processRecordForm = function() {

		//alert('id: ' + $scope.onerecord.hour_id);

		var reply = Record.save($scope.onerecord);
		$scope.onerecord = {}; // empty the form after saving
		$scope.success = 'Oh yeah!';

		// refresh record list
		$scope.records = Record.query();
	};
}]);
