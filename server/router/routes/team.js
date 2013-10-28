'use strict';

var dbman = require('../../dbman');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.team]-  '});

var ObjectID = dbman.getObjectId();
var volunteers = dbman.getCollection('volunteers');
var teams = dbman.getCollection('teams');

function validateVolunteerReq (req) {
    return typeof req.session.user !== 'undefined' &&
        req.session.user.role === 'volunteer' &&
        typeof req.session.volunteer !== 'undefined';
}

var queryError = 'Error querying collection \'%s\':\n\n\t%s\n';

module.exports = {

    get: function (req, res) {
        if (!validateVolunteerReq(req)) {
            res.redirect('/access-denied');
        } else {

            var locals = {
                title: 'Volunteer Team',
                volunteer: req.session.volunteer,
                team: null,
                _layoutFile: 'default'
            };

            if (req.session.volunteer.team !== null) {

                var userId = req.session.volunteer.user;
                var teamId = req.session.volunteer.team;

                teams.findOne({ _id: teamId }, function (err, teamDocument) {
                    if (err) {
                        log(queryError, 'teams', err);
                        res.send(400);
                    } else if (!teamDocument) {
                        log('Team \'%s\' not found, creating document', teamId);

                        var newTeam = { _id: teamId, members: [userId] };

                        teams.insert(newTeam, { w: 1 }, function (err, docs) {
                            if (err) {
                                log('Error creating team doc:\n\n\t%s\n', err);
                                res.send(400);
                            } else {
                                log('Team record successfully created');
                                teamDocument = docs[0];

                                locals.team = {
                                    _id: teamDocument._id,
                                    members: [req.session.volunteer]
                                };

                                res.render('team', locals);
                            }
                        });
                    } else {
                        log('Team record \'%s\' found', teamId);
                        var query = { team: new ObjectID(teamId) };

                        volunteers.find(query).toArray(function (err, docs) {
                            if (err || !docs) {
                                log(queryError, 'volunteers', err);
                                res.send(400);
                            } else {
                                log('Member records loaded successfully');

                                locals.team = {
                                    _id: teamDocument._id,
                                    members: docs
                                };
                                res.render('team', locals);
                            }
                        });
                    }
                });
            } else {
                res.render('team', locals);
            }
        }
    },

    create: function (req, res) {
        if (validateVolunteerReq(req) && req.session.volunteer.team === null) {
            log('CREATE: Request validated, creating team');
            
            var userId = req.session.user._id;
            var teamId = new ObjectID();

            var query = { _id: userId };
            var cmd = { $set: { team: teamId } };
            var opt = { w: 1 };

            volunteers.update(query, cmd, opt, function (err, result) {
                if (err || !result) {
                    log('CREATE: Error updating volunteer doc:\n\n\t%s\n', err);
                    res.send(400);
                } else {
                    log('CREATE: Volunteer team id updated to \'%s\'', teamId);
                    req.session.volunteer.team = teamId;
                    res.redirect('/volunteer/team');
                }
            });

        } else {
            res.render('hero-unit', {
                title: 'Error',
                header: 'Sorry!',
                message: 'There was a problem processing your request.',
                _layoutFile: 'default'
            });
        }
    },

    invite: function (req, res) {
        if (typeof req.query.id !== 'string') {
            log('INVITE: Team id not found in query string');
            res.send(400);
        } else if (!validateVolunteerReq(req)) {
            log('INVITE: Invalid volunteer session');
            res.send(400);
        } else {
            if (req.volunteer.team === null) {
                res.send(200);
            } else {
                res.send(400);
            }
        }
    }
};
