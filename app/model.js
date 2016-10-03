// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var CrimepointSchema = new Schema({
  dayofweek : {type: Number,   required: true}, // Grouped by every day of week (YTD)
  hour      : {type: Number,   required: true}, // Grouped by every hour of day (YTD)
  location  : {type: [Number], required: true}, // [Long, Lat] in MongoDB
  drugdrink : {type: Number,   required: true}, // Percent of drinking, drugs, etc. incidents
  misdemean : {type: Number,   required: true}, // Percent of misc incidents
  theft     : {type: Number,   required: true}, // Percent of theft incidents
  violent   : {type: Number,   required: true}, // Percent of violent acts
  total     : {type: Number,   required: true}, // Percent of total incidents
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

// Set the created_at parameter equal to the current time
CrimepointSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if(!this.created_at) {
    this.created_at = now
  }
  next();
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
CrimepointSchema.index({location: '2dsphere'});

// Exports the CrimepointSchema for use elsewhere. Sets the MongoDB collection to be used as: "patrol"
module.exports = mongoose.model('patrol', CrimepointSchema);
