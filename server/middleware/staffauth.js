'use strict';

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[middleware.auth]-  ' });

var redirectPath = '/access-denied';

function isStaffRole(role) {
    return role === 'executive' || role === 'coordinator' ||
        role === 'committee' || role === 'leadership';
}

module.exports = function () {
    return function (req, res, next) {
        var user = req.session.user;
        if (user && isStaffRole(user.role)) {
            log('Staff role \'%s\' detected --> calling next()', user.role);
            next();
        } else {
            log ('Non staff role \'%s\' detected --> access denied', user.role);
            res.redirect(redirectPath);
        }
    };
};
