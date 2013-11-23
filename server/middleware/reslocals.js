'use strict';

var moment = require('moment');

module.exports = function () {
    return function (req, res, next) {
        res.locals({
            reqdata: {
                url: req.url,
                host: req.host,
                protocol: req.protocol,
                path: req.path,
                date: moment()
            },
            user: req.session.user
        });
        next();
    };
};
