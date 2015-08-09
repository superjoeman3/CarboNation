angular.module('starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })

     .state('tabs.stats', {
        url: "/stats",
        views: {
          'stats-tab': {
            templateUrl: "templates/stats.html",
            controller: 'statsTabCtrl'
        }
      }
    })

    .state('tabs.active', {
      url: "/active",
      views: {
        'active-tab': {
          templateUrl: "templates/active.html",
          controller: "ActiveTabCtrl"
        }
      }
    })


   $urlRouterProvider.otherwise("/tab/home");

})



.controller('HomeTabCtrl', function($scope, $state) { 
  $scope.settings = window.localStorage;
  $scope.start = function(settings){
    window.localStorage['mpg'] = parseFloat(settings.mpg);
    $state.go('tabs.active');
  }
})

.controller('statsTabCtrl', function($scope, $state) { 
  $scope.startClick = function(){
    $state.go('tabs.stats');
  }
})


.controller('ActiveTabCtrl', function($scope, $state) { 
  $scope.totalMiles = 0;
  $scope.mpg = window.localStorage['mpg'];
  setInterval(gps, 1000);

  function gps(){
    $scope.totalMiles ++;
    $scope.carbon = (19.64/$scope.mpg) * $scope.totalMiles;
    $scope.$apply();
  }
});