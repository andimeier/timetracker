var recordServices = angular.module('recordServices', ['ngResource']);

recordServices.factory('Record', ['$resource',
	function($resource){
		return $resource('http://localhost:3000/records/:recordId', {recordId:'@record_id'}, {});
	}
]);

recordServices.factory('Project', ['$resource',
	function($resource){
		return $resource('http://localhost:3000/projects/:projectId', {projectId:'@project_id'}, {});
	}
]);