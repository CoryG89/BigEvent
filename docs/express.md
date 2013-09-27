Getting Started With Express
============================

[Express][express] is the probably the most popular full featured web framework
for [Node.JS][node]. Express wraps the native Node `http` module. Provides
advanced features like dynamic request-response routing, view rendering,
template engine support, sessions, etc.

Express is an open source Node module [available on GitHub][express-repo] and
published to the [npm registery][npm]. The Express website contains great API
documentation. You can install Express in a local node project by adding it as
a dependency to the `package.json` file and running the command

    npm install

You may then import the `express` module in your own scripts by using Node's
built in `require` function like so

    var express = require('express');

Middleware
----------

Express also has support for what is called [middleware][middleware-guide]. A server's middleware is
a stack of functions through which requests are passed before a response is
generated from the server. A particular middleware function in the server's
middleware stack may decide either to handle the request or pass it on to
the next middleware function.

[node]: http://nodejs.org
[npm]: http://npmjs.org
[express]: http://expressjs.com
[express-repo]: http://expressjs.com/visionmedia/express
[express-api]: http://expressjs.com/api
