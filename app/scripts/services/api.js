var timetrackerApi = angular.module('timetrackerApi', ['ngResource', 'restangular']);

timetrackerApi.service('Api', ['$resource', 'Restangular', 'configuration', function($resource, Restangular, configuration){

	Restangular.setBaseUrl('http://127.0.0.1:3000');
	this.records = Restangular.all('records');
	this.projects = $resource(configuration.serviceBaseUrl + 'projects/:projectId', {projectId:'@projectId'});
	this.login = $resource(
		configuration.serviceBaseUrl + 'login', 
		{user:'@username', pass:'@password'}, 
		{
			'login':  { method: 'POST' },
			'logout': { method: 'GET', url: configuration.serviceBaseUrl + 'logout' }
		}
	);
}]);
