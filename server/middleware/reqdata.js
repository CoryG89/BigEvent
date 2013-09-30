'use strict';

var moment = require('moment');

module.exports = function () {
    return function (req, res, next) {
        var path = req.path;

        res.locals({
            reqdata: {
                path: path,
                date: moment()
            }
        });
        next();
    };
};
