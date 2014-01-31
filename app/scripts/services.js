var timetrackerServices = angular.module('timetrackerServices', ['ngResource']);

// base URL of REST data service, be sure to end on slash
var serviceBaseURL = 'http://127.0.0.1:3000/';

timetrackerServices.factory('Record', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'records/:recordId', {recordId:'@recordId'}, {});
	}
]);

timetrackerServices.factory('Project', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'projects/:projectId', {projectId:'@projectId'}, {});
	}
]);

/*timetrackerServices.factory('Login', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'login', {user:'@username', pass:'@password'}, {
			'get': undefined,
			//'save': undefined,
			'query': undefined,
			'remove': undefined,
			'delete': undefined,
			'login': {method:'POST'},
			'logout': {method:'GET'}
		});
	}
]);
*/

timetrackerServices.factory('Login', ['$resource',
	function($resource){
		return $resource(serviceBaseURL + 'login', {user:'@username', pass:'@password'}, {
			'login':  { method: 'POST' },
			'logout': { method: 'GET', url: serviceBaseURL + 'logout' }
		});
	}
]);
