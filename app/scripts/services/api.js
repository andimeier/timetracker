var timetrackerApi = angular.module('timetrackerApi', ['ngResource']);

timetrackerApi.service('Api', ['$resource', 'configuration', function($resource, configuration){
	this.records = $resource(configuration.serviceBaseUrl + 'records/:recordId', {recordId:'@recordId'});
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
