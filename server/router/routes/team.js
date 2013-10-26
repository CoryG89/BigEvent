'use strict';

module.exports = function (req, res) {
    res.render('teams', {
        title: 'Volunteer Team',
        user: req.session.volunteer,
        _layoutFile: 'default'
    });
};
