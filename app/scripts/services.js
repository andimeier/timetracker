var timetrackerServices = angular.module('timetrackerServices', ['ngResource']);

// base URL of REST data service, be sure to end on slash
var serviceBaseURL = 'http://localhost:3000/';

timetrackerServices.factory('Record', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'records/:recordId', {recordId:'@record_id'}, {});
	}
]);

timetrackerServices.factory('Project', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'projects/:projectId', {projectId:'@project_id'}, {});
	}
]);

timetrackerServices.factory('Login', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'login', {user:'@username', pass:'@password'}, {});
	}
]);