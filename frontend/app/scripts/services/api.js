var timetrackerApi = angular.module('timetrackerApi', ['ngResource', 'restangular', 'services.config']);

timetrackerApi.config(['RestangularProvider', 'configuration', function(RestangularProvider, configuration) {
	RestangularProvider.setBaseUrl(configuration.serviceBaseUrl);
}]);

timetrackerApi.service('Api', ['$resource', 'Restangular', 'configuration', function($resource, Restangular, configuration){

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
