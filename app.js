'use strict';

/** Import Express and EJS engine */
var express = require('express');
var engine = require('ejs-locals');

var server = require('./server');
var packageData = require('./package');
var debug = require('./server/debug');

var auth = require('./auth');
var config = require('./config');

/** Initialize Express app object */
var app = express();

/** Initialize the debugging module and get a logger */
debug.setEnabled(app.get('env') === 'development');
var log = debug.getLogger({ prefix: '[app]-  ' });

log('Express framework initialized');

/** Default Express App Configuration */
app.engine('.html', engine);
app.set('view engine', 'html');
app.set('views', __dirname + '/server/views');
app.set('port', process.env.PORT || 80);

/** Middleware stack */
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(auth.cookieClientSecret));
app.use(express.session({ secret: auth.sessionClientSecret }));
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(__dirname + '/public'));
app.use(server.middleware.wlauth());
app.use(server.middleware.isStaff());
app.use('/staff', server.middleware.staffauth());
app.use(server.middleware.reslocals());
app.use(app.router);

/** Development configuration */
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

/** Define global app-level locals, these locals will be available
    in all of the views rendered by Express */
app.locals(config);

log('Express app, %s, has been properly configured', packageData.name);

/** Finally, actually create our server and start listening */
server.createServer(app).listen(app.get('port'));
