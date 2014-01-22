var recordServices = angular.module('recordServices', ['ngResource']);

recordServices.factory('Record', ['$resource',
	function($resource){
		return $resource('http://localhost:3000/records/:recordId', {recordId:'@hour_id'}, {});
	}
]);