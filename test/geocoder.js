'use strict';

var chai = require('chai');
var should = chai.should();

describe('geocoder', function () {
    var geocoder = require('../server/geocoder');

    it('should be imported successfully', function () {
        should.exist(geocoder);
        geocoder.should.be.an('object');
    });

    it('should have a send method', function () {
        should.exist(geocoder.send);
        geocoder.send.should.be.a('function');
    });

    it('should be able to make requests', function (done) {
        geocoder.send(' ', function (res, err) {
            should.not.exist(err);
            should.exist(res);
            res.should.be.an('object');
            done();
        });
    });

    it('should get the coordinates of Auburn University', function (done) {
        geocoder.send('Auburn University', function (res, err) {
            var expectedLatitude = 32.5940794;
            var expectedLongitude = -85.5004189;
            var expectedAddress = 'Auburn University, 107 samford hall, Auburn, AL 36849, USA';

            should.not.exist(err);
            should.exist(res);

            var result = res.results[0];

            result.should.be.an('object');
            result.should.have.property('geometry');
            result.should.have.property('formatted_address');
            
            result.geometry.should.be.an('object');
            result.geometry.location.lat.should.equal(expectedLatitude);
            result.geometry.location.lng.should.equal(expectedLongitude);

            result.formatted_address.should.be.a('string');
            result.formatted_address.should.equal(expectedAddress);

            done();
        });
    });
});
