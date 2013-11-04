'use strict';

var phantomjs = require('phantomjs');
var nodePhantom = require('node-phantom');

var phantom;
var page;

var debug = require('./debug');
var log = debug.getLogger({ prefix: '[pdfgen]-  ' });

var paperSize = { format: 'Letter', orientation: 'portrait', margin: '1cm' };

var phantomErrorMsg = 'Error creating PhantomJS instance:\n\n\t%s\n';
var pageErrorMsg = 'Error creating page:\n\n\t%s\n';
var typeErrorMsg = 'Error: expects parameters (html, path, callback)';
var paperSizeErrorMsg = 'Error setting paper size:\n\n\t%s\n';
var contentErrorMsg = 'Error setting content:\n\n\t%s\n';
var renderErrorMsg = 'Error rendering PDF \'%s\': %s';
var renderMsg = 'Successfully rendered PDF \'%s\'';
var initMsg = 'Successfully initialized';

module.exports = {
    
    init: function (callback) {
        if (typeof phantom === 'undefined' || typeof page === 'undefined') {
            nodePhantom.create(onPhantomCreated, {
                phantomPath: phantomjs.path
            });
        }
        function onPhantomCreated (err, ph) {
            if (err) {
                log(phantomErrorMsg, err, callback);
                return;
            }
            phantom = ph;
            phantom.createPage(function (err, pg) {
                if (err) {
                    log(pageErrorMsg, err, callback);
                    return;
                }
                page = pg;
                page.set('paperSize', paperSize, function (err) {
                    if (err) {
                        log(paperSizeErrorMsg, err, callback);
                        return;
                    }
                    log(initMsg, function (initMsg) {
                        if (typeof callback === 'function') {
                            callback(null, initMsg);
                        }
                    });
                });
            });
        }
    },

    render: function render (html, path, callback) {
        if (typeof html !== 'string' || typeof path !== 'string') {
            log(typeErrorMsg, callback);
            return;
        }
        page.set('content', html, function (err) {
            if (err) {
                log(contentErrorMsg, err, callback);
                return;
            }
            page.render(path, function (err) {
                if (err) {
                    log(renderErrorMsg, path, err, callback);
                    return;
                }
                log(renderMsg, path, function (renderMsg) {
                    if (typeof callback === 'function') {
                        callback(null, renderMsg);
                    }
                });
            });
        });
    }
};
