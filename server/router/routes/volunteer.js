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

    geocoder.send(geoQuery, function (err, response) {
        if (err) {
            callback(err);
            return;
        }

        var result = response.results[0];
        data.team = uuid.v4();
        data.location = result.geometry.location;
        data.formattedAddress = result.formatted_address;

        var query = { _id: id };
        var cmd = {
            $set: {
                role: 'volunteer',
                volunteer: data
            }
        };
        var opt = { w: 1, new: true };

        users.findAndModify(query, null, cmd, opt, function (err, updated) {
            if (err || !updated) {
                log('Error updating user document:\n\n%s\n\n', err);
                callback(err);
            } else {
                log('Successfully updated user document');
                log('Updating user session');
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
                title: 'Volunteer Registration'
            });
        }
    },

    post: function (req, res) {
        var userId = req.session.user._id;
        updateUserDocument(req, res, userId, function (err, doc) {
            if (err) {
                res.send(400);
            } else {
                emailer.send({
                    to: doc.email,
                    subject: 'Volunteer Account Registration',
                    template: 'volunteer',
                    locals: { user: doc }
                });
                _.merge(req.session.user, doc);
                res.send(200, 'ok');
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Successful Registration',
            header: 'Thanks!',
            message: 'You should receive an e-mail confirming your registration was successful. Thank you for volunteering to serve your Auburn community through Big Event.'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Registration Failed',
            header: 'Sorry!',
            message: 'There was a problem with the registration. Please try again later.'
        });
    },

    account: {
        get: function (req, res) {
            res.render('volunteer-account', {
                title: 'Volunteer Control Panel',
                user: req.session.user
            });
        },

        post: function (req, res) {
            var userId = req.session.user._id;
            updateUserDocument(req, res, userId, function (err, doc) {
                if (err) {
                    res.send(400);
                } else {
                    emailer.send({
                        to: doc.email,
                        subject: 'Volunteer Account Update',
                        template: 'volunteer-account',
                        locals: { user: doc }
                    });
                    _.merge(req.session.user, doc);
                    res.send(200, 'ok');
                }
            });
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Successfully Updated',
                header: 'Thanks!',
                message: 'You have successfully updated your data. You should receive an e-mail confirmation as well. Thank you for volunteering to serve your Auburn community through Big Event.'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Registration Failed',
                header: 'Sorry!',
                message: 'There was a problem updating your data. Please try again later.'
            });
        },

        delete: function (req, res) {
            var query = { _id: req.session.user._id };
            var cmd = {
                $unset: { volunteer: '' },
                $set: { role: 'user' }
            };
            var opt = { w: 1 };

            users.update(query, cmd, opt, function (err) {
                if (err) {
                    res.render('hero-unit', {
                        title: 'Volunteer Account Removal Failed',
                        header: 'Sorry!',
                        message: 'There was a problem removing your account data at this time. Please try again later.'
                    });
                } else {
                    res.render('hero-unit', {
                        title: 'Volunteer Account Removed',
                        header: 'Volunteer Account Removed',
                        message: 'Your volunteer account data was successfully deleted and you are no longer registered to volunteer on the day of the event. Thank you for your interest in Big Event and in serving your Auburn community. You can register again '
                    });
                    req.session.role = 'user';
                    delete req.session.user.volunteer;
                }
            });
        },
        
        staff: {
            get: function (req, res) {
                var id = req.params.id;
                var query = { _id: id };
                users.findOne(query, function(err, doc) {
                    if (err) {
                        log('STAFF.GET: Error querying users collection');
                        res.send(400);
                    } else if (!doc) {
                        log('STAFF.GET: Record not found for id %s', id);
                        res.render('hero-unit', {
                            title: 'Volunteer Not Found',
                            header: 'Volunteer Not Found',
                            message: 'No volunteer with id ' + id + ' could be found in the database.'
                        });
                    } else {
                        log('STAFF.GET: Record found');
                        res.render('volunteer-account', {
                            title: 'Volunteer Account',
                            user: doc
                        });
                    }
                });
            },

            post: function (req, res) {
                var userId = req.params.id;
                updateUserDocument(req, res, userId, function (err, doc) {
                    if (err) {
                        res.send(400);
                    } else {
                        emailer.send({
                            to: doc.email,
                            subject: 'Volunteer Account Update',
                            template: 'volunteer-account',
                            locals: { user: doc }
                        });
                        res.send(200, 'staff');
                    }
                });
            },

            delete: function (req, res) {
                res.send(200);
            },
        }
    }
};
