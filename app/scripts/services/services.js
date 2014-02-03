var timetrackerServices = angular.module('timetrackerServices', ['ngResource']);

timetrackerServices.factory('Record', ['$resource', 'configuration',
	function($resource, configuration){
		return $resource(configuration.serviceBaseUrl + 'records/:recordId', {recordId:'@recordId'}, {});
	}
]);

timetrackerServices.factory('Project', ['$resource', 'configuration',
	function($resource, configuration){
		return $resource(configuration.serviceBaseUrl + 'projects/:projectId', {projectId:'@projectId'}, {});
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

timetrackerServices.factory('Login', ['$resource', 'configuration',
	function($resource, configuration){
		return $resource(configuration.serviceBaseUrl + 'login', {user:'@username', pass:'@password'}, {
			'login':  { method: 'POST' },
			'logout': { method: 'GET', url: configuration.serviceBaseUrl + 'logout' }
		});
	}
]);
