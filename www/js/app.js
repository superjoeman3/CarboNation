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

  /*window.watch = $cordovaGeolocation.watchPosition({ frequency: 1000 });
  window.watch.then(function() {}, 
    function(err) {
      // An error occurred.
    }, 
    function(position) {

      if ($scope.lat != undefined) {
        $scope.totalMiles += dist($scope.lat, $scope.lon, position.coords.latitude, position.coords.longitude);
        $scope.carbon = (19.64/$scope.mpg) * $scope.totalMiles;
        $scope.$apply();
      }
      $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;
      alert(position.coords.latitude);
  });*/

  var counter = setInterval(gps, 3000);


  function gps() {
    navigator.geolocation.getCurrentPosition(function(position) {
      if ($scope.lat != undefined) {
        $scope.totalMiles += dist($scope.lat, $scope.lon, position.coords.latitude, position.coords.longitude);
        $scope.carbon = (19.64/$scope.mpg) * $scope.totalMiles;
        $scope.$apply();
      }
      alert($scope.lat);
      $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;
    });
  }


  function dist(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    d = d * 0.62137; // miles
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
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