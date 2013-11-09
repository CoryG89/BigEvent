'use strict';

var util = require('util');
var _ = require('lodash');
var uuid = require('node-uuid');
var dbman = require('../../dbman');
var emailer = require('../../emailer');
var geocoder = require('../../geocoder');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.volunteer]-  '});
var users = dbman.getCollection('users');

function updateUserDocument(req, res, id, callback) {
    var data = req.body;

    var geoQuery = util.format('%s %s, %s %s',
        data.address, data.city, data.state, data.zip);

    geocoder.send(geoQuery, function (response) {
        var result = response.results[0];
        data.team = uuid.v4();
        data.location = result.geometry.location;
        data.formattedAddress = result.formatted_address;

        var volunteerData = {
            role: 'volunteer',
            volunteer: data
        };

        var query = { _id: id };
        var cmd = { $set: volunteerData };
        var opt = { w: 1, new: true };

        users.findAndModify(query, null, cmd, opt, function (err, updated) {
            if (err || !updated) {
                log('POST: Error updating user document:\n\n%s\n\n', err);
                callback(err);
            } else {
                log('POST: Successfully updated user document');
                log('POST: Updating user session');
                if (id === req.session.user._id)
                    _.merge(req.session.user, updated);
                callback(null, updated);
            }
        });
    });
}

module.exports = {

    get: function (req, res) {
        if (req.session.user.volunteer) {
            var path = '/volunteer/account';
            log('GET: Volunteer session detected, redirecting to: %s', path);
            res.redirect(path);
        } else {
            res.render('volunteer', {
                title: 'Volunteer Registration',
                _layoutFile: 'default'
            });
        }
    },

    post: function (req, res) {
        var userId = req.session.user._id;
        updateUserDocument(req, res, userId, function (err) {
            if (err) {
                res.send(400);
            } else {
                emailer.send({
                    to: req.session.user.email,
                    subject: 'Volunteer Account Registration',
                    template: 'volunteer',
                    locals: {
                        user: req.session.user,
                        volunteer: req.session.user.volunteer
                    }
                });
                res.send(200, 'ok');
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Successful Registration',
            header: 'Thanks!',
            message: 'You should receive an e-mail confirming your registration was successful. Thank you for volunteering to serve your Auburn community through Big Event.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Registration Failed',
            header: 'Sorry!',
            message: 'There was a problem with the registration. Please try again later.',
            _layoutFile: 'default'
        });
    },

    account: {
        get: function (req, res) {

            res.render('volunteer-account', {
                title: 'Volunteer Control Panel',
                _layoutFile: 'default',
                user: req.session.user,
                volunteer: req.session.user.volunteer
            });
        },

        post: function (req, res) {
            var userId = req.session.user._id;
            updateUserDocument(req, res, userId, function (err, userData) {
                if (err) {
                    res.send(400);
                } else {
                    emailer.send({
                        to: req.session.user.email,
                        subject: 'Volunteer Account Update',
                        template: 'volunteer-account',
                        locals: {
                            user: userData,
                            volunteer: userData.volunteer
                        }
                    });
                    res.send(200, 'ok');
                }
            });
        },
        
        staff: {
            get: function (req, res) {
                users.findOne({_id: req.params.id}, function(err, record) {
                    if(err || !record) {
                        log('STAFF.GET: Record not found for id %s', req.params.id);
                        res.render('hero-unit', {
                            title: 'Volunteer Not Found',
                            header: 'Volunteer Not Found',
                            message: 'No volunteer with id ' + req.params.id + ' could be found in the database.',
                            _layoutFile: 'default'
                        });
                    } else {
                        log('STAFF.GET: Record found');
                        res.render('volunteer-account', {
                            title: 'Volunteer Account',
                            user: record,
                            volunteer: record.volunteer,
                            _layoutFile: 'default'
                        });
                    }
                });
            },

            post: function (req, res) {
                var userId = req.params.id;

                updateUserDocument(req, res, userId, function (err, userData) {
                    if (err) {
                        res.send(400);
                    } else {
                        emailer.send({
                            to: userData.email,
                            subject: 'Volunteer Account Update',
                            template: 'volunteer-account',
                            locals: {
                                user: userData,
                                volunteer: userData.volunteer
                            }
                        });
                        res.send(200, 'staff');
                    }
                });
            },

            delete: function (req, res){
                res.send(200);
            },
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Successfully Updated',
                header: 'Thanks!',
                message: 'You have successfully updated your data. You should receive an e-mail confirmation as well. Thank you for volunteering to serve your Auburn community through Big Event.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Registration Failed',
                header: 'Sorry!',
                message: 'There was a problem updating your data. Please try again later.',
                _layoutFile: 'default'
            });
        },

        delete: function (req, res) {
            res.send(200);
        }
    }
};
