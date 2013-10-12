'use strict';

module.exports = function (req, res) {
    res.render('hero-unit', {
        title: '404 Not Found',
        header: 'Sorry! We couldn\'t find it.',
        message: 'The page you requested could not be found at this path.',
        user: req.session.user,
        _layoutFile: 'default'
    });
};
