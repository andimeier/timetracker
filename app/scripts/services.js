var recordServices = angular.module('recordsServices', ['ngResource']);

recordServices.factory('Record', ['$resource',
	function($resource){
		return $resource('records/:recordId', {}, {
			query: {method:'GET', params:{recordId:'records'}, isArray:true}
		});
	}
]);