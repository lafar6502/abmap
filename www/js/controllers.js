angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $http, $ionicModal) {
	var me = this;
	this.categories = [];
	this.markers = [];

	$scope.categories = this.categories;
	$scope.doLog = function (a) {
		console.log(a);
	};
  
	$http.get("http://www.4youcard.pl/srv_api.php").success(function(data, status, headers, config) {
		$scope.categories = me.categories = data;	
	});

	$ionicModal.fromTemplateUrl('templates/category-select.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal
	});

	$scope.mapCreated = function(map) {
		$scope.map = map;
		$scope.centerOnMe();
	};
	
	
  
  var gInfow = null;
  
  var str = function(s) {
	if (s == undefined || s == null) return '';
	return s.toString();
  };
  
  var configureMarker = function(mark, map) {
	
	var site = new google.maps.LatLng(mark.lat, mark.lng);
	var marker = new google.maps.Marker({position: site, map: map,  title: mark.name});
	me.markers.push(marker);
	
	google.maps.event.addListener(marker, 'click', function() {
		var cnt = [
			"<b>" + mark.name + "</b> <br/>",
			"<small>" + str(mark.address1) + "</small><br/>",
			"<small>" + mark.zipcode + "&nbsp;" + mark.city + "</small><br/>",
			'<span style="color:red;font-size:large">' + mark.discount1 + "&nbsp;" + str(mark.discount2) + "&nbsp;" + str(mark.discount3) + '</span><br/>',
			'<a target="_system" href="' + mark.www + '">' + mark.www + '</a><br/>',
			'<small>' + str(mark.category) + '</small>'
		];
		if (gInfow != null) {
			gInfow.close();
			gInfow = null;
		};
		var w = new google.maps.InfoWindow({
			content: cnt.join("")
		});
		w.open(marker.get('map'), marker);
		gInfow = w;
		setTimeout(function() {w.close();}, 10000);
	});
	console.log('configured marker', mark);
  };
  
  
  this.loadLocations = function() {
	$http.get("http://www.marcysia.net/locations.php").success(function(data, status, headers, config) {
		console.log('locations', data);
		$scope.locations = data;
		for (var i=0; i<me.markers.length; i++) {
			me.markers[i].setMap(null);
		};
		me.markers = [];
		
		for (var i=0; i<data.length; i++) {
			configureMarker(data[i], $scope.map);
		};
	});
  }
  
    
	this.selectedCategory = {name: "Wybierz kategorię"};
	
	this.selectCategory = function() {
		$scope.modal.show();
	};
	
	
  
	$scope.categoryClicked = function(cat) {
		$scope.modal.hide();
		if (cat == null) {
			me.selectedCategory = {name: 'Wybierz kategorię'};
		}
		else { 
			me.selectedCategory = cat;
		};
		if (!$scope.map) {return;}
		var bnds = $scope.map.getBounds();
		console.log('bounds', bnds, 'cat:', me.categorySel);
	};
	
	this.positionStatus = "unknown";
	
	me.monitorLocation = function() {
		me.positionStatus = "watching";
		id = navigator.geolocation.watchPosition(function(pos) {
			console.log('pos', pos);
			me.positionStatus = "got pos";
		}, 
		function(err) {
			console.log('err pos', err);
			me.positionStatus = "error: " + err.code + ", " + err.message;
		}, 
		{  enableHighAccuracy: true,  timeout: 15000,  maximumAge: 10000});
	}

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
		}, {timeout: 30000, maximumAge: 30000, enableHighAccuracy: true});
	};
	//
	this.loadLocations();
});
