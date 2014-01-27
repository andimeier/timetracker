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
	$scope.data.editMode = 0;

	$scope.data.records = Record.query();
	$scope.data.records.forEach(function(rec) {
		rec.startdate = 'Alex' + 'asdf';
	});
	$scope.orderProp = 'starttime';

	$scope.data.onerecord = {};

	/**
	 * remove a record from the list and delete it from the database
	 */
	$scope.remove = function(rec) {
		var recordId = rec.record_id;
		console.log('Going to deleted record: [' + rec.record_id + ']');

		$scope.data.editMode = 0;

		// mark record as moribund
		rec.toBeDeleted = 1;

		// try to delete it in DB first
		Record.remove({ recordId: rec.record_id }, function(response) {
			
			// delete went ok
			$scope.data.success = 'Successfully deleted record [' + recordId + '].';

			// now remove element from screen also
			$scope.data.records.splice($scope.data.records.indexOf(rec), 1);

			// refresh record list
			$scope.data.records = Record.query();

		}, function(response) {
			// delete did not succeed
			console.log('  in save-ERROR handler.');

			// revert the record's status on screen
			rec.toBeDeleted = 0;

			$scope.data.error = 'Error at deleting, response status: ' + response.status + ' ' + response.error;
		});
	}

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
		$scope.data.onerecord = {}
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

		Record.save($scope.data.onerecord, function(response) {
			// save went ok
			$scope.data.onerecord = {}; // empty the form after saving

			$scope.data.success = 'Saved successfully with record_id=[' + response.insertId + '].';

			// refresh record list
			$scope.data.records = Record.query();
			$scope.data.editMode = 0;

		}, function(response) {
			console.log('  in save-ERROR handler.');
			// failure when saving
			rec.error = 'Error at saving, response status: ' + response.status + ' ' + response.error;
		});
	};

	$scope.getNow = function() {
		return new Date();
	};

}]);
