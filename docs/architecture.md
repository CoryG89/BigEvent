Architecture
============

So far our application has the following structure:

    - docs
    - node_modules
    - public
        - css
        - img
        - js
        - vendor
            - css
            - img
            - js
    - server
        - dbman
              auth.json
              auth.json.SAMPLE
              index.js
        - emailer
              auth.json
              auth.json.SAMPLE
              index.js
        - middleware
              auth.js
              index.js
              reqdata.js
        - router
            - routes
              index.js
        - views
          debug.js
          geocoder.js
          index.js
      .gitignore
      app.js
      package.json
      README.md

I am going to attempt to explain what each part of the application is
responsible for.

 * `docs` - Contains markdown documentation. Text files with `.md` extension
   markdown files which are rendered by GitHub and can be compiled into HTML.

 * `node_modules` - The Node package manager npm installs module dependencies
   into this directory. These dependencies are listed in the `package.json`
   file and can be installed with the command `npm install`.

 * `public` - Contains static assets for the site. This includes things such as
   JavaScript files to be executed by the client, stylesheets and images. Any
   other static resources would also be kept here. The subdirectory `vendor`
   contains assets from third party libraries such as Twitter Bootstrap and
   jQuery.

 * `server` - The `server` directory along with the `app.js` file which serves
   as the main-entry point make up our server-side code. Our server is modular.
   The `server` directory is a Node module. It is imported by the `app.js` file
   via a call to `require`. The code for the `server` module resides in
   `server/index.js`. The server module wraps the native Node.JS http module
   and also consists of several submodules.

   - The `dbman` module establishes a connection with our MongoDB database via
     the MongoDB native driver. It gets the database object and collections and
     exports them for other server modules to use. The `dbman` module imports
     authentication details from `auth.json`.

   - The `emailer` module uses the `node-mailer` module to send emails. It
     imports authentication details from a file `auth.json`. It is currently
     set up to use a Gmail account but can be configured to use any SMTP mail
     server.

   - The `middleware` module contains the express middleware functions. The
     Express web framework is built on top of a library called Connect which
     has the notion of a middleware stack. When requests come into the server
     middleware can be thought of as a stack of functions which the requests
     must pass through.
