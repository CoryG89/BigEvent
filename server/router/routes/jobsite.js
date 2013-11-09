'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');

var log = debug.getLogger({ prefix: '[route.jobsite]-  ' });
var jobsites = dbman.getCollection('jobsites');
var zipsCollection = dbman.getCollection('zips');

var ObjectId = dbman.getObjectId();

module.exports = {
    request: {
        get: function (req, res) {
            res.render('jobsite-request', {
                title: 'Job Site Request'
            });
        },

        post: function (req, res) {
            var record = req.body;
            var query = { _id: '1z2i3p4s5'};
            zipsCollection.findOne(query, function(err, zipDoc) {
                if(err || !zipDoc){
                    log('POST: Could not get zip codes');
                    res.send('Error', 400);
                } else {
                    // verify the zip code
                    var zipArray = zipDoc.zips;
                    if (zipArray.indexOf(record.zip) === -1) {
                        var zipString = zipArray.join(', ');
                        res.send('Currently accepted zip codes are: ' + zipString.substr(0, zipString.length - 2), 400);
                    } else {
                        log('POST: saving job site request data');
                        // insert record
                        var options = { w: 1 };
                        
                        record.formattedAddress = util.format('%s %s, %s %s',
                            record.address, record.city, record.state, record.zip);

                        jobsites.insert(record, options, function (err) {
                            if (err) {
                                log('POST: Error inserting record:\n\n%s\n\n', err);
                                res.send('Error', 400);
                            } else {
                                emailer.send({
                                    to: record.email,
                                    subject: 'Job Request Confirmation',
                                    template: 'jobsite-request',
                                    locals: { user: record }
                                }, function (err) {
                                    if (err) res.send('Error', 400);
                                    else res.send('ok', 200);
                                });
                            }
                        });
                    }
                }
            });
        },

        staff : {
            post: function(req, res){
                var record = req.body;
                var query = { _id: '1z2i3p4s5'};
                zipsCollection.findOne(query, function(err, zipDoc) {
                    if (err || !zipDoc) {
                        log('Could not get Zip Codes');
                        res.send('Staff', 400);
                    } else {
                        // verify the zip code
                        var zipArray = zipDoc.zips;
                        if (zipArray.indexOf(record.zip) === -1) {
                            var zipString = zipArray.join(', ');
                            res.send('Currently accepted zip codes are: ' + zipString.substr(0, zipString.length - 2), 400);
                        } else {
                            //insert record
                            var options = { w: 1 };
                            
                            record.formattedAddress = util.format('%s %s, %s %s',
                                record.address, record.city, record.state, record.zip);

                            jobsites.insert(record, options, function (err, records) {
                                if (err) {
                                    log('POST: Error inserting record:\n\n%s\n\n', err);
                                    res.send('Staff', 400);
                                } else {
                                    emailer.send({
                                        to: record.email,
                                        subject: 'Job Request Confirmation',
                                        template: 'jobsite-request',
                                        locals: { user: record }
                                    }, function (err) {
                                        if (err) res.send('Staff', 400);
                                        else res.send({id: records[0]._id}, 200);
                                    });
                                }
                            });
                        }
                    }
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
    },

    evaluation: {
        get: function (req, res) {
            var id = req.params.id;
            jobsites.findOne({_id: new ObjectId(id)}, function(err, record){
                if(err){
                    log('JOBSITE.EVALUATION.GET: Error getting jobsite: %s', err);
                    res.render('hero-unit', {
                        title: 'Error',
                        header: 'Sorry!',
                        message: 'There was a problem retrieving the jobsite from the database. Please try again later.'
                    });
                }
                else if(!record){
                    log('JOBSITE.EVALUATION.GET: Jobsite not found', err);
                    res.render('hero-unit', {
                        title: 'Error',
                        header: 'Sorry!',
                        message: 'Jobsite not found in the database. Please try again later.'
                    });
                }
                else{
                    log('JOBSITE.EVALUATION.GET: Jobsite Found.');
                    res.render('jobsite-evaluation', {
                        title: 'Job Site Evaluation',
                        jobRequest: record
                    });
                }
            });
        },

        post: function (req, res) {
            res.send('ok', 200);
        },

        delete: function (req, res){
            res.send(200);
        },
        
        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Jobsite Evaluation Submitted',
                header: 'Jobsite Evaluation Submitted',
                message: 'You should receive an e-mail confirmation verifying that your submission was successfully received.'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Submission Failed',
                header: 'Sorry!',
                message: 'There was a problem submitting your jobsite evaluation. Please try again later.'
            });
        }
    }
};
