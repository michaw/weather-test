var forecaster = require('../services/forecast-io'),
    chai = require('chai');
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should(),
    moment = require('moment-timezone'),
    coords = { // Perth
        latitude: -31.9535132,
        longitude: 115.8570471
    };

describe("Forecast wrapper", function() {
    this.timeout(3000);
    describe("get function", function() {
        it("takes a set of co-ords and returns a 7 day forecast (plus today)", function(done){
            forecaster.get(coords.latitude, coords.longitude, function(err, result){
                result.should.be.an('object');
                result.currently.should.be.an('object');
                result.daily.should.be.an('object');
                result.daily.data.should.be.an('array');
                result.daily.data.length.should.equal(8);
                result.daily.data[0].should.exist;
                result.daily.data[0].should.be.an('object');
                result.daily.data[0].time.should.exist;
                result.daily.data[0].time.should.be.a('number');
                result.daily.data[0].summary.should.exist;
                result.daily.data[0].summary.should.be.a('string');
                done();
            });
        });
    });

    describe("getDay function", function() {
        it("takes a set of co-ords, a day name, and returns a forecast for that day", function(done){
            forecaster.getDay(coords.latitude, coords.longitude, 'Wednesday', function(err, result){
                result.should.be.an('object');
                result.time.should.exist;
                result.time.should.be.a('number');
                result.summary.should.exist;
                result.summary.should.be.a('string');
                done();
            });
        });
    });

    describe("getDay function with day='today'", function() {
        it("takes a set of co-ords, and returns today's forecast", function(done){
            forecaster.getDay(coords.latitude, coords.longitude, 'today', function(err, result){
                result.should.be.an('object');
                result.time.should.exist;
                result.time.should.be.a('number');
                result.summary.should.exist;
                result.summary.should.be.a('string');
                done();
            });
        });
    });

    describe("getNiceBearing function", function() {
       it("translates a bearing into compass points", function() {
           assert(forecaster.getNiceBearing(0) === 'North', "Correctly finds North at 0");
           assert(forecaster.getNiceBearing(180) === 'South', "Correctly finds South at 180");
           assert(forecaster.getNiceBearing(90) === 'East', "Correctly finds East at 90");
           assert(forecaster.getNiceBearing(270) === 'West', "Correctly finds West at 270");
           assert(forecaster.getNiceBearing(45) === 'North-East', "Correctly finds North-East at 45");
           assert(forecaster.getNiceBearing(135) === 'South-East', "Correctly finds South-East at 135");
           assert(forecaster.getNiceBearing(225) === 'South-West', "Correctly finds South-West at 225");
           assert(forecaster.getNiceBearing(315) === 'North-West', "Correctly finds North-West at 315");
           assert(forecaster.getNiceBearing(359) === 'North', "Correctly finds North at 359");
           assert(forecaster.getNiceBearing(338) === 'North', "Correctly finds North at 338");
           assert(forecaster.getNiceBearing(337) === 'North-West', "Correctly finds North-West at 337");
       }) ;
    });

    describe("getNiceMoonPhase function", function() {
        it("translates a floating-point into a human-readable moon-phase", function() {
            assert(forecaster.getNiceMoonPhase(0) === 'New', "Correctly finds New at 0");
            assert(forecaster.getNiceMoonPhase(0.25) === 'First quarter', forecaster.getNiceMoonPhase(0.25)+": Correctly finds First quarter at 0.25");
            assert(forecaster.getNiceMoonPhase(0.5) === 'Full', "Correctly finds Full at 0.5");
            assert(forecaster.getNiceMoonPhase(0.75) === 'Third quarter', "Correctly finds Third quarter at 0.75");
            assert(forecaster.getNiceMoonPhase(0.125) === 'Waxing crescent', "Correctly finds Waxing crescent at 0.125");
            assert(forecaster.getNiceMoonPhase(0.375) === 'Waxing gibbous', "Correctly finds Waxing gibbous at 0.375");
            assert(forecaster.getNiceMoonPhase(0.625) === 'Waning gibbous', "Correctly finds Waning gibbous at 0.625");
            assert(forecaster.getNiceMoonPhase(0.875) === 'Waning crescent', "Correctly finds Waning crescent at 0.875");
            assert(forecaster.getNiceMoonPhase(0.99) === 'New', "Correctly finds New at 0.99");
            assert(forecaster.getNiceMoonPhase(0.94) === 'New', "Correctly finds New at 0.94");
            assert(forecaster.getNiceMoonPhase(0.93) === 'Waning crescent', "Correctly finds Waning crescent at 0.93");
        }) ;
    });
});