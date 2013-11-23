'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');
var geocoder = require('../../geocoder');

var config = require('../../../config');
var log = debug.getLogger({ prefix: '[route.jobsite]-  ' });
var jobsites = dbman.getCollection('jobsites');
var zips = dbman.getCollection('zips');

var needApproval = config.jobsitesNeedApprovalBeforeEvaluation;

function addJobsite (req, res, callback) {
    var record = req.body;
    var query = { _id: '1z2i3p4s5'};
    zips.findOne(query, function(err, zipDoc) {
        if(err || !zipDoc){
            zipDoc = { zips: config.defaultAllowedZipCodes };
        }
        // verify the zip code
        var zipArray = zipDoc.zips;
        if (zipArray.indexOf(record.zip) === -1) {
            var zipString = zipArray.join(', ');
            res.send('Currently accepted zip codes are: ' + zipString, 400);
        } else {
            log('POST: saving job site request data');
            // insert record
            var options = { w: 1 };

            var query = util.format('%s %s, %s %s',
                record.address, record.city, record.state, record.zip);

            geocoder.send(query, function (err, response) {
                if (err) {
                    res.send('Error', 400);
                    return;
                }

                var result = response.results[0];
                record.location = result.geometry.location;
                record.formattedAddress = result.formatted_address;

                delete record.emailConf;
                
                record.evaluated = false;
                record.claimed = false;
                
                record.status = needApproval ? 'requested' : 'active';
                
                jobsites.insert(record, options, function (err, records) {
                    if (err) {
                        log('Error inserting record:\n\n%s\n\n', err);
                        res.send('Error', 400);
                    } else {
                        if (typeof callback === 'function') callback(records[0]);
                    }
                });
            });
        }
    });
}

module.exports = {
    get: function (req, res) {
        res.render('jobsite-request', {
            title: 'Job Site Request'
        });
    },

    post: function (req, res) {
        addJobsite(req, res, function (record) {
            emailer.send({
                to: record.email,
                subject: 'Job Request Confirmation',
                template: 'jobsite-request',
                locals: { user: record }
            }, function (err) {
                if (err) res.send('Error', 400);
                else res.send('ok', 200);
            });
        });
    },

    staff: {
        post: function(req, res) {
            addJobsite(req, res, function (record) {
                emailer.send({
                    to: record.email,
                    subject: 'Job Request Confirmation',
                    template: 'jobsite-request',
                    locals: { user: record }
                }, function (err) {
                    if (err) res.send('Staff', 400);
                    else res.send({ id: record._id }, 200);
                });
            });
        }
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Jobsite Request Submitted',
            header: 'Jobsite Request Submitted',
            message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Submission Failed',
            header: 'Sorry!',
            message: 'There was a problem submitting your jobsite request. Please try again later.'
        });
    }
};
