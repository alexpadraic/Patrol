// Sets the MongoDB Database options, Google Maps API key, and Socrata API token and secret key

module.exports = {

    mongolab:
    {
        name: "patrol-map-ec2",
        url: "mongodb://scotch:scotchrocks@ds051853.mongolab.com:51853/mean-map-app",
        port: 27017
    },

    local:
    {
        name: "patrol",
        url: "mongodb://localhost/patrol",
        port: 27017
    },

    localtest:
    {
        name: "patrol",
        url: "mongodb://localhost/patrol",
        port: 27017
    }

};