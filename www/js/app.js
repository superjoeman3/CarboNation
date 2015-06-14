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
  $scope.startClick = function(){
    $state.go('tabs.active');
    //@todo: save mpg value
  }
})


.controller('ActiveTabCtrl', function($scope, $state) { 
  $scope.totalMiles = 0;
  $scope.mpg = 20;
  setInterval(gps, 1000);

  $scope.$watch('totalMiles', function(newValue, oldValue, scope) {
    scope.totalMiles = newValue;
    console.log('a');
  });
  function gps(){
    $scope.totalMiles ++;

    $scope.carbon = (19.64/$scope.mpg) * $scope.totalMiles;
  }
});