'use strict';

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[middleware.staffauth]-  ' });

var redirectPath = '/access-denied';

var statusTypes = ['Approved', 'Declined', 'Finished Interview', 'Scheduled for Interview'];

module.exports = function () {
    return function (req, res, next) {
        var user = req.session.user;
        if (res.locals.isStaff) {
            log('Staff role \'%s\' detected --> calling next()', user.role);
            next();
        } 
        else 
        {
            if(user.status && user.role !== 'coordinator')
            {
                log ('User not Approved: User status: \'%s\' detected --> access denied', statusTypes[user.status]);
                res.redirect(redirectPath);
            }
            else
            {
                log ('Non staff role \'%s\' detected --> access denied', user.role);
                res.redirect(redirectPath);
            }
        }
    };
};
