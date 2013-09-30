'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');
var geocoder = require('../../geocoder');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.volunteer]-  '});
var users = dbman.getCollection('users');

module.exports = {

    get: function (req, res) {
        if (req.session.user.address) {
            res.redirect('/volunteer/account');
        }
        else {
            res.render('volunteer', {
                title: 'Volunteer',
                user: req.session.user,
                _layoutFile: 'default'
            });
        }
    },

    post: function (req, res) {
        var data = req.body;

        data.name = [data.first_name, data.last_name].join(' ');

        var address = util.format('%s %s, %s %s',
            data.address, data.city, data.state, data.zip);

        geocoder.send(address, function (response) {
            var result = response.results[0];

            data.location = result.geometry.location;
            data.formatted_address = result.formatted_address;

            var query = { _id: req.session.user._id };
            var cmd = { $set: data };
            var opt = { w: 1, new: true };

            users.findAndModify(query, null, cmd, opt, function (err, record) {
                if (err) {
                    log('POST: Error updating record:\n\n%s\n\n', err);
                    res.send(400);
                } else if (!record) {
                    log('POST: Record not found');
                    res.send(400);
                } else {
                    req.session.user = record;

                    emailer.send({
                        to: record.email,
                        subject: 'Volunteer Account Registration',
                        template: 'volunteer',
                        locals: { user: record }
                    }, function (err) {
                        if (err) res.send(400);
                        else res.send('ok', 200);
                    });
                }
            });
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
                user: req.session.user,
                _layoutFile: 'default'
            });
        },

        post: function (req, res) {
            var data = req.body;

            var address = util.format('%s %s, %s %s',
                data.address, data.city, data.state, data.zip);

            geocoder.send(address, function (response) {
                var result = response.results[0];

                data.location = result.geometry.location;
                data.formatted_address = result.formatted_address;
                
                var query = { _id: req.session.user._id };
                var cmd = { $set: data };
                var opt = { w: 1, new: true };

                users.findAndModify(query, null, cmd, opt, function (err, record) {
                    if (err) {
                        log('POST: Error updating record:\n\n%s\n\n', err);
                        res.send(400);
                    } else if (!record) {
                        log('POST: Record not found');
                        res.send(400);
                    } else {
                        log('POST: Updating user session');
                        req.session.user = record;

                        emailer.send({
                            to: record.email,
                            subject: 'Volunteer Account Update',
                            template: 'volunteer-changed',
                            locals: { user: record }
                        }, function (err) {
                            if (err) res.send(400);
                            else res.send('ok', 200);
                        });
                    }
                });
            });
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
        }
    }
};
