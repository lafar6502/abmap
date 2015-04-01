angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $http, $ionicModal) {
  var me = this;
  this.categories = [
	{"id":"c1", "name":"Restauracje"},
	{"id":"c2", "name": "Sport i rekreacja"},
	{"id":"c3", "name": "Rozrywka"}
  ];
  $scope.categories = this.categories;
  $scope.doLog = function(a) {
	console.log(a);
  };

  $http.get("http://www.4youcard.pl/srv_api.php").success(function(data, status, headers, config) {
		console.log(data);
		$scope.categories = me.categories = data;
		
	});
	$ionicModal.fromTemplateUrl('templates/category-select.html', {
		scope: $scope
	  }).then(function(modal) {
		$scope.modal = modal
	  });
	  
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };
  
  this.selectCategory = function() {
	$scope.modal.show();
  };
  
  $scope.categoryClicked = function(id) {
	$scope.modal.hide();
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
      $scope.loading.hide();
	  $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    }, function (error) {
      $scope.loading.hide();
	  alert('Unable to get location: ' + error.message);
    }, {timeout: 30000, enableHighAccuracy: false});
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
