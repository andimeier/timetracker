'use strict';

var recordControllers = angular.module('recordControllers', []);
var counter = 1;

recordControllers.controller('RecordListCtrl', ['$scope', 'Record', function($scope, Record) {
	// initialize data member
	$scope.data = {};

	$scope.data.records = Record.query();
	$scope.data.records.forEach(function(rec) {
		rec.startdate = 'Alex' + 'asdf';
	});
	$scope.orderProp = 'starttime';

	$scope.data.onerecord = {};

	$scope.editRecord = function(rec) {
		// edit a copy so the old values are preserved - these will be needed
		// in case of a "cancel edit"
		var r = angular.copy(rec);
		$scope.data.onerecord = r;
		// $scope.data.onerecord = rec;
		$scope.data.onerecord.date = $scope.extractDate(rec.starttime);
		$scope.test = counter++;
	};

	$scope.extractDate = function(datetime) {
		//return 'Alex extracted (extractDate)';
		return '[' + datetime + ']';
		return 'Alex was here'.substring(0, 3);
	};

}]);
 
recordControllers.controller('RecordDetailCtrl', ['$scope', '$routeParams', 'Record', function($scope, $routeParams, Record) {
	//$scope.data.onerecord = Record.get({recordId: $routeParams.recordId}, function(record) {});

	$scope.processRecordForm = function() {

		var reply = Record.save($scope.data.onerecord, function() {
			// save went ok
			$scope.data.onerecord = {}; // empty the form after saving

			$scope.success = 'Saved successfully.';

			// refresh record list
			$scope.data.records = Record.query();

		}, function(response) {
			// failure when saving
			$scope.error = 'Error at saving, response status: ' + response.status;
		});
	};

	$scope.getNow = function() {
		// return (new Date()).toLocaleString();
		return new Date();
	};

}]);
