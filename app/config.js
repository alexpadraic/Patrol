// Sets the MongoDB Database options

module.exports = {

    mongolab:
    {
        name: "patrol-map-ec2",
        url: "mongodb://scotch:scotchrocks@ds051853.mongolab.com:51853/mean-map-app",
        port: 27017
    },

    local:
    {
        name: "patrol-map-local",
        url: "mongodb://localhost/Patrol",
        port: 27017
    },

    localtest:
    {
        name: "patrol-map-local",
        url: "mongodb://localhost/PatrolTest",
        port: 27017
    }

};
