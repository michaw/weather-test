var config = require('../config');
var geocoder = require('node-geocoder')(config.geocoderProvider, config.geoProviderHttpAdapter, config.geocoderProviderConfig);

module.exports = {
    lookup: function(location, callback) {
        if (config.geocoderProvider === 'google'){
            location = {address: location, country: config.country};
        } else {
            location = location + ", " + config.country;
        }

        geocoder.geocode(location, function (err, coords) {
            return callback(err,coords);
        });
    }
};