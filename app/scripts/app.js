'use strict';

angular.module('timetrackerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'recordServices'
])
   .config(['routeProvider', function ($routeProvider) {
    alert('ASFDSA');
    $routeProvider
      .when('/', {
        templateUrl: 'views/records.html',
        controller: 'RecordsListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);



 // angular.module('timetrackerApp', []);


