'use strict';

angular.module('timetrackerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'recordControllers',
  'testControllers',
  'timetrackerServices'
])
  .config(function ($routeProvider) {
  $routeProvider
    .when('/records', {
      templateUrl: 'views/records.html',
      controller: 'RecordListCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/test', {
      templateUrl: 'views/test.html',
      controller: 'TestCtrl'
    })
    .otherwise({
      redirectTo: '/records'
    });
  });
