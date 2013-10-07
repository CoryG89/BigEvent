Getting Started With Node
=========================

According to [Wikipedia][node-wiki]:

> Node.js is a software platform that is used to build scalable network
> (especially server-side) applications. Node.js utilizes JavaScript as its
> scripting language, and achieves high throughput via non-blocking I/O and a
> single-threaded event loop.
> 
> Node.js contains a built-in HTTP server library, making it possible to run a
> web server without the use of external software, such as Apache or Lighttpd,
> and allowing more control of how the web server works.

[Node.JS][node] contains essentially a thin C++ wrapper around the V8 JavaScript
Engine for doing network programming, it contains a library developed as part of
Node called [libuv][libuv] which implements an asynchronous, non-blocking I/O
model with a single-threaded event-loop. Node also contains a module system and
a set of native modules written in JavaScript with C++ bindings allowing an
interface to do cross-platform network programming in JavaScript.

Modules
-------

Node.JS implements the [CommonJS Modules 1.0 Specification][commonjs-modules].
Unlike writing JavaScript in browser based, client-side development, your Node
scripts are not linked by a common global scope as in client-side JavaScript.

In the browser, scripts communicate with each other, the browser, and the web
page's DOM through a shared global scope on the `window` object. If you open
up the browser console and execute `window === this` it will return `true`. Node
programs do not run in the context of the browser so `window` is not defined.

Instead, in Node.JS your scripts are isolated from one another, the only way to
have multi-script Node programs is to use modules. Basically, variables that
you define in your Node scripts will *not* be globally accessible in your other
scripts. You will have to explicitly export public attributes and/or methods 
from within your script to create a module which can be imported by other
scripts. Many modules can be imported, but a single script can export only
a single module.

A Node script can define a module by exporting public attributes and methods by
attaching them to the `exports` property of the global `module` object. A Node
script can import modules defined by other scripts via a call to the global
built-in Node function `require`. Both the `module` object and the `require` 
function are part of the implementation of the CommonJS module spec and is not
defined in scripts executed by the browser.

### Using Modules

A good real-world example of using Node.JS modules is the view renderer of our
server's `emailer` module ([`server/emailer/renderer.js`][renderer.js]). I've
included a version here, split into three parts and annotated with extra
comments.

    /** Import native Node modules */
    var fs = require('fs');                 // Filesystem module

    /** Import modules published/installed via npm, listed in package.json */
    var ejs = require('ejs');               // EJS template engine
    var marked = require('marked');         // Markdown parser and compiler

    /** Import modules exported by local scripts */
    var debug = require('../debug');        //  server/debug.js module

This script imports multiple modules. The filesystem module, `fs`, is one of
Node's native module and as such does not have to be installed locally, it can
simply be imported by any script executed by Node. The next two scripts are
Node modules that have been published to the npm registry and are declared as
dependencies in the `package.json` file in the app's root directory. These
npm modules can be installed via the command `npm install` which parses
`package.json` and installs the modules locally in the `node_modules` directory.
Finally the last module is a module defined by a local `debug.js` script that
is in the parent directory. To import local scripts that are not located in the
`node_modules` directory, the module name given to `require` must begin with
`./` or `../`.

    /** Setup imported modules, any necessary state, etc. */
    var log = debug.getLogger({ prefix: '[emailer.renderer]-  ' });
    marked.setOptions({
        gfm: true,
        tables: true,
        smartLists: true,
        breaks: false,
        pedantic: false,
        sanitize: false
    });

    /** Define any private helper methods, state, etc.
    function unescape (html) {
        return html
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, '\'')
            .replace(/&amp;/g, '&');
    }

The second part of the renderer script above can be thought of as the private
part of the script. Setting up the imported modules as well as defining a
private helper function for using regular expressions to escape strings. The
third part of the script, shown below, defines the exported module. The module
can be thought of as a public interface to the functionality provided by the
rest of the script.

    /** Define a module that can be imported by other scripts, the attributes
        of module.exports object can be thought of as public properties and
        public methods. */
    module.exports = {
        
        parse: function (string, locals) {
            var html;
            try {
                html = marked(string);
                html = unescape(html);
                html = ejs.render(html, locals);
            } catch (error) {
                log('Error parsing markdown string');
            } finally {
                return html;
            }
        },

        render: function (path, locals, callback) {
            var self = this;
            fs.readFile(path, 'utf8', function (error, markdown) {
                if (error) {
                    log('Error reading file:\n\n%s\n\n', error);
                    callback(error);
                } else {
                    callback(null, self.parse(markdown, locals));
                }
            });
        }
    };

The above code defines a module that is a JavaScript `object`, containing two
methods `parse` and `render`. The third part of the script could have been much
shorter if the functions used were declared as private helper functions, like
the unescape function prior to when `module.exports` object was set. We could
then might have something like the following:

    function parseString () {
        // ...
    }

    function renderFile () {
        // ...
    }

    module.exports = {
        parse: parseString,
        render: renderFile
    };


### Module Dependencies

In Node.JS the module exported by a file typically has a dependency on the
modules imported by that file. However, consider the case of two modules that
import each other, this forms a [module cycle][node-modules-cycles] or in other
words, two modules with a circular dependency.

For example, take Module A:

    /** Module A -- a.js */
    var b = require('./b');

    var myName = 'a';

    module.exports {
        getName: function () {
            return myName;
        }
    }

Module A has a dependency on Module B:

    /** Module B -- b.js */
    var a = require('./a');

    var myName = 'b';

    module.exports {
        getName: function () {
            return myName;
        }
    }

The dependency here is a circular one because Module A has a dependency on
Module B which, itself, has a dependency on Modula A. If Module A and B are
used in another script, say `app.js` which is executed by Node, then app.js
tries to load module b


[node]: http://nodejs.org
[node-download]: http://nodejs.org/download
[node-repo]: http://github.com/joyent/node
[node-wiki]: https://en.wikipedia.org/wiki/Node.js

[node-api]: http://nodejs.org/api
[node-modules]: http://nodejs.org/api/modules.html
[node-modules-cycles]: http://nodejs.org/api/modules.html#modules_cycles
[node-globals]: http://nodejs.org/api/globals.html
[node-events]: http://nodejs.org/api/events.html
[node-os]: http://nodejs.org/api/os.html
[node-http]: http://nodejs.org/api/http.html
[node-https]: http://nodejs.org/api/https.html
[node-path]: http://nodejs.org/api/path.html
[node-process]: http://nodejs.org/api/process.html
[node-url]: http://nodejs.org/api/url.html
[node-timers]: http://nodejs.org/api/timers.html
[node-stream]: http://nodejs.org/api/stream.html

[npm]: http://npmjs.org
[npm-package-json]: https://npmjs.org/doc/json.html
[nodejitsu]: http://nodejitsu.com/
[nodejitsu-docs]: http://docs.nodejitsu.com/

[node-wiki-projects]: https://github.com/joyent/node/wiki/Projects%2C-Applications%2C-and-Companies-Using-Node
[node-wiki-modules]: https://github.com/joyent/node/wiki/Modules

[renderer.js]: ../server/emailer/renderer.js
