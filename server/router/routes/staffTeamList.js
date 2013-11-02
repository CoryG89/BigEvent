'use strict';

var dbman = require('../../dbman');
var volunteers = dbman.getCollection('volunteers');

module.exports = function (req, res) {
    volunteers.aggregate({
        $group: {
            _id: '$team',
            members: {
                $push: {
                    firstName: '$firstName',
                    lastName: '$lastName',
                    email: '$email',
                    gender: '$gender'
                }
            }
        }
    }, function (err, docs) {
        if (err) {
            res.send(400);
        } else {
            res.render('team-list', {
                title: 'Volunteer Teams',
                teams: docs,
                _layoutFile: 'default'
            });
        }
    });
};
