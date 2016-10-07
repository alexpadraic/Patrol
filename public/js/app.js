// Declares the initial angular module "patrol" - module grabs other controllers and services
var app = angular.module('patrol', ['addCtrl', 'queryCtrl', 'headerCtrl', 'geolocation', 'gservice', 'ngRoute'])

  // Configures Angular routing -- showing the relevant view and controller when needed
  .config(function($routeProvider){

    // Join Team Control Panel
    $routeProvider.when('/crimepoints', {
      controller : 'queryCtrl',
      templateUrl: 'partials/queryForm.html',

    // Find recent crimes
    }).when('/incidents', {
      controller : 'addCtrl',
      templateUrl: 'partials/addForm.html',

      // Otherwise forward to the crimepoint query panel
    }).otherwise({redirectTo:'/crimepoints'})
  });
