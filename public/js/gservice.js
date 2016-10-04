// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
  .factory('gservice', function($rootScope, $http){

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};
    googleMapService.clickLat  = 0;
    googleMapService.clickLong = 0;

    // Array of locations obtained from API calls
    var locations = [];

    // Variables we'll use to help us pan to the right spot
    var lastMarker;
    var currentSelectedMarker;

    // Selected Location (initialize to Sutro Tower - San Francisco)
    var selectedLat  = 37.755;
    var selectedLong = -122.453;

    // Set path for blue icon marker
    var icon = './map_icon_24.png'

    // Set map style
    var styles = [{ "featureType": "all",
                    "elementType": "labels.text",
                    "stylers"    : [{"visibility": "off"}]
                  },
                  { "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers"    : [{"visibility": "off"}]
                  },
                  { "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers"    : [{"color": "#000000"}]
                  },
                  { "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers"    : [{"color": "#144b53"},{"lightness": 14},{"weight": 1.4}]
                  },
                  { "featureType": "landscape",
                  "elementType": "all",
                  "stylers"    : [{"color": "#08304b"}]
                  },
                  { "featureType": "poi",
                    "elementType": "geometry",
                    "stylers"    : [{"color": "#0c4152"},{"lightness": 5}]
                  },
                  { "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers"    : [{"color": "#000000"}]
                  },
                  { "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers"    : [{"color": "#0b434f"},{"lightness": 25}]
                  },
                  { "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers"    : [{"color": "#000000"}]
                  },
                  { "featureType": "road.arterial",
                    "elementType": "geometry.stroke",
                    "stylers"    : [{"color": "#0b3d51"},{"lightness": 16}]
                  },
                  { "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers"    : [{"color": "#000000"}]
                  },
                  { "featureType": "transit",
                    "elementType": "all",
                    "stylers"    : [{"color": "#146474"}]
                  },
                  { "featureType": "water",
                    "elementType": "all",
                    "stylers"    : [{"color": "#021019"}]
                  }
    ]

    // Set map style
    var gradient = ['rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                    ]

    // Functions
    // --------------------------------------------------------------
    // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
    googleMapService.refresh = function(latitude, longitude, filteredResults){

      // Clears the holding array of locations
      locations = [];

      // Set the selected lat and long equal to the ones provided on the refresh() call
      selectedLat  = latitude;
      selectedLong = longitude;

      // If filtered results are provided in the refresh() call...
      if (filteredResults){

        // Then convert the filtered results into map points.
        locations = convertToMapPoints(filteredResults);

        // Then, initialize the map
        initialize(latitude, longitude);
      }

      // If no filter is provided in the refresh() call...
      else {
        var now       = new Date();
        var dayofweek = now.getDay();
        var hour      = now.getHours();

        // Perform an AJAX call to get all of the records in the db.
        $http.get('/crimepoints?dayofweek=' + dayofweek + '&hour=' + hour).success(function(response){

          // Then convert the results into map points
          locations = convertToMapPoints(response);

          // Then initialize the map
          initialize(latitude, longitude);
        }).error(function(){});
      }
    };

    // Private Inner Functions
    // --------------------------------------------------------------

    // Convert a JSON of users into map points
    var convertToMapPoints = function(response){

      // Clear the locations holder
      var locations = [];

      // Loop through all of the JSON entries provided in the response
      for(var i= 0; i < response.length; i++) {
        var crimepoint = response[i];

        // Create popup windows for each record
        var contentString = '<p><b>Drugs & Drinking:</b> ' + crimepoint.drugdrink +
                            '<br><b>Misdemeanors:</b>    ' + crimepoint.misdemean +
                            '<br><b>Theft:</b>           ' + crimepoint.theft +
                            '<br><b>Violent:</b>         ' + crimepoint.violent +
                            '<br><b>Total:</b>           ' + crimepoint.total + '</p>';

        // Converts each of the JSON records into Google Maps Location format (Note Lat, Lng format).
        locations.push(new Location(
          new google.maps.LatLng(crimepoint.location[1], crimepoint.location[0]),
          new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
          }),
          crimepoint.drugdrink,
          crimepoint.misdemean,
          crimepoint.theft,
          crimepoint.violent,
          crimepoint.total
          ))
        }
      // location is now an array populated with records in Google Maps format
      return locations;
    };

    // Constructor for generic location
    var Location = function(latlon, message, drugdrink, misdemean, theft, violent, total){
      this.latlon    = latlon;
      this.message   = message;
      this.drugdrink = drugdrink;
      this.misdemean = misdemean;
      this.theft     = theft;
      this.violent   = violent;
      this.total     = total
    };

    function getPoints() {
      // locations.forEach(function(n, i){
      //   var marker = new google.maps.Marker({
      //     position: n.latlon,
      //     map     : map,
      //     icon    : icon
      //   });

      //   // For each marker created, add a listener that checks for clicks
      //   google.maps.event.addListener(marker, 'click', function(e){

      //     // When clicked, open the selected marker's message
      //     currentSelectedMarker = n;
      //     n.message.open(map, marker);
      //   });
      // });

      return [
      {location: new google.maps.LatLng(37.775, -122.403), weight: 3.06849315068493},
      {location: new google.maps.LatLng(37.778, -122.406), weight: 1.91780821917808}
      ];
    }

    // Initializes the map
    var initialize = function(latitude, longitude) {

      // Uses the selected lat, long as starting point
      var myLatLng = {lat: selectedLat, lng: selectedLong};

      // If map has not been created...
      if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom  : 14,
          center: myLatLng,
          styles: styles
        });

        var heatmap = new google.maps.visualization.HeatmapLayer({
          data    : getPoints(),
          map     : map,
          gradient: gradient
        });
      }

      // Loop through each location in the array and place a marker
      locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
          position: n.latlon,
          map     : map,
          icon    : icon
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

          // When clicked, open the selected marker's message
          currentSelectedMarker = n;
          n.message.open(map, marker);
        });
      });

      // Set initial location as a bouncing red marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position : initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map      : map,
        icon     : icon
      });
      lastMarker = marker;

      // Function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      // Clicking on the Map moves the bouncing red marker
      google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
          position : e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map      : map,
          icon     : icon
        });

        // When a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
          lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
      });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
  });

