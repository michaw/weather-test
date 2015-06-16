var geocode = require('../services/geocode'),
    chai = require('chai');
    georesult = '';
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();


describe("Geocoder wrapper", function() {
    describe("lookup function", function(){
        before(function(done) {
            geocode.lookup('Perth', function(err, result){
                georesult = result;
                done();
            });
        });
        it("returns an array", function() {
            georesult.should.be.an('array');
        });
        it("which contains objects", function() {
            georesult[0].should.exist;
            georesult[0].should.be.an('object');

        });
        it("which have a number representing latitude", function() {
            georesult[0].latitude.should.exist;
            georesult[0].latitude.should.be.a('number');

        });
        it("and longitude", function() {
            georesult[0].longitude.should.exist;
            georesult[0].longitude.should.be.a('number');
        });
    });
});