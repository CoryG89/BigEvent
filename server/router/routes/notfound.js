'use strict';

module.exports = function (req, res) {
    res.render('heroMessage', {
        title: '404 Not Found',
        header: 'Sorry! We couldn\'t find it.',
        message: 'The page you requested could not be found at this path.',
        _layoutFile: 'default'
    });
};
