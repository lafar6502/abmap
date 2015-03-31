angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $http) {
  var me = this;
  this.categories = [
	{"id":"c1", "name":"Restauracje"},
	{"id":"c2", "name": "Sport i rekreacja"},
	{"id":"c3", "name": "Rozrywka"}
  ];

  $http.get("http://www.marcysia.net/categories.json").success(function(data, status, headers, config) {
		me.categories = data;
		console.log(data);
	});
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };
  
  this.categoryChanged = function() {
	if (!$scope.map) {return;}
	var bnds = $scope.map.getBounds();
	console.log('bounds', bnds, 'cat:', me.categorySel);
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      $ionicLoading.hide();
	  alert('Unable to get location: ' + error.message);
	  
    });
  };
  this.centerV2 = function() {
	console.log("Centering");
    if (!$scope.map) {
      return;
    };
		$scope.loading = $ionicLoading.show({
		  content: 'Getting current location...',
		  showBackdrop: false
		});
		var posOptions = {timeout: 30000, enableHighAccuracy: false};
		$cordovaGeolocation.getCurrentPosition(posOptions)
			.then(function (position) {
			  var lat  = position.coords.latitude;
			  var long = position.coords.longitude;
			  $scope.map.setCenter(new google.maps.LatLng(lat, long));
			  $scope.loading.hide();
			}, function(err) {
			  $scope.loading.hide();
			  alert('Unable to get location: ' + err.message);
			});

  };
});
