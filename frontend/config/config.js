'use strict';

angular.module('services.config', [])
  .constant('configuration', {
	// base URL of REST data service, be sure to end on slash
	serviceBaseUrl: '@@serviceBaseUrl'
  });
