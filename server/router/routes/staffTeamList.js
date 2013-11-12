'use strict';

var dbman = require('../../dbman');
var users = dbman.getCollection('users');

var match = {
    $match: {
        role: 'volunteer'
    }
};

var group = {
    $group: {
        _id: '$volunteer.team',
        members: {
            $push: {
                firstName: '$volunteer.firstName',
                lastName: '$volunteer.lastName',
                email: '$volunteer.email',
                gender: '$volunteer.gender'
            }
        }
    }
};

module.exports = function (req, res) {
    users.aggregate(match, group, function (err, docs) {
        if (err) {
            res.send(400);
        } else {
            res.render('team-list', {
                title: 'Volunteer Teams',
                teams: docs
            });
        }
    });
};
