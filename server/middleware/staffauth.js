'use strict';

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[middleware.staffauth]-  ' });

var redirectPath = '/access-denied';

module.exports = function () {
    return function (req, res, next) {
        var user = req.session.user;
        if (res.locals.isStaff) {
            log('Staff role \'%s\' detected --> calling next()', user.role);
            next();
        } else {
            log ('Non staff role \'%s\' detected --> access denied', user.role);
            res.redirect(redirectPath);
        }
    };
};
