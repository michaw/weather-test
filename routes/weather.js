var express = require('express'),
    router = express.Router(),
    config = require('../config'),
    geocode = require('../services/geocode'),
    forecast = require('../services/forecast-io'),
    _ = require('lodash'),
    moment = require('moment-timezone');


router.get('/:location', function(req, res, next) {
    var location = req.params.location;
    geocode.lookup(location, function(err, coords){
        if (err){
            return res.sendStatus(500);
        }
        forecast.get(coords[0].latitude, coords[0].longitude, function(err, result) {
            if (err){
                return res.sendStatus(500);
            }
            var fc = result.daily.data,
                wantsJSON = req.xhr || (req.accepts(['json', 'html']) === 'json');
            if (wantsJSON) {
                res.json(fc);
            } else {
                _.each(fc, function(day){
                    forecast.makeReadable(day, result.timezone);
                });
                res.render('weather', {title: "Weather forecast for " + coords[0].formattedAddress, forecast: fc});
            }
        });
    })

});
router.get('/:location/:day', function(req, res, next) {
    var location = req.params.location,
        day = req.params.day;

    geocode.lookup(location, function(err, coords){
        if (err){
            return res.sendStatus(500);
        }

        forecast.getDay(coords[0].latitude, coords[0].longitude, day.toLowerCase(), function(err, fc) {
            if (err){
                res.status(500).send(err);
            } else {
                var wantsJSON = req.xhr || (req.accepts(['json', 'html']) === 'json');
                if (wantsJSON) {
                    res.json(fc);
                } else {
                    fc = forecast.makeReadable(fc, fc.timezone);
                    res.render('weather', {title: "Weather forecast for " + coords[0].formattedAddress, forecast: [fc]});
                }
            }

        })
    });
});



module.exports = router;