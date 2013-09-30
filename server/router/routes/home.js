'use strict';

module.exports = function (req, res) {
    res.render('home', {
        title: 'Home',
        _layoutFile: 'default',
        user: req.session.user
    });
};
