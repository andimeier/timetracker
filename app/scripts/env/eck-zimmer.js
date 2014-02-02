// define global env settings for prod environment on host eck-zimmer.at
angular.module('timetrackerApp')
	.constant('env', {
		// base URL of REST data service, be sure to end on slash
		serviceBaseUrl: 'https://apps.eck-zimmer.at/timetracker/api'
	});
