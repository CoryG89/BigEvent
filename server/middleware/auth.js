'use strict';

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[middleware.auth]-  ' });

module.exports = function () {
    var protectedPaths = ['/volunteer', '/volunteer/control-panel'];
    var redirectPath = '/signin';

    var isProtected = function (path) {
        for (var i = 0; i < protectedPaths.length; i++)
            if (path === protectedPaths[i]) return true;
        return false;
    };

    return function (req, res, next) {
        if (!isProtected(req.path)) {
            log('Allowed path %s -->  calling next()', req.path);
            next();
        } else if (req.session.user) {
            log('User session detected --> calling next()');
            next();
        } else {
            res.cookie('prev_path', req.path, {
                maxAge: 900000,
                signed: false
            });
            log('No session detected, redirecting to: %s', redirectPath);
            res.redirect(redirectPath);
        }
    };
};
