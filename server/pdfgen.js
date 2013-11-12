'use strict';

var fs = require('fs');
var ejs = require('ejs');
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

var templatePath = __dirname + '/views/pdf/';

function generate (html, path, onError, onSuccess) {
    if (typeof html !== 'string' || typeof path !== 'string') {
        log(typeErrorMsg, onError);
        return;
    }
    page.set('content', html, function (err) {
        if (err) {
            log(contentErrorMsg, err, onError);
            return;
        }
        page.render(path, function (err) {
            if (err) {
                log(renderErrorMsg, path, err, onError);
                return;
            }
            log(renderMsg, path, function (renderMsg) {
                if (typeof onSuccess === 'function') {
                    onSuccess(renderMsg);
                }
            });
        });
    });
}

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

    render: function (options) {
        var html = options.html;
        var path = options.path;
        var template = options.template;
        var locals = options.locals;
        var onError = options.onError;
        var onSuccess = options.onSuccess;

        if (typeof template === 'string' && typeof locals === 'object') {
            if (!/\.\/.+/.test(template))
                template = templatePath + template;
            template += '.html';
            fs.readFile(template, 'utf-8', function (err, html) {
                if (err) {
                    log('Error reading template file:\n\n\t%s\n', err, onError);
                    return;
                }
                html = ejs.render(html, locals);
                generate(html, path, onError, onSuccess);
            });
        } else {
            generate(html, path, onError, onSuccess);
        }
    }
};
