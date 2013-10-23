'use strict';

var moment = require('moment');

module.exports = function () {
    return function (req, res, next) {
        res.locals({
            reqdata: {
                path: req.path,
                date: moment()
            },
            user: req.session.user
        });
        next();
    };
};
