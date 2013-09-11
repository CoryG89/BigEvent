'use strict';

var https = require('https');
var util = require('util');

var dbman = require('../../dbman');
var emailer = require('../../emailer');

var debug = require('../../../debug');
var log = debug.getLogger({ prefix: '[route.volunteer]-  '});

var mapsUri = 'https://maps.googleapis.com/maps/api/geocode/json';

module.exports = {

    get: function (req, res) {
        res.render('volunteer', {
            title: 'Volunteer',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    post: function (req, res) {
        var id = req.session.user._id;
        var body = req.body;

        var formattedAddress = util.format('%s %s, %s %s',
            body.address, body.city, body.state, body.zip);

        var addressString = encodeURIComponent(formattedAddress);

        var uri = util.format('%s?address=%s&sensor=false', mapsUri, addressString);

        https.get(uri, function (response) {
            var data = '';

            response.on('data', function (chunk) {
                data += chunk;
            });

            response.on('end', function () {
                var obj = JSON.parse(data);
                body.location = obj.results[0].geometry.location;
                body.formattedAddress = obj.results[0].formatted_address;

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
    }
};
