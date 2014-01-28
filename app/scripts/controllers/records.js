'use strict';

var recordControllers = angular.module('recordControllers', []);

var formatJSONDate = function(input) {
	if (!input) {
		return null;
	}
	return input.replace(' ', 'T');
}

/**
 * Searches a list of objects for a specific one which has an attribute set to
 * a specific value (will be a kind of ID in most cases) and returns the found
 * object.
 *
 * @param list list of objects to be searched in
 * @param attribute the name of the attribute to be looked at
 * @param value the value of the attribute which is being looked for
 * @return the found object in the list, null if the object could not be found
 */
var containsObject = function(list, attribute, value) {
	var x;

	// if not even the object to be searched for has the specified attribute: leave
	if (!obj[attribute]) {
		return null;
	}
	for (x in list) {
		if (x[attribute] && x[attribute] == value) {
			return x;
		}
	}
	// object was not found, apparently
	return null;
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

		// console.log('Copied rec -> r');
		// console.log('r.project_id is [' + r.project_id + '], of type [' + typeof(r.project_id) + ']');
		// console.log('rec.project_id is [' + rec.project_id + '], of type [' + typeof(rec.project_id) + ']');
		// console.log('activeprojects[1].project_id is [' + $scope.data.activeProjects[1].project_id + '] and of type ' + typeof($scope.data.activeProjects[1].project_id));

		$scope.data.onerecord = r;
		$scope.data.editMode = 2;
		$scope.data.onerecord.date = $scope.extractDate(rec.starttime);

		// fill projects list. This is done with each start of editing on purpose,
		// because during the last edit the list could contain a non-active project
		// (because when you edit an existing project, the assigned project is added
		// to the project list, if not there - by this mechanism, a non-active project
		// could have been leaked into the list activeProjects. Thus, now reload the
		// list)
		$scope.data.activeProjects = Project.query({ add:r.project_id });

		/* if project of the selected record is not in the dropdown list of projects yet
		 * (because it is not active) active, add it now temporarily (as long as this record
		 * is being edited)
		 */
		// if (!containsObject($scope.data.activeProjects, 'project_id', r.project_id)) {
		// 	// add current project
		// 	$scope.data.activeProjects.push(Project.get(r.project_id));
		// }
	};


	$scope.editNewRecord = function(rec) {
		// edit a copy so the old values are preserved - these will be needed
		// in case of a "cancel edit"
		$scope.data.editMode = 1; // 1 stands for "edit new record"
		$scope.data.onerecord = {}

		// fill projects list. This is done with each start of editing on purpose,
		// because during the last edit the list could contain a non-active project
		// (because when you edit an existing project, the assigned project is added
		// to the project list, if not there - by this mechanism, a non-active project
		// could have been leaked into the list activeProjects. Thus, now reload the
		// list)
		$scope.data.activeProjects = Project.query();
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

			if (response.insertId) {
				$scope.data.success = 'Updated successfully.';
			} else {
				$scope.data.success = 'Saved successfully with record_id=[' + response.insertId + '].';
			}

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
