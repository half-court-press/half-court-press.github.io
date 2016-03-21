'use strict';

// App routing
var hcpApp = angular.module('hcpApp', [
  'ngRoute',
  'hcpControllers'
]);

hcpApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/player/:playerId', {
        templateUrl: 'partials/player_detail.html',
        controller: 'PlayerDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);