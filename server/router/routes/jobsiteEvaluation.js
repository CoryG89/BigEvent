'use strict';

var dbman = require('../../dbman');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.jobsiteEvaluation]-  '});

var ObjectId = dbman.getObjectId();
var jobsites = dbman.getCollection('jobsites');

var evalListingHeaders = [
    'Name', 'Email', 'Phone', 'Alt. Phone', 'Address', 'Description'
];

function jobsiteDocToRow(doc) {
    return {
        _id: doc._id,
        dataAttributes: [
            { name: 'lat', value: doc.location.lat },
            { name: 'lng', value: doc.location.lng }
        ],
        rowData: [
            doc.lastName + ', ' + doc.firstName, doc.email,
            doc.phone, doc.altPhone, doc.formattedAddress, doc.description
        ]
    };
}

function getEvalListingRows(callback) {
    jobsites.find({
        claimed: false,
        evaluated: false
    }).toArray(function (err, docs) {
        if (err) callback(err);
        else callback(null, docs.map(jobsiteDocToRow));
    });
}

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
    },

    listing: function (req, res) {
        getEvalListingRows(function (err, rows) {
            if (err) {
                log('Error getting jobsite evaluation listing');
                res.send(400);
            } else {
                res.render('jobsite-eval-listing', {
                    title: 'Jobsite Evaluation Listing',
                    table: {
                        title: 'Jobsite Evaluation Listing',
                        id: 'eval-listing-table',
                        headers: evalListingHeaders,
                        rows: rows,
                        linkField: 0,
                        linkPath: 'staff/jobsite/evaluation'
                    }
                });
            }
        });
    }
};
