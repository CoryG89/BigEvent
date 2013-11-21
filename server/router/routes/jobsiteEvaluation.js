'use strict';

var dbman = require('../../dbman');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.jobsiteEvaluation]-  '});

var ObjectId = dbman.getObjectId();
var jobsites = dbman.getCollection('jobsites');

module.exports = {
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
};
