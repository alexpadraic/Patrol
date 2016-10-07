// Dependencies
var mongoose   = require('mongoose');
var Crimepoint = require('./model.js');

// Opens App Routes
module.exports = function(app) {

  // GET Routes
  // --------------------------------------------------------
  // Retrieve records for all users in the db
  app.get('/crimepoints', function(req, res){

    console.log(req.query);

    var dayOfWeekLookup = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]

    var dayofweek = dayOfWeekLookup[req.query.dayofweek];
    var hour      = req.query.hour;

    var query = Crimepoint.find({}, {
      "latitude" : 1,
      "longitude": 1,
      "drugdrink": 1,
      "misdemean": 1,
      "theft"    : 1,
      "violent"  : 1,
      "total"    : 1
    });

    if(dayofweek){
      query = query.where('dayofweek').equals(dayofweek);
    }

    if(hour){
      query = query.where('hour').equals(hour);
    }

    query.exec(function(err, crimepoints){
      if(err) {
        res.send(err);
      } else {
        // If no errors are found, it responds with a JSON of all crimepoints
        // console.log(crimepoints[0])
        res.json(crimepoints);
      }
    });
  });
};
