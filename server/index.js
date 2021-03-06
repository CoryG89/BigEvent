'use strict';

var http = require('http');

var debug = require('./debug');
var router = require('./router');
var dbman = require('./dbman');
var emailer = require('./emailer');
var middleware = require('./middleware');
var pdfgen = require('./pdfgen');

var httpServer;
var log = debug.getLogger({ prefix: '[server]-  ' });

module.exports = {
    middleware: middleware,
    createServer: function (app) {
        dbman.init(function () {
            router.init(app);
        });
        pdfgen.init();
        httpServer = http.createServer(app);
        if (httpServer) {
            log('Sucessfully created HTTP server');
            return this;
        }
    },
    listen: function (port) {
        httpServer.listen(port, function () {
            log('Server listening on port %d', port);
        });
    }
};
