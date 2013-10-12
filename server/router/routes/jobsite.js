'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');

var log = debug.getLogger({ prefix: '[route.jobsite]-  ' });
var jobsites = dbman.getCollection('jobsites');

module.exports = {
    request: {
        get: function (req, res) {
            res.render('jobsite-request', {
                title: 'Job Site Request',
                _layoutFile: 'default'
            });
        },

        post: function (req, res) {
            var record = req.body;
            var options = { w: 1 };
            
            record.formattedAddress = util.format('%s %s, %s %s',
                record.address, record.city, record.state, record.zip);

            jobsites.insert(record, options, function (err) {
                if (err) {
                    log('POST: Error inserting record:\n\n%s\n\n', err);
                    res.send(400);
                } else {
                    emailer.send({
                        to: record.email,
                        subject: 'Job Request Confirmation',
                        template: 'jobsite-request',
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
                title: 'Jobsite Request Submitted',
                header: 'Jobsite Request Submitted',
                message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Submission Failed',
                header: 'Sorry!',
                message: 'There was a problem submitting your jobsite request. Please try again later.',
                _layoutFile: 'default'
            });
        }
    },

    evaluation: {
        get: function (req, res) {
            res.render('jobsite-evaluation', {
                title: 'Job Site Evaluation',
                _layoutFile: 'default'
            });
        },

        post: function (req, res) {
            res.send('ok', 200);
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Jobsite Evaluation Submitted',
                header: 'Jobsite Evaluation Submitted',
                message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Submission Failed',
                header: 'Sorry!',
                message: 'There was a problem submitting your jobsite evaluation. Please try again later.',
                _layoutFile: 'default'
            });
        }
    }

};
