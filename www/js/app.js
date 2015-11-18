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



.controller('HomeTabCtrl', function($scope, $rootScope, $state) { 
  $scope.settings = window.localStorage;
  $scope.start = function(settings){
    window.localStorage['mpg'] = settings.mpg == undefined ? '' : parseFloat(settings.mpg);
    $rootScope.totalMiles = 0;
    $rootScope.carbon = 0;
    $rootScope.tree = 0;
    $state.go('tabs.active');
  }
})

.controller('statsTabCtrl', function($scope, $state, $cordovaDevice, Data) { 
  $scope.device = $cordovaDevice.getUUID();
  Data.getAll('where={"user":"'+ $cordovaDevice.getUUID() +'"}').success(function(data){
    $scope.trips=data.results;
    $scope.totalMiles=0;
    $scope.totalMiles=false;
    for(var i=0; i < $scope.trips.length; i++) {
      $scope.totalMiles+=$scope.trips[i].miles;
      $scope.totalEmissions+=$scope.trips[i].emissions;
    }
  });
})

.controller('ActiveTabCtrl', function($scope, $rootScope, $state, Data, $cordovaDevice) { 
  $scope.mpg = window.localStorage['mpg'];
  $scope.init = false;
  var counter = setInterval(gps, 1000);

  function gps() {
    navigator.geolocation.getCurrentPosition(function(position) {
      if ($scope.lat != undefined) {
        $rootScope.totalMiles += dist($scope.lat, $scope.lon, position.coords.latitude, position.coords.longitude);
        $rootScope.carbon = (19.64/$scope.mpg) * $scope.totalMiles;
        $rootScope.tree=$scope.carbon/26;
        $scope.init = true;
        $scope.$apply();
      }
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
      user: $cordovaDevice.getUUID(),
      //date: new Date(),
      miles: $rootScope.totalMiles ? $rootScope.totalMiles : 0,
      emissions: $rootScope.carbon ? $rootScope.carbon : 0
    };
    Data.create(data).success(function(data){
      $state.go('tabs.stats');
    });
  }
});