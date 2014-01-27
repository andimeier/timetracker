'use strict';

var recordControllers = angular.module('recordControllers', []);
var counter = 1;

var formatJSONDate = function(input) {
	if (!input) {
		return null;
	}
	return input.replace(' ', 'T');
}

recordControllers.controller('RecordListCtrl', ['$scope', 'Record', 'Project', function($scope, Record, Project) {
	// initialize data member
	$scope.data = {};
	$scope.data.editNewRecord = 0;

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
		$scope.data.editMode = 2;
		// $scope.data.onerecord = rec;
		$scope.data.onerecord.date = $scope.extractDate(rec.starttime);
		$scope.test = counter++;
	};


	$scope.editNewRecord = function(rec) {
		// edit a copy so the old values are preserved - these will be needed
		// in case of a "cancel edit"
		$scope.data.editMode = 1; // 1 stands for "edit new record"
		$scope.data.onerecord={}
	};	

	$scope.cancelEditRecord = function(rec) {
		$scope.data.editMode = 0;
		$scope.data.onerecord = {};
	};

	$scope.extractDate = function(datetime) {
		//return 'Alex extracted (extractDate)';
		return '[' + datetime + ']';
		return 'Alex was here'.substring(0, 3);
	};

	// fill projects list, if not filled already
	if (!$scope.data.activeProjects) {
		$scope.data.activeProjects = Project.query();
	}


}]);
 
recordControllers.controller('RecordDetailCtrl', ['$scope', '$routeParams', 'Record', function($scope, $routeParams, Record) {
	//$scope.data.onerecord = Record.get({recordId: $routeParams.recordId}, function(record) {});

	$scope.processRecordForm = function() {
		var rec = $scope.data.onerecord;

		// convert date input to JSON format
		if (rec.starttime) {
			rec.starttime = formatJSONDate(rec.starttime);
		}
		if (rec.endtime) {
			rec.endtime = formatJSONDate(rec.endtime);
		}

		var reply = Record.save($scope.data.onerecord, function() {
			// save went ok
			rec = {}; // empty the form after saving

			rec.success = 'Saved successfully.';

			// refresh record list
			$scope.data.records = Record.query();

		}, function(response) {
			// failure when saving
			rec.error = 'Error at saving, response status: ' + response.status + ' ' + response.error;
		});
	};

	$scope.getNow = function() {
		return new Date();
	};

}]);
