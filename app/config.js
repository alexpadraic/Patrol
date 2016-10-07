// Sets the MongoDB Database options, Google Maps API key, and Socrata API token and secret key

module.exports = {
    local:
    {
        name: "patrol",
        url : "mongodb://localhost/patrol",
        port: 27017
    },

    localtest:
    {
        name: "patrol",
        url: "mongodb://localhost/patrol",
        port: 27017
    }
};