'use strict';

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[middleware.auth]-  ' });

var redirectPath = '/signin';

var isOpenPath = (function () {
    var openPaths = {
        '/': true,
        '/home': true,
        '/signin': true,
        '/jobsite/request': true,
        '/contact': true,
        '/about': true
    };
    return function (path) {
        return typeof openPaths[path] !== 'undefined';
    };
})();

module.exports = function () {
    return function (req, res, next) {
        if (isOpenPath(req.path)) {
            log('Allowed path %s -->  calling next()', req.path);
            next();
        } else if (req.session.user) {
            log('User session detected --> calling next()');
            next();
        } else {
            res.cookie('request_path', req.originalUrl, {
                maxAge: 900000,
                signed: false
            });
            log('No session detected, redirecting to: %s', redirectPath);
            res.redirect(redirectPath);
        }
    };
};
