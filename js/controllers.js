'use strict'

// Angular Controllers
//
var hcpControllers = angular.module('hcpControllers', []);

// Player search controller
hcpControllers.controller('PlayerSearchCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
  var url = 'https://f1truij4dk.execute-api.us-east-1.amazonaws.com/beta/player/all';
  $http.get(url).success(function(data) {
    $scope.players = data.resultSets[0].rowSet;
  });

  // Max amount of search results, determined by window height
  var top_padding = $(window).height() * .60;
  var cells_available = top_padding / 60;
  $scope.quantity = parseInt(cells_available, 10);

  // Adjust on resize
  $scope.noPics = false;
  var w = angular.element($window);
  $scope.$watch(
    function () {
      return $window.innerWidth;
    },
    function (value) {
      $scope.windowWidth = value;
      if(value >= 768 && value < 992) {
        $scope.noPics = true;
      } else {
        $scope.noPics = false;
      }

      if(value < 768) {
        $scope.quantity = 3;
      } else {
        $scope.quantity = parseInt(cells_available, 10);
      }
    },
    true
  );

  w.bind('resize', function(){
    $scope.$apply();
  });
}]);

// Player detail controller
hcpControllers.controller('PlayerDetailCtrl', ['$scope', '$http', '$window', '$routeParams',
  function($scope, $http, $window, $routeParams) {
    $scope.player_loading = true;
    $scope.game_loading = true;
    $scope.detail = $routeParams.playerId;
    var player_url = 'https://f1truij4dk.execute-api.us-east-1.amazonaws.com/beta/player/' + $routeParams.playerId;
    var game_url = 'https://f1truij4dk.execute-api.us-east-1.amazonaws.com/beta/player/' + $routeParams.playerId +'/gamelog';

    // Get player stats
    $http.get(player_url)
      .success(function(data) {
        $scope.player = data.resultSets[0].rowSet[0];
      })
      .finally(function() {
        $scope.player_loading = false;
      });

    // Get game stats
    $http.get(game_url)
      .success(function(data) {
        // Make sure game is not in progress
        if(data.resultSets[0].rowSet[0][5] == null) {
          $scope.last_game = data.resultSets[0].rowSet[1];
        } else {
          $scope.last_game = data.resultSets[0].rowSet[0];
        }
        // Set DFS scores
        $scope.dk = getDKScore($scope.last_game);
        $scope.fd = getFDScore($scope.last_game);

        var matchup = $scope.last_game[4];
        $scope.opp = matchup.split(" ")[2];

      })
      .finally(function() {
        $scope.game_loading = false;
      });

    // Swap on resize
    $scope.noTable = false;
    var w = angular.element($window);
    $scope.$watch(
      function () {
        return $window.innerWidth;
      },
      function (value) {
        if(value <= 950) {
          $scope.noTable = true;
        } else {
          $scope.noTable = false;
        }
      },
      true
    );

    w.bind('resize', function(){
      $scope.$apply();
    });
}]);