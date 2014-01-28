'use strict';

angular.module('timetrackerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'recordControllers',
  'testControllers',
  'recordServices'
])
  .config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/records.html',
      controller: 'RecordListCtrl'
    })
    .when('/test', {
      templateUrl: 'views/test.html',
      controller: 'TestCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  });
