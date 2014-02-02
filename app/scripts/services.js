var timetrackerServices = angular.module('timetrackerServices', ['ngResource', 'env']);

timetrackerServices.factory('Record', ['$resource', 'env',
	function($resource, env){
		return $resource(env.serviceBaseUrl + 'records/:recordId', {recordId:'@recordId'}, {});
	}
]);

timetrackerServices.factory('Project', ['$resource', 'env',
	function($resource, env){
		return $resource(env.serviceBaseUrl + 'projects/:projectId', {projectId:'@projectId'}, {});
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

timetrackerServices.factory('Login', ['$resource', 'env',
	function($resource, env){
		return $resource(env.serviceBaseUrl + 'login', {user:'@username', pass:'@password'}, {
			'login':  { method: 'POST' },
			'logout': { method: 'GET', url: serviceBaseURL + 'logout' }
		});
	}
]);
