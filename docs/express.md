Getting Started With Express
============================
[Express][express] is the probably the most popular full featured web framework
for [Node.JS][node]. Express wraps the native Node `http` module. Provides
advanced features like dynamic request-response routing, view rendering,
template engine support, sessions, etc.

Express also has support for what is called middleware. A server's middleware is
a stack of functions through which requests are passed before a response is
generated from the server. A particular middleware function in the server's
middleware stack may decide either to handle the request or pass it on to
the next middleware function. We will go into depth about middleware later and
how we're currently leveraging it for the server. A good example use case is
authentication.

Express is an open source Node module [available on GitHub][express-repo] and
published to the [npm registery][npm]. The Express website contains great API
documentation. You can install Express in a local node project by adding it as
a dependency to the `package.json` file and running the command

    npm install

You may then import the `express` module in your own scripts by using Node's
built in `require` function like so

    var express = require('express');

A Very Basic Express Server
---------------------------
Suppose we create a directory `app` and within it, a script `server.js`. Within
`app/server.js` we can write a single script node program which defines no 
modules of it's own but defines a very basic Express server which implements
an HTTP server which will respond only to GET requests on the root path `/`, and
always with the default HTTP response headers and only `hello world` in the 
body.

    /** Import the Express node module */
    var express = require('express');

    /** Create an app using the Express module */
    var app = express();

    /** Handle GET requests to the path / */
    app.get('/', function (req, res) {
        res.send('hello world');
    });

    /** Start listening on port 3000 */
    app.listen(3000);

Currently, the program above will not execute as is, we only have a directory
and single file. There is currently no way to import the `express` Node module
on the first line of `app/server.js`. When Node's built in `require` function
is given a string like `express` which is a module name, rather than a path
beginning `./` or  `../` then it assumes the module is a dependency (rather
than a local module of the program), and looks for the module at the
`node_modules/express` directory.
  
### Ways to Install Express

You need to use the package manager `npm` to install the express module. The
package manager is backed by and allows publishing to the [npm registry][npm].
For our example we can use the `npm` executable to install express explicitly

  1. Open a shell and change to the node project's root `app` directory.
  2. Run the command `npm install express`

You can also add a JSON file to the Node project's root called `package.json`
which is used by npm. This also allows you to declare your dependencies so that
they can be implicitly installed later. If we created `app/package.json` with
the following

    {
      "name": "MyApp",
      "version": "0.1.0",
      "dependencies": {
        "express": "3.2.x"
      },
      "scripts": {
        "start": "node server"
      }
    }

We could then build the project, installing the `express` module (and any other
declared modules) with only a call to

    npm install

After you've installed Express, you can run the server by calling `npm start`.
This is actually specified in the `package.json` file above. What it does is
actually call `node server` which simply runs the `app/server.js` file. As long
as you've set everything up correctly and you've got nothing running on port
3000 already, your server should start up. You can test it by going to
`localhost:3000` in your browser. This will send an HTTP request with the GET
method for the root path `/`. Your browser should load a blank page from the
server with only the text `hello world`. You should also see the request logged
by your server.

A Slightly More Advanced Webserver
----------------------------------

Here is some commented source for a more advanced express server. This Express
app has access to the underlying server created by the `http` module. The 
Express `app` object is passed to the HTTP server as a request listener,
providing us with a lot of advanced functionality and configuration options. We
are also able to configure Express conditionally based upon the Node 
run-time environment which can be set to development, production, etc.

    /** Import the Node http native module our selves so we can access it later if
        we want. The express module will need to be installed with npm */
    var http = require('http');
    var express = require('express');

    /** Create express app object, and set it as request listener
        for the server created by the native node http module */
    var app = express();
    var server = http.createServer(app);

    /** Use app.set for setting configuration options. Here we use the 
        short-circuited OR here to set to 'port' to the PORT environment variable
        if it exists on the Node process object, otherwise setting to 3000 */
    app.set('port', process.env.PORT || 3000);

    /** Middleware stack, order matters here. Requests pass through each function
        in the stack in order. Each function can determine whether to handle the 
        request by sending a response, in which case the request will not reach the
        functions in the stack below it. Otherwise, it may augment the request or
        response, before finally passing it on to the next function in the stack. */
    app.use(express.compress());
    app.use(express.logger('dev'));
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.use(express.static(__dirname + '/public'));

    /** Used only when NODE_ENV environment variable set to development */
    if (app.get('env') === 'development') {
        app.use(express.errorHandler());
    }

    /** Actually start the HTTP server */
    server.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });


Middleware
----------

Expres





[node]: http://nodejs.org
[npm]: http://npmjs.org
[express]: http://expressjs.com
[connect]: http://www.senchalabs.org/connect/
[express-repo]: http://expressjs.com/visionmedia/express
[express-api]: http://expressjs.com/api
