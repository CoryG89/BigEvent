BigEvent
========

Demo for COMP 4710 Senior Design Project -- Auburn SGA's Big Event Program.

Get The Project
---------------

In order to clone the repository you will need [Git][git] installed, after which
you can run the following commands:

    git clone https://github.com/CoryG89/BigEvent
    cd BigEvent

Alternatively, instead of using Git you can download a ZIP file directly from
GitHub.

Build Instructions
------------------
This demo is built on top of [Node.JS][node], you will need it installed in
order to build the project. After you successfully install Node.JS you will need
to install it's dependencies using Node's package manager, [npm][npm]:

    npm install

In order to build the server you must provide authentication data for both the
`server/dbman` module and the `server/emailer` module. Inside of each directory
you will need to create a file called `auth.json` which contains the
authentication details needed to access the database and email account used by
the server. Inside of both directories is a file named `auth.json.SAMPLE` which
contains a sample set of authentication details. The SAMPLE files are only
examples that are not actually used by the server. The server relies on a
[MongoDB][mongodb] database for persistence, you can create your own development
Mongo database for free with a hosting provider such as [MongoLab][mongolab].
For e-mail you may use a Gmail account or use another
[well known provider][nodemailer-wkps] supported by [nodemailer][nodemailer].

You may also need to add the following line to your `hosts` file:

    127.0.0.1        bigevent.com

The `hosts` file contains mappings from hostnames to IP addresses. In this case
we are making `bigevent.com` the same as `localhost`. On Windows, the `hosts`
file may be found at `C:\Windows\System32\Drivers\etc\hosts`. On Mac it's at
`/private/etc/hosts`. On Linux it can be found at `/etc/hosts`.


Running The Server
------------------
The server runs on port 80 so you will need to make sure that port is free,
you may then start the server by running the following command:

    npm start

Browse to the development domain, `bigevent.com` and if you set everything up
correctly the home page should be rendered.


Dependencies
------------
Our server is written with Node which comes packaged with a number of
[native modules][node-api]. The [HTTP module][node-api-http] runs at the heart
of our server. Our server also has the following module dependencies which are
installed via the [npm repository][npm] by running `npm install`. These
dependencies are specified in the `package.json` file.

 * [**`express`**][express]
  - Express is a popular, [open-source][express-repo], web-framework for node.  
    It wraps the HTTP server module. Provides features like dynamic routing, 
    session support, view rendering/templating, etc. Express also has support
    for what is called middleware. A server's middleware is a stack of functions
    through which requests are passed before a response is generated from the
    server. A particular middleware function in the server's middleware stack
    may decide either to handle the request or pass it on to the next middleware 
    function.

 * [**`ejs`**][ejs]
  - EJS is template engine written by the creator of Express, 
    [TJ Holowaychuk][tj-holowaychuk], who is also the author of Express and the
    Mocha test-running framework we're using. EJS supports both client-side and
    server-side templating. We're using EJS server-side by depending on the
    `ejs` npm. EJS stands for Embedded JavaScript, which is fitting because
    supports template logic by executing JavaScript embedded within
    micro-template style tags. `<% %>`.

 * [**`ejs-locals`**][ejs-locals]
  - [ejs-locals][ejs-locals] is a library wrapping the `ejs` module which adds
    support for view partials, layouts, and block include functions within EJS
    templates.

 * [**`nodemailer`**][nodemailer]
  - Allows e-mails to be sent by a Node server using various transport methods,
    the most common being an SMTP server. Nodemailer supports these
    [well known services][nodemailer-wpks] in order to make configuration easy.

 * [**`mongodb`**][mongodb]
  - MongoDB is the leading NoSQL database management system, meaning it is 
    *not* work with relational databases like more common SQL-based database
    management systems. MongoDB does not work with tables and rows and those
    words are not part of the terminology used. MongoDB stores and queries data
    from **collections** of JSON-style **documents**
  - The MongoDB system itself is written in C++ for performance, but it's
    native driver is actually written in JavaScript as a Node.JS module. MongoDB
    offers   is itself written for  a Node module so we're using it as it was
    meant to be used. There are some other alternatives to using this module
    two of which I have considered are `Mongoose` and `mongoskin`

 * [**`moment`**][moment]
  - Parsing and creating timestamps using the JavaScript Date object.

 * [**`marked`**][marked]
  - Markdown parser and compiler written in JavaScript. Built for speed.

 * [**`export-dir`**][export-dir]
  - This is an example of a Node module that I wrote myself. It's purpose is
    to allow you to export an entire directory of files as an object. It is
    used in the routes

Documentation
-------------
 - [Basic App Architecture][doc-architecture]
 - [JavaScript Guide and Resources][doc-javascript]
 - [Getting Started With Node][doc-node]
 - [Getting Started With Express][doc-express]
 - [Getting Started With Git][doc-git]
 - [Getting Started With MongoDB][doc-mongodb]
 - [Sublime Text Guide](docs/sublimetext.md)
 - [JSON Guide and Resources](docs/json.md)
 - [Testing Guide](docs/testing.md)

[git]: http://git-scm.com
[node]: http://nodejs.org
[node-api]: http://nodejs.org/api
[node-api-http]: http://nodejs.org/api/http.html
[npm]: https://npmjs.org
[express]: http://expressjs.com
[express-repo]: https://github.com/visionmedia/express
[ejs]: http://embeddedjs.com
[ejs-locals]: https://github.com/randometc/ejs-locals
[mongodb]: http://mongodb.org
[mongolab]: http://mongolab.com
[nodemailer]: https://github.com/andris9/Nodemailer
[nodemailer-wpks]: https://github.com/andris9/Nodemailer#well-known-services-for-smtp
[moment]: https://github.com/moment/moment
[markedejs]: https://github.com/CoryG89/markedejs
[export-dir]: https://github.com/CoryG89/export-dir

[doc-architecture]: docs/architecture.md
[doc-javascript]: docs/javascript.md
[doc-node]: docs/node.md
[doc-express]: docs/express.md
[doc-git]: docs/git.md
[doc-mongodb]: docs/mongodb.md
[doc-sublimetext]: docs/sublimetext.md
[doc-json]: docs/json.md
[doc-testing]: docs/testing.md
