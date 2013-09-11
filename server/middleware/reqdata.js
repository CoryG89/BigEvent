'use strict';

module.exports = function () {
    return function (req, res, next) {
        res.locals({
            req: {
                path: req.path
            }
        });
        next();
    };
};
