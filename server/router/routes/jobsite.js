'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');
var config = require('../../../config');

var log = debug.getLogger({ prefix: '[route.jobsite]-  ' });
var jobsites = dbman.getCollection('jobsites');
var ObjectId = dbman.getObjectId();

var jobsitesNeedApproval = config.jobsitesNeedApprovalBeforeEvaluation;
var maxJobsiteClaims = config.jobsiteClaimsPerEvaluator || 10;

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
            if (data.email !== data.emailConf) {
                log('Email does not match email confirmation');
                res.send('Error', 400);
                return;
            } else {
                delete data.emailConf;
            }
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
            if (!jobsitesNeedApproval) {
                res.redirect('staff/jobsite/' + id + '/evaluation');
                return;
            }
            var query = {
                _id: new ObjectId(id),
                status: 'preliminary'
            };
            var cmd = { $set: { status: 'active' } };
            var opt = { w: 1 };
            jobsites.update(query, cmd, opt, function (err, result) {
                if (err) {
                    log('Error updating jobsite:\n\n%s\n\n', err);
                    res.send(400);
                } else if (!result) {
                    log('Could not find specified jobsite \'%s\'', id);
                    res.send(400);
                } else {
                    log('Jobsite approved, document successfully updated');
                    res.redirect('staff/jobsite/' + id);
                }
            });
        });
    },

    claim: function (req, res) {
        processId(req, res, function (id) {
            var _id = new ObjectId(id);
            var userId = req.session.user._id;
            var query = {
                status: 'claimed',
                claimedBy: userId
            };
            jobsites.count(query, function (err, count) {
                if (err) {
                    log('Error querying jobsites collection:\n\n%s\n\n', err);
                    res.send(400);
                } else if (count >= maxJobsiteClaims) {
                    log('Max jobsites already claimed: %d', maxJobsiteClaims);
                    res.send(400, 'max-claim-limit');
                } else {
                    var query = {
                        _id: _id,
                        status: 'active'
                    };
                    var cmd = {
                        $set: {
                            status: 'claimed',
                            claimedBy: userId
                        }
                    };
                    var opt = { w: 1 };
                    jobsites.update(query, cmd, opt, function (err, result) {
                        if (err) {
                            log('Error updating jobsite:\n\n%s\n\n', err);
                            res.send(400);
                        } else if (!result) {
                            log('Could not find specified jobsite \'%s\'', id);
                            res.send(400);
                        } else {
                            log('Successfully updated jobsite document');
                            res.redirect('staff/jobsite/' + id);
                        }
                    });
                }
            });
        });
    },

    unclaim: function (req, res) {
        processId(req, res, function (id) {
            var query = {
                _id: new ObjectId(id),
                status: 'claimed',
                claimedBy: req.session.user._id
            };
            var cmd = {
                $set: {
                    status: 'active'
                },
                $unset: {
                    claimedBy: ''
                }
            };
            var opt = { w: 1 };
            jobsites.update(query, cmd, opt, function (err, result) {
                if (err) {
                    log('Error querying jobsites collection:\n\n%s\n\n', err);
                    res.send(400);
                } else if (!result) {
                    log('No claimed jobsite with id \'%s\' was found', id);
                    res.send(400);
                } else {
                    log('Successfully updated jobsite document');
                    res.redirect('staff/jobsite/' + id);
                }
            });
        });
    },

    delete: function (req, res) {
        res.send(200);
    }

};
