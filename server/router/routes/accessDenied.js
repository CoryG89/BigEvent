'use strict';

module.exports = function (req, res) {
    res.render('hero-unit', {
        title: 'Access Denied',
        header: 'Access Denied',
        message: 'You do not have sufficient privileges to view this page.',
        _layoutFile: 'default'
    });
};
