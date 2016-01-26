'use strict';

angular.module('itosApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'base64',
  'pdf'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/?content=about'
      });

    $locationProvider.html5Mode(true);
  });
