'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');
var geocoder = require('../../geocoder');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.volunteer]-  '});

module.exports = {

    get: function (req, res) {
        if (req.session.user.eventData)
            res.redirect('/volunteer/control-panel');
        else
            res.render('volunteer', {
                title: 'Volunteer',
                user: req.session.user,
                _layoutFile: 'default'
            });
    },

    post: function (req, res) {
        var id = req.session.user._id;
        var body = req.body;

        var addressString = util.format('%s %s, %s %s',
            body.address, body.city, body.state, body.zip);

        geocoder.send(addressString, function (data) {
            var obj = JSON.parse(data);
            var topResult = obj.results[0];

            body.location = topResult.geometry.location;
            body.formattedAddress = topResult.formatted_address;

            dbman.update(id, { eventData: body }, function (error, record) {
                if (error) {
                    log('post: Error -- %s', error);
                    res.send(400);
                } else {
                    req.session.user = record;
                    
                    var emailOptions = {
                        to: record.wlData.emails.account,
                        subject: 'Volunteer Registration Confirmation',
                        template: 'volunteer',
                        locals: { user: record }
                    };

                    emailer.send(emailOptions, function () {

                    });
                    res.send('ok', 200);
                }
            });
        });
    },

    success: function (req, res) {
        res.render('heroMessage', {
            title: 'Successful Registration',
            header: 'Thanks!',
            message: 'You should receive an e-mail confirming your registration was successful. Thank you for volunteering to serve your Auburn community through Big Event.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('heroMessage', {
            title: 'Registration Failed',
            header: 'Sorry!',
            message: 'There was a problem with the registration. Please try again later.',
            _layoutFile: 'default'
        });
    },

    controlPanel: {
        get: function (req, res) {
            res.render('control-panel', {
                title: 'Volunteer Control Panel',
                user: req.session.user,
                _layoutFile: 'default'
            });
        },

        post: function () {

        }
    }
};
