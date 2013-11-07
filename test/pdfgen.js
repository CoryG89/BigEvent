'use strict';

var fs = require('fs');
var util = require('util');
var chai = require('chai');
var pdfgen = require('../server/pdfgen');

var should = chai.should();

var html = [
    '<!DOCTYPE html><html><head><title>My Webpage</title></head><body>',
    '<h2>Some Awesome HTML</h2><p>I mean really awesome</p></body></html>'
].join('');

describe('pdfgen', function () {

    it('should be initialized successfully', function (done) {
        this.timeout(3000);
        var expectedSuccess = '[pdfgen]-  Successfully initialized';
        pdfgen.init(function (err, success) {
            should.not.exist(err);
            success.should.be.a('string');
            success.should.equal(expectedSuccess);
            done();
        });
    });

    var expectedTypeError = '[pdfgen]-  Error: expects parameters (html, path, callback)';
    var renderMsg = '[pdfgen]-  Successfully rendered PDF \'%s\'';

    it('should return error when given invalid html parameter', function (done) {
        pdfgen.render({
            html: null,
            path: 'output.pdf',
            onError: function (errorMsg) {
                should.exist(errorMsg);
                errorMsg.should.be.a('string');
                errorMsg.should.equal(expectedTypeError);
                done();
            },
            onSuccess: function () {
                throw 'onSuccess should not be called';
            }
        });
    });

    it('should return error when given invalid path parameter', function (done) {
        pdfgen.render({
            html: html,
            path: null,
            onError: function (errorMsg) {
                should.exist(errorMsg);
                errorMsg.should.be.a('string');
                errorMsg.should.equal(expectedTypeError);
                done();
            },
            onSuccess: function () {
                // Should never be called throw error
                throw 'OnSuccess should not be called';
            }
        });
    });

    it('should render a PDF given a string of HTML', function (done) {
        var path = 'test/output.pdf';
        var expectedSuccess = util.format(renderMsg, path);
        
        pdfgen.render({
            html: html,
            path: path,

            onError: function () {
                throw 'onError should not be called';
            },
            
            onSuccess: function (successMsg) {
                should.exist(successMsg);
                successMsg.should.be.a('string');
                successMsg.should.equal(expectedSuccess);
                fs.exists(path, function (exists) {
                    exists.should.equal(true);
                    fs.stat(path, function (err, stats) {
                        should.not.exist(err);
                        stats.should.be.an('object');
                        stats.size.should.be.a('number');
                        stats.size.should.equal(10394);
                        fs.unlink(path, function(err) {
                            should.not.exist(err);
                            done();
                        });
                    });
                });
            }
        });
    });

    it('should render a PDF given a template and data', function (done) {
        var path = 'test/output.pdf';
        var expectedSuccess = util.format(renderMsg, path);
        
        pdfgen.render({
            template: './test/fixtures/pdfgenTemplate',
            locals: {
                title: 'My Webpage',
                header: 'Some Awesome HTML',
                content: 'I mean really awesome'
            },
            path: path,

            onError: function () {
                throw 'OnError should not be called';
            },
            
            onSuccess: function (successMsg) {
                should.exist(successMsg);
                successMsg.should.be.a('string');
                successMsg.should.equal(expectedSuccess);
                fs.exists(path, function (exists) {
                    exists.should.equal(true);
                    fs.stat(path, function (err, stats) {
                        should.not.exist(err);
                        stats.should.be.an('object');
                        stats.size.should.be.a('number');
                        stats.size.should.equal(10394);
                        fs.unlink(path, function(err) {
                            should.not.exist(err);
                            done();
                        });
                    });
                });
            }
        });
    });
});
