'use strict';

/** Import the Express web framwork for Node.JS */
var express = require('express');

/** Import EJS for templates and ejs-locals engine for layouts/partials */
var engine = require('ejs-locals');

var debug = require('./server/debug');
var packageData = require('./package');

var log = debug.getLogger({ prefix: '[app]-  ' });

var app = express();
log('Express framework initialized');

var server = require('./server');

/** Default Express App Configuration */
app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/server/views');

    /** Middleware stack */
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('SuperAppSpecificSecretGoesHere'));
    app.use(express.session({ secret: 'SuperAppSpecificSecretGoesHere' }));
    app.use(express.static(__dirname + '/public'));
    app.use(server.middleware.auth());
    app.use(server.middleware.reqdata());
    app.use(app.router);

    /** Register EJS for HTML and set HTML as our default view engine */
    app.engine('.html', engine);
    app.set('view engine', 'html');
});

/** Development configuration */
app.configure('development', function () {
    app.use(express.errorHandler());
});

/** Define local variables available to all views */
app.locals({
    site: {
        title: 'Big Event',
        description: packageData.description,
        url: 'http://bigevent.com/'
    },
    author: packageData.author
});

log('Express app, %s, has been properly configured', packageData.name);

/** Create our server and start listening */
server.createServer(app).listen(app.get('port'));
