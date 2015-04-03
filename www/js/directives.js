angular.module('starter.directives', [])

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        /*var mapOptions = {
          center: new google.maps.LatLng(21.07493, 52.381388),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
		  panControl: false,
		  zoomControl: true,
		  mapTypeControl: false,
		  scaleControl: true,
		  streetViewControl: false,
		  overviewMapControl: false
        };*/
		const GOOGLE = new plugin.google.maps.LatLng(37.422476,-122.08425);
		var mapOptions = {
		  'backgroundColor': 'red',
		  'mapType': plugin.google.maps.MapTypeId.ROADMAP,
		  'controls': {
			'compass': true,
			'myLocationButton': true,
			'indoorPicker': true,
			'zoom': true
		  },
		  'gestures': {
			'scroll': true,
			'tilt': true,
			'rotate': true,
			'zoom': true
		  },
		  'camera': {
			'latLng': GOOGLE,
			'tilt': 30,
			'zoom': 15,
			'bearing': 50
		  }
		};
		
		//alert('plu? ' + plugin + ', w.plu? ' + window.plugin);
		try {
			var map = plugin.google.maps.Map.getMap($element[0], mapOptions);
			map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
				$scope.onCreate({map: map});
			});
		}
		catch(e) {
			alert('error: ' + e.toString());
		};
		
        /*var map = new google.maps.Map($element[0], mapOptions);
  
        

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });*/
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
});
