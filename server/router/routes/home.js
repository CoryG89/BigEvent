'use strict';

module.exports = function (req, res) {
    if (res.locals.isStaff && req.path === '/home')
        res.redirect('/staff/staffHomePage');
    else
        res.render('home', { title: 'Home' });
};
