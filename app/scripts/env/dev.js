// define global env settings for dev environment
angular.module('timetrackerApp')
	.constant('env', {
		// base URL of REST data service, be sure to end on slash
		serviceBaseUrl: 'http://127.0.0.1:3000/'
	});
