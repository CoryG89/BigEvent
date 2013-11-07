'use strict';

var uuid = require('node-uuid');
var dbman = require('../../dbman');

var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[route.team]-  '});

var users = dbman.getCollection('users');

function validateUserSession(req) {
    return typeof req.session.user === 'object' &&
        typeof req.session.user.role === 'string';
}

var projection = {
    $project: {
        email: '$email',
        firstName: '$volunteer.firstName',
        lastName: '$volunteer.lastName',
        gender: '$volunteer.gender'
    }
};

module.exports = {

    get: function (req, res) {

        if (!validateUserSession(req)) {
            log('Could not validate user session, access denied');
            res.redirect('/access-denied');
        } else if (!res.locals.isStaff && !req.session.user.volunteer) {
            log('No staff or volunteer session detected');
            res.redirect('/access-denied');
        } else {
            if (!res.locals.isStaff) {
                if (!req.params.id) {
                    res.redirect(req.path + '/' + req.session.user.volunteer.team);
                    return;
                } else if (req.params.id !== req.session.user.volunteer.team) {
                    res.redirect('/access-denied');
                    return;
                }
            }
            var teamId = req.params.id;
            var currentTeam = { 'volunteer.team': teamId };
            var query = { $match:  currentTeam };

            users.aggregate(query, projection, function (err, docs) {
                if (err) {
                    log('Error querying for volunteers:\n\n\t%s\n', err);
                    res.send(400);
                } else {
                    res.render('team', {
                        title: 'Volunteer Team',
                        volunteer: req.session.user.volunteer,
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
        if (!validateUserSession(req)) {
            log('INVITE: Invalid volunteer session');
            res.cookie('signin_redirect', '/volunteer', { maxAge: 90000 });
            res.cookie('volunteer_redirect', req.url, { maxAge: 90000 });
            res.redirect('/signin');
        } else if (req.session.user.volunteer === 'undefined') {
            req.cookie('volunteer_redirect', req.url, { maxAge: 90000 });
            res.redirect('/volunteer');
        } else if (typeof req.query.id !== 'string') {
            log('INVITE: No query string id field specified');
            res.send(400);
        } else {
            var teamId = req.query.id;
            var inviteTeam = { 'volunteer.team': teamId };
            var query = { $match: inviteTeam };

            users.aggregate(query, projection, function (err, docs) {
                if (err) {
                    log('INVITE: Error querying for volunteers:\n\n\t%s\n', err);
                    res.send(400);
                } else {
                    res.render('team-invite', {
                        title: 'Volunteer Team Invite',
                        volunteer: req.session.user.volunteer,
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
        var newTeamId = req.query.id;
        
        if (typeof req.session.user.volunteer === 'undefined') {
            log('JOIN: Invalid volunteer session');
            res.cookie('volunteer_redirect', true, { maxAge: 90000 });
            res.redirect('/volunteer');
        } else if (typeof newTeamId !== 'string') {
            log('JOIN: Team id field was not specified', function (err) {
                res.send(400, err);
            });
            res.send(400);
        } else if (newTeamId === req.session.user.volunteer.team) {
            var fmt = 'JOIN: Already a member of the team:\n\n\t%s\n';
            log(fmt, newTeamId, function (err) {
                res.send(400, err);
            });
        } else {
            var newTeamData = { 'volunteer.team': newTeamId };
            /** Make sure there is at least one member of this team. */
            users.count(newTeamData, function (err, count) {
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
                    var query = { _id: req.session.user._id };
                    var cmd = { $set: newTeamData };
                    var opt = { w: 1 };

                    /** Update the volunteer account with the new team id */
                    users.update(query, cmd, opt, function (err, result) {
                        if (err || !result) {
                            log('JOIN: Error updating team id');
                            res.send(400);
                        } else {
                            log('JOIN: Joined new team \'%s\'', newTeamId);
                            req.session.user.volunteer.team = newTeamId;
                            res.redirect('/volunteer/team');
                        }
                    });
                }
            });
        }
    },

    leave: function (req, res) {
        var currentTeamId = req.query.id;

        if (typeof req.session.user.volunteer === 'undefined')  {
            res.redirect('/volunteer');
        } else if (typeof currentTeamId !== 'string') {
            log('LEAVE: Team field was not specified', function (err) {
                res.send(400, err);
            });
        } else if (currentTeamId !== req.session.user.volunteer.team) {
            var fmt = 'LEAVE: Team id \'%s\' does not match current team id';
            log(fmt, currentTeamId, function (err) {
                res.send(400, err);
            });
        } else {
            var currentTeamData = { 'volunteer.team': currentTeamId };
            users.count(currentTeamData, function (err, count) {
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
                    var userId = req.session.user._id;
                    var newTeamId = uuid.v4();
                    var newTeamData = { 'volunteer.team': newTeamId };
                    var query = { _id: userId };
                    var cmd = { $set: newTeamData };
                    var opt = { w: 1 };

                    users.update(query, cmd, opt, function (err, result) {
                        var fmt;
                        if (err || !result) {
                            fmt = 'LEAVE: Error updating record:\n\n\t%s\n';
                            log(fmt, err, function (err) {
                                res.send(400, err);
                            });
                        } else {
                            fmt = 'LEAVE: Volunteer \'%s\' %s team:\n\n\t%s\n';
                            log(fmt, userId, 'left', currentTeamId);
                            log(fmt, userId, 'joined', newTeamId);
                            req.session.user.volunteer.team = newTeamId;
                            res.redirect('/volunteer/team');
                        }
                    });
                }
            });
        }
    }
};
