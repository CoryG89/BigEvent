BigEvent
========

Demo for COMP 4710 Senior Design Project -- Auburn SGA's Big Event Program.

Get The Project
---------------

In order to clone the repository you will need [Git][git] installed, after which you can run the following commands:

    git clone https://github.com/CoryG89/BigEvent
    cd BigEvent

Alternatively, instead of using Git you can download a ZIP file directly from GitHub.

Build Instructions
------------------
This demo is built on top of [Node.JS][node], you will need it installed in order to build the project. After you successfully install Node.JS you will need to install it's dependencies using Node's package manager, [npm][npm]:

    npm install

This will install all remote Node.JS module dependencies from the npm registry. The server has a modular structure. If you browse to the [`server`][server-dir] directory you will see the following sub-modules:

 * `dbman` - Database management module
 * `emailer` - Email management module
 * `middleware` - Middleware module
 * `router` - Request/Path routing module

In order to build the server you must provide authentication data for both the `dbman` module and the `emailer` module. Inside of each directory you will need to create a file called `auth.json` which contains the authentication details needed to access the database and email account used by the server. Inside of both directories is a file named `auth.json.SAMPLE` which contains a sample set of authentication details. The SAMPLE files are only examples that are not actually used by the server. The server relies on a [MongoDB][mongodb] database for persistence, you can create your own development Mongo database for free with a hosting provider such as [MongoLab][mongolab]. For e-mail you may use a Gmail account or use another [well known provider][nodemailer-wkps] supported by [nodemailer][nodemailer]. You may also need to set your `hosts` file to map to the loopback address `127.0.0.1` to `bigevent.com` due to Windows Live's domain
restrictions.

Running The Server
------------------
The server runs on port 80 so you will need to make sure that port is free,
you may then start the server by running the following command:

    npm start

Browse to the development domain, `bigevent.com` and if you set everything up correctly you should get the rendered home page.

[git]: http://git-scm.com
[node]: http://nodejs.org
[npm]: https://npmjs.org
[express]: http://expressjs.com
[mongodb]: http://mongodb.org
[mongolab]: http://mongolab.com
[nodemailer]: https://github.com/andris9/Nodemailer
[nodemailer-wpks]: https://github.com/andris9/Nodemailer#well-known-services-for-smtp
[server-dir]: server
