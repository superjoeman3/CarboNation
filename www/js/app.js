angular.module('starter', ['ionic', 'starter.services', 'ngCordova'])

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

.controller('statsTabCtrl', function($scope, $state, Data) { 
    $scope.trips = Data.getAll({id: "1"});
})

.controller('ActiveTabCtrl', function($scope, $state, Data, $cordovaGeolocation) { 
  $scope.totalMiles = 0;
  $scope.mpg = window.localStorage['mpg'];
  var counter = setInterval(gps, 1000);

  var watch = $cordovaGeolocation.watchPosition({ frequency: 1000 });
  watch.then(function() { /* Not  used */ }, 
    function(err) {
      // An error occurred.
    }, 
    function(position) {
      // Active updates of the position here
      // position.coords.[ latitude / longitude]
     // this is where you will add your code to track changes in co-ordinates
     $scope.lat = position.coords.latitude;
     alert(position.coords.latitude);
  });

  function gps(){
    $scope.totalMiles ++;
    $scope.carbon = (19.64/$scope.mpg) * $scope.totalMiles;
    $scope.$apply();
  }

  function dist(lat1, lon1, lat2, lon2) {
    // Distance haversine formula from http://www.movable-type.co.uk/scripts/latlong.html.
    var R = 6371000; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c; // meters
    d = d * 0.00062137; // miles
    return d;
  }
  
  $scope.stopClick = function(){
    clearInterval(counter);
    var data = {
      user: "1",
      //date: new Date(),
      miles: $scope.totalMiles,
      emissions: $scope.carbon
    };
    Data.create(data).success(function(data){
            $state.go('stats');
        });
    alert("trip ended");
  }
});