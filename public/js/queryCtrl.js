// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

  // Initialize variables
  // ----------------------------------------------------------------------------
  $scope.formData = {}; // Sets up hash to store query form data
  var queryBody   = {}; // Compiled and formatted data for query

  // Functions
  // ----------------------------------------------------------------------------

  // Get User's coordinates based on HTML5 at window load
  geolocation.getLocation().then(function(data){
    coords = {lat:data.coords.latitude, long:data.coords.longitude};

    // Set the latitude and longitude equal to the HTML5 coordinates
    $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
  });

  // Update coordinates on the form when a click is detected
  $rootScope.$on("clicked", function(){

    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function(){
      $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
      $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
    });
  });

  // Take query parameters and incorporate into a JSON queryBody
  $scope.queryCrimes = function(){

    // Assemble the query body from the submitted form data
    queryBody = {
      longitude: parseFloat($scope.formData.longitude),
      latitude: parseFloat($scope.formData.latitude),
      distance: parseFloat($scope.formData.distance),
      male: $scope.formData.male,
      female: $scope.formData.female,
      other: $scope.formData.other,
      minAge: $scope.formData.minage,
      maxAge: $scope.formData.maxage,
      favlang: $scope.formData.favlang,
      reqVerified: $scope.formData.verified

      // incidntnum
      // category
      // descript
      // dayofweek
      // date
      // time
      // pddistrict
      // resolution
      // address
      // x
      // y
      // location
    };

    // Post the queryBody to the SF Open Data POST route to retrieve the filtered results
    $http.post('https://data.sfgov.org/resource/cuks-n6tp.json', queryBody)

    // Store the filtered results in queryResults
    .success(function(queryResults){

      // Pass the filtered results to the Google Map Service and refresh the map
      gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

      // Count the number of records retrieved for the panel-footer
      $scope.queryCount = queryResults.length;
    })
    .error(function(queryResults){
      console.log('Error ' + queryResults);
    })
  };
});

