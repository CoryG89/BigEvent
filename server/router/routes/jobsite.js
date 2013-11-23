'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');
var config = require('../../../config');

var log = debug.getLogger({ prefix: '[route.jobsite]-  ' });
var jobsites = dbman.getCollection('jobsites');
var ObjectId = dbman.getObjectId();

function isObjectIdString(str) {
    return typeof str === 'string' && str.length === 24;
}

function processId(req, res, callback) {
    var id = req.params.id;
    if (isObjectIdString(id)) {
        callback(id);
    } else {
        log('The job id \'%s\' is invalid', id);
        res.send(400, 'invalid-id');
    }
}

module.exports = {

    get: function (req, res) {
        processId(req, res, function (id) {
            var query = { _id: new ObjectId(id) };

            jobsites.findOne(query, function (err, doc) {
                if (err) {
                    log('Error querying jobsites collection:\n\n%s\n\n', err);
                    res.send(400);
                } else {
                    res.render('jobsite-review', {
                        title: 'Jobsite Review',
                        user: req.session.user,
                        jobsite: doc
                    });
                }
            });
        });
    },

    post: function (req, res) {
        processId(req, res, function (id) {
            var data = req.body;

            if (typeof data === 'object') {
                var query = { _id: new ObjectId(id) };
                var cmd = { $set: data };
                var opt = { w: 1 };
                jobsites.update(query, cmd, opt, function (err) {
                    if (err) {
                        log('Error updating jobsite document:\n\n%s\n\n', err);
                        res.send(400);
                    } else {
                        log('Jobsite data modified, document successfully updated');
                        res.send(200);
                    }
                });
            }
        });
    },

    approve: function (req, res) {
        processId(req, res, function (id) {
            if (!config.jobsitesNeedApprovalBeforeEvaluation) {
                res.redirect('staff/jobsite/' + id + '/evaluation');
                return;
            }
            var data = { status: 'active' };
            var query = { _id: new ObjectId(id) };
            var cmd = { $set: data };
            var opt = { w: 1 };
            jobsites.update(query, cmd, opt, function (err) {
                if (err) {
                    res.send(400);
                } else {
                    log('Jobsite approved, document successfully updated');
                    res.send(200);
                }
            });
        });
    },

    claim: function (req, res) {
        processId(req, res, function (id) {
            var _id = new ObjectId(id);
            var query = { claimedBy: _id };
            jobsites.count(query, function (err, count) {
                if (err) {
                    res.send(400);
                } else if (count >= config.jobsiteMaxClaimsPerEvaluator) {
                    res.send(400, 'max-claim-limit');
                } else {
                    var data = { status: true };
                    var query = { _id: _id };
                    var cmd = { $set: data };
                    var opt = { w: 1 };
                    jobsites.update(query, cmd, opt, function (err) {
                        if (err) {
                            res.send(400);
                        } else {
                            res.send(200);
                        }
                    });
                }
            });
        });
    },

    delete: function (req, res) {
        res.send(200);
    }

};
