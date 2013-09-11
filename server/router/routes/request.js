'use strict';

var dbman = require('../../dbman');
var emailer = require('../../emailer');

var debug = require('../../../debug');
var log = debug.getLogger({ prefix: '[route.request]-  ' });

module.exports = {

    get: function (req, res) {
        res.render('request', {
            title: 'Job Site Request Form',
            _layoutFile: 'default'
        });
    },

    post: function (req, res) {
        var record = req.body;

        dbman.submitRequest(record, function (error) {
            if (error) {
                log('Error posting job request -- %s', error);
                res.send(400);
            } else {

                var emailOptions = {
                    to: record.email,
                    subject: 'Job Request Confirmation',
                    template: 'request',
                    locals: { user: record }
                };

                emailer.send(emailOptions, function (error) {
                    if (!error) res.send('ok', 200);
                    else res.send(400);
                });
            }
        });
    },

    success: function (req, res) {
        res.render('heroMessage', {
            title: 'Job Request Submitted',
            header: 'Job Request Submitted',
            message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('heroMessage', {
            title: 'Submission Failed',
            header: 'Sorry!',
            message: 'There was a problem submitting your job request. Please try again later.',
            _layoutFile: 'default'
        });
    }

};
