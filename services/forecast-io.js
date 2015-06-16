var config = require('../config'),
    Forecast = require('forecast.io'),
    forecast = new Forecast({APIKey: config.forecastAPIKey, timeout: 2500}),
    _ = require('lodash'),
    moment = require('moment-timezone');


module.exports = {
    /**
     * Wrapper function for forecast-io function.
     * @param latitude
     * @param longitude
     * @param callback
     */
    get: function(latitude, longitude, callback) {
        forecast.get(latitude, longitude, {units: 'si'}, function(err, res, data){
            if (err){
                return callback(err);
            }
            return callback(null,data);
        });
    },

    getDay: function(latitude, longitude, day, callback) {
        this.get(latitude, longitude, function(err, result) {
            if (err){
                callback(err);
            }
            // Parse for and transform 'today' into day of the week.
            day = (day.toLowerCase() === 'today') ? moment().tz(result.timezone).format('dddd') : day;
            var fc = _.find(result.daily.data, function(sourceday){
                return (moment.tz(sourceday.time*1000, result.timezone).format('dddd').toLowerCase() === day.toLowerCase());
            });
            if (typeof fc === 'undefined'){
                return callback(new Error('Day "'+day+'" not found'));
            }
            fc.timezone = result.timezone // Push the timeZone from the result, since we will need it for date formatting
            return callback(null, fc);
        });
    },

    makeReadable: function(day, timezone) {
        day.niceDate = moment.tz(day.time*1000, timezone).format('dddd, Do MMMM YYYY');
        day.niceSunrise = moment.tz(day.sunriseTime*1000, timezone).format('HH:mm');
        day.niceSunset = moment.tz(day.sunsetTime*1000, timezone).format('HH:mm');
        day.niceTempMaxTime = moment.tz(day.temperatureMaxTime*1000, timezone).format('HH:mm');
        day.niceTempMinTime = moment.tz(day.temperatureMinTime*1000, timezone).format('HH:mm');
        day.niceWindBearing = this.getNiceBearing(day.windBearing);
        day.niceMoonPhase = this.getNiceMoonPhase(day.moonPhase);
        return day;
    },

    getNiceBearing: function(bearing) {
        var bearingArray=['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'],
            stepSize = 360/bearingArray.length,
            ordinality = Math.round(bearing/stepSize) % bearingArray.length;
        return bearingArray[ordinality];
    },

    getNiceMoonPhase: function(moonPhase) {
        var phaseArray=['New', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full', 'Waning gibbous', 'Third quarter', 'Waning crescent'],
            ordinality = Math.round(moonPhase*phaseArray.length) % phaseArray.length;
        return phaseArray[ordinality];
    }
};