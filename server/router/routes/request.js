'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');

var log = debug.getLogger({ prefix: '[route.request]-  ' });
var requests = dbman.getCollection('requests');

module.exports = {

    get: function (req, res) {
        res.render('request', {
            title: 'Job Site Request Form',
            _layoutFile: 'default'
        });
    },

    post: function (req, res) {
        var record = req.body;
        var options = { w: 1 };
        requests.insert(record, options, function (err) {
            if (err) {
                log('POST: Error inserting record:\n\n%s\n\n', err);
                res.send(400);
            } else {
                emailer.send({
                    to: record.email,
                    subject: 'Job Request Confirmation',
                    template: 'request',
                    locals: { user: record }
                }, function (err) {
                    if (err) res.send(400);
                    else res.send('ok', 200);
                });
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Job Request Submitted',
            header: 'Job Request Submitted',
            message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Submission Failed',
            header: 'Sorry!',
            message: 'There was a problem submitting your job request. Please try again later.',
            _layoutFile: 'default'
        });
    }

};
