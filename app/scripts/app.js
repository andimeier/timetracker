'use strict';

angular.module('timetrackerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'recordControllers',
  'recordServices'
])
   .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/records.html',
        controller: 'RecordListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



 // angular.module('timetrackerApp', []);


