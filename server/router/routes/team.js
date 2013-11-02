'use strict';

var uuid = require('node-uuid');
var dbman = require('../../dbman');

var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[route.team]-  '});

var volunteers = dbman.getCollection('volunteers');

function validateUserSession(req) {
    return !(
        typeof req.session.user === 'undefined' ||
        typeof req.session.user.role === 'undefined'
    );
}

var projection = {
    firstName: 1,
    lastName: 1,
    email: 1,
    gender: 1
};

module.exports = {

    get: function (req, res) {
        var teamId;
        var query = { team: null };

        if (!validateUserSession(req)) {
            log('Could not validate user session, access denied');
            res.redirect('/access-denied');
        } else if (!res.locals.isStaff && !req.session.volunteer) {
            log('No staff or volunteer session detected');
            res.redirect('/access-denied');
        } else {
            if (!res.locals.isStaff) {
                if (!req.params.id) {
                    teamId = req.session.volunteer.team;
                    res.redirect(req.path + '/' + teamId);
                } else if (req.params.id !== req.session.volunteer.team) {
                    res.redirect('/access-denied');
                } else {
                    teamId = req.params.id;
                }
            }
            else {
                teamId = req.params.id;
            }
            query = { team: teamId };

            volunteers.find(query, projection).toArray(function (err, docs) {
                if (err) {
                    log('Error querying for volunteers:\n\n\t%s\n', err);
                    res.send(400);
                } else {
                    res.render('team', {
                        title: 'Volunteer Team',
                        volunteer: req.session.volunteer,
                        team: {
                            _id: teamId,
                            members: docs
                        },
                        _layoutFile: 'default'
                    });
                }
            });
        }
    },

    invite: function (req, res) {
        if (!validateUserSession(req) || !req.session.volunteer) {
            log('INVITE: Invalid volunteer session');
            res.cookie('invite_redirect', 'true', {
                maxAge: 90000,
                signed: true
            });
            res.redirect('/volunteer');
        } else if (typeof req.query.id !== 'string') {
            log('INVITE: No query string id field specified');
            res.send(400);
        } else {
            var teamId = req.query.id;
            var query = { team: teamId };

            volunteers.find(query, projection).toArray(function (err, docs) {
                if (err) {
                    log('INVITE: Error querying for volunteers:\n\n\t%s\n', err);
                    res.send(400);
                } else {
                    res.render('team-invite', {
                        title: 'Volunteer Team Invite',
                        volunteer: req.session.volunteer,
                        team: {
                            _id: teamId,
                            members: docs
                        },
                        _layoutFile: 'default'
                    });
                }
            });
        }
    },

    join: function (req, res) {
        var teamId = req.query.id;

        if (!validateUserSession(req) || !req.session.volunteer) {
            log('JOIN: Invalid volunteer session');
            res.cookie('invite_redirect', true, {
                maxAge: 90000,
                signed: true
            });
            res.redirect('/volunteer');
        } else if (typeof teamId !== 'string') {
            log('JOIN: Team id field was not specified', function (err) {
                res.send(400, err);
            });
            res.send(400);
        } else if (teamId === req.session.volunteer.team) {
            log('JOIN: Already member of:\n\n\t%s\n', teamId, function (err) {
                res.send(400, err);
            });
        } else {
            /** Make sure there is at least one member of this team. */
            volunteers.count({ team: teamId }, function (err, count) {
                if (err) {
                    var fmt = 'JOIN: Error getting member count: \n\n\t%s\n';
                    log(fmt, err, function (err) {
                        res.send(400, err);
                    });
                    res.send(400);
                }
                else if (count < 1) {
                    log('JOIN: Invalid team id');
                    res.send(400);
                } else {
                    var query = { _id: req.session.volunteer._id };
                    var cmd = { $set: { team: teamId } };
                    var opt = { w: 1 };

                    /** Update the volunteer account with the new team id */
                    volunteers.update(query, cmd, opt, function (err, result) {
                        if (err || !result) {
                            log('JOIN: Error updating team id');
                            res.send(400);
                        } else {
                            req.session.volunteer.team = teamId;
                            res.redirect('/volunteer/team');
                        }
                    });
                }
            });
        }
    },

    leave: function (req, res) {
        var teamId = req.query.id;

        if (!validateUserSession(req) || !req.session.volunteer) {
            log('LEAVE: Invalid volunteer session');
            res.cookie('invite_redirect', true, {
                maxAge: 90000,
                signed: true
            });
            res.redirect('/volunteer');
        } else if (typeof teamId !== 'string') {
            log('LEAVE: Team field was not specified', function (err) {
                res.send(400, err);
            });
        } else if (teamId !== req.session.volunteer.team) {
            var fmt = 'LEAVE: Team id \'%s\' does not match current team id';
            log(fmt, teamId, function (err) {
                res.send(400, err);
            });
        } else {
            volunteers.count({ team: teamId }, function (err, count) {
                if (err) {
                    var fmt = 'LEAVE: Error getting member count:\n\n\t%\n';
                    log(fmt, err, function (err) {
                        res.send(400, err);
                    });
                } else if (count < 2) {
                    err = 'LEAVE: Cant leave team with a single member';
                    log(err, function (err) {
                        res.send(400, err);
                    });
                } else {
                    var volunteerId = req.session.volunteer._id;
                    var newTeamId = uuid.v4();

                    var query = { _id: volunteerId, team: teamId };
                    var cmd = { $set: { team: newTeamId } };
                    var opt = { w: 1 };

                    volunteers.update(query, cmd, opt, function (err, result) {
                        var fmt;
                        if (err || !result) {
                            fmt = 'LEAVE: Error updating record:\n\n\t%s\n';
                            log(fmt, err, function (err) {
                                res.send(400, err);
                            });
                        } else {
                            fmt = 'LEAVE: Volunteer \'%s\' %s team:\n\n\t%s\n';
                            log(fmt, volunteerId, 'left', teamId);
                            log(fmt, volunteerId, 'joined', newTeamId);

                            req.session.volunteer.team = newTeamId;
                            res.redirect('/volunteer/team');
                        }
                    });
                }
            });
        }
    }
};
