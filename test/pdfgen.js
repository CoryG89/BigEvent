'use strict';

var fs = require('fs');
var util = require('util');
var chai = require('chai');
var pdfgen = require('../server/pdfgen');

var should = chai.should();

var html = [
    '<!DOCTYPE html><html><head><title>My Webpage</title></head><body>',
    '<h2>Some Awesome HTML</h2><ul><p>I mean really awesome</p></body></html>'
].join('');

describe('pdfgen', function () {

    it('should be initialized successfully', function (done) {
        this.timeout(3000);
        var expectedSuccess = '[pdfgen]-  Successfully initialized';
        pdfgen.init(function (err, success) {
            should.not.exist(err);
            should.exist(success);
            success.should.equal(expectedSuccess);
            done();
        });
    });

    var expectedTypeError = '[pdfgen]-  Error: expects parameters (html, path, callback)';
    var renderMsg = '[pdfgen]-  Successfully rendered PDF \'%s\'';

    it('should return error when given invalid html parameter', function (done) {
        pdfgen.render(null, 'output.pdf', function (err, success) {
            should.exist(err);
            should.not.exist(success);
            err.should.equal(expectedTypeError);
            done();
        });
    });

    it('should return error when given invalid path parameter', function (done) {
        pdfgen.render(html, null, function (err, success) {
            should.exist(err);
            should.not.exist(success);
            err.should.equal(expectedTypeError);
            done();
        });
    });

    it('should render HTML successfully', function (done) {
        var path = 'test/output.pdf';
        var expectedSuccess = util.format(renderMsg, path);
        pdfgen.render(html, path, function (err, success) {
            should.not.exist(err);
            should.exist(success);
            success.should.equal(expectedSuccess);
            fs.exists(path, function (exists) {
                exists.should.equal(true);
                fs.unlink(path);
            });
            done();
        });
    });
});
