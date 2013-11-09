'use strict';

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[middleware.wlauth]-  ' });

var redirectPath = '/signin';

var isOpenPath = (function () {
    var openPaths = {
        '/': true,
        '/home': true,
        '/signin': true,
        '/jobsite/request': true,
        '/jobsite/request/failure': true,
        '/jobsite/request/success': true,
        '/volunteer/team/invite': true,
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
            res.cookie('signin_redirect', req.url, { maxAge: 45000 });
            log('No session detected, redirecting to: %s', redirectPath);
            res.redirect(redirectPath);
        }
    };
};
