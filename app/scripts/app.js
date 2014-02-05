'use strict';

angular.module('timetrackerApp', [
  'ngResource',
  'ngRoute',
  'recordControllers',
  'timetrackerServices',
  'services.config'
])
  .config(function ($routeProvider, $httpProvider) {
  
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
      .when('/records', {
        templateUrl: 'views/records.html',
        controller: 'RecordListCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/records'
      });
  });
