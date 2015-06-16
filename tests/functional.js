var app = require('../app'),
    http = require('http'),
    chai = require('chai'),
    request = require('request');
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

before(function() {
    this.server = http.createServer(app).listen(3000);
});


describe("Index page", function() {
    var response = '';
    before(function(done){
        request.get('http://localhost:3000/', function(err, res) {
            response = res;
            done();
        });
    });
    it("should return a status of 200", function() {
        response.statusCode.should.equal(200);
    })
});

describe("Weather page", function() {
    var response = '';
    describe('/weather/:location', function() {
        before(function(done){
            this.timeout(5000);
            request.get('http://localhost:3000/weather/sydney', function(err, res) {
                response = res;
                done();
            });
        });
        it("should return a status of 200", function() {
            response.statusCode.should.equal(200);
        });
        it("should return content of type 'application/json'", function() {
            assert(response.headers['content-type'].indexOf('application/json') !== -1, "content-type is "+response.headers['content-type']);
        });
        it("body should contain an array", function() {
            JSON.parse(response.body).should.be.an('array');
        });
        it("with length=8", function(){
            JSON.parse(response.body).length.should.equal(8);
        });

    });

    describe('weather/:location requesting html', function() {
        before(function(done){
            this.timeout(5000);
            request.get('http://localhost:3000/weather/sydney', {headers:{ 'Accept': 'text/html' }}, function(err, res, body) {
                response = res;
                done();
            });
        });
        it("should return a status of 200", function() {
            response.statusCode.should.equal(200);
        });
        it("should return content of type 'text/html'", function() {
            assert(response.headers['content-type'].indexOf('text/html') !== -1, "content-type is "+response.headers['content-type']);
        });
    });

    describe('/weather/:location/today', function() {
        before(function(done){
            this.timeout(5000);
            request.get('http://localhost:3000/weather/sydney/today', function(err, res) {
                response = res;
                done();
            });
        });
        it("should return a status of 200", function() {
            response.statusCode.should.equal(200);
        });
        it("should return content of type 'application/json'", function() {
            assert(response.headers['content-type'].indexOf('application/json') !== -1, "content-type is "+response.headers['content-type']);
        });
        it("body should contain an object", function() {
            JSON.parse(response.body).should.be.an('object');
        });
    });

    describe('weather/:location/today requesting html', function() {
        before(function(done){
            this.timeout(5000);
            request.get('http://localhost:3000/weather/sydney/today', {headers:{ 'Accept': 'text/html' }}, function(err, res, body) {
                response = res;
                done();
            });
        });
        it("should return a status of 200", function() {
            response.statusCode.should.equal(200);
        });
        it("should return content of type 'text/html'", function() {
            assert(response.headers['content-type'].indexOf('text/html') !== -1, "content-type is "+response.headers['content-type']);
        });
    });

    describe('/weather/:location/:weekday', function() {
        before(function(done){
            this.timeout(5000);
            request.get('http://localhost:3000/weather/sydney/saturday', function(err, res) {
                response = res;
                done();
            });
        });
        it("should return a status of 200", function() {
            response.statusCode.should.equal(200);
        });
        it("should return content of type 'application/json'", function() {
            assert(response.headers['content-type'].indexOf('application/json') !== -1, "content-type is "+response.headers['content-type']);
        });
        it("body should contain an object", function() {
            JSON.parse(response.body).should.be.an('object');
        });
    });

    describe('weather/:location/:weekday requesting html', function() {
        before(function(done){
            this.timeout(5000);
            request.get('http://localhost:3000/weather/sydney/saturday', {headers:{ 'Accept': 'text/html' }}, function(err, res, body) {
                response = res;
                done();
            });
        });
        it("should return a status of 200", function() {
            response.statusCode.should.equal(200);
        });
        it("should return content of type 'text/html'", function() {
            assert(response.headers['content-type'].indexOf('text/html') !== -1, "content-type is "+response.headers['content-type']);
        });
    });
});

after(function(done) {
    this.server.close(done);
});