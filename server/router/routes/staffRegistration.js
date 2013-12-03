'use strict';

var _ = require('lodash');
var dbman = require('../../dbman');
var emailer = require('../../emailer');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.staffRegistration]-  '});
var users = dbman.getCollection('users');

var statusTypes = ['Approved', 'Declined', 'Finished Interview', 'Scheduled for Interview'];

function updateUserDocument(req, res, id, type, callback) {
    var data = req.body;

    var query = { _id: id };
    var roleMap = {
            role: type,
            status: req.session.user.status ? req.session.user.status : 3
        };
    roleMap[type] = data;
    var cmd = {
        $set: roleMap
    };
    var opt = { w: 1, new: true };

    users.findAndModify(query, null, cmd, opt, function (err, updated) {
        if (err || !updated) {
            log('POST: Error updating user document:\n\n%s\n\n', err);
            callback(err);
        } else {
            log('POST: Successfully updated user document');
            log('POST: Updating user session');
            callback(null, updated);
        }
    });
}

module.exports = {
    get: function (req, res)
    {
        log('GET');
        res.render('staffRegistration', {
            title: 'Registration Information'
        });
    },

    getForm: function (req, res) {
        var type = req.params.type;
        log('GETFORM: Form type: %s', type);
        if (req.session.user[type]) {
            var path = '/staffRegistration/review/' + type;
            log('GETFORM: registered staff detected, redirecting to: %s', path);
            res.redirect(path);
        } else if (req.session.user.committee || req.session.user.leadership || req.session.user.coordinator || req.session.user.volunteer){
            //getting here means we weren't registered under the type that was chosen but we are registered under one of the above types
            log('GETFORM: Already registred under a different type.');
            var officialName = '';
            if(req.session.user.committee) {
                officialName = 'Committee Member';
            } else if(req.session.user.leadership) {
                officialName = 'Leadership Team Member';
            } else if(req.session.user.coordinator) {
                officialName = 'Project Coordinator';
            } else if(req.session.user.volunteer) {
                officialName = 'Volunteer';
            }
            res.render('hero-unit', {
                title: 'Already Registered',
                header: 'You can only register once!',
                message: 'You have already registered as a ' + officialName + '. You can only register once.'
            });
        } else {
            log('GETFORM: No staff detected rendering form.');
            var title = '';
            if(type === 'committee') {
                title = 'Committee Member Registration';
            } else if(type === 'leadership') {
                title = 'Leadership Team Member Registration';
            } else if(type === 'coordinator') {
                title = 'Project Coordinator Registration';
            }
            res.render('staffRegistrationInfo', {
                title: title
            });
        }
    },

    post: function (req, res) {
        var userId = req.session.user._id;
        var type = req.params.type;

        updateUserDocument(req, res, userId, type, function (err, doc) {
            if (err) {
                log('POST: Error registring user. Error: %s', err);
                res.send(400);
            } else {
                log('POST: Successfully registered user. Sending Email....');
                var title = '';
                if(type === 'committee') {
                    title = 'Committee Member Registration';
                } else if(type === 'leadership') {
                    title = 'Leadership Team Member Registration';
                } else if(type === 'coordinator') {
                    title = 'Project Coordinator Registration';
                }
                emailer.send({
                    to: doc.email,
                    subject: title,
                    template: 'staffRegistration',
                    locals: {
                        user: doc,
                        userType: type,
                        userData: doc[type]
                    }
                });
                _.merge(req.session.user, doc);
                res.send(200, 'ok');
            }
        });
    },

    success: function (req, res) {
        log('SUCCESS');
        res.render('hero-unit', {
            title: 'Successful Registration',
            header: 'Thanks!',
            message: 'You should receive an e-mail confirming your registration was successful. Thank you for registering to be a staff memeber for Big Event.'
        });
    },

    failure: function (req, res) {
        log('FAILURE');
        res.render('hero-unit', {
            title: 'Registration Failed',
            header: 'Sorry!',
            message: 'There was a problem with the registration. Please try again later.'
        });
    },

    review: {
        get: function (req, res) {
            var type = req.params.type;
            var title = '';
            if(type === 'committee') {
                title = 'Committee Member Info';
            } else if(type === 'leadership') {
                title = 'Leadership Team Member Info';
            } else if(type === 'coordinator') {
                title = 'Project Coordinator Info';
            }
            res.render('staff-registration-review', {
                title: title,
                user: req.session.user,
                staffMember: req.session.user[type],
                type: type,
                status: statusTypes[req.session.user.status]
            });
        },

        post: function (req, res) {
            var userId = req.session.user._id;
            var type = req.params.type;
            updateUserDocument(req, res, userId, type, function (err, doc) {
                if (err) {
                    res.send(400);
                } else {
                    emailer.send({
                        to: doc.email,
                        subject: 'Staff Application Update',
                        template: 'staff-registration-review',
                        locals: {
                            user: doc,
                            staffMember: doc[type],
                            userType: type
                        }
                    });
                    _.merge(req.session.user, doc);
                    res.send(200, 'ok');
                }
            });
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Successfully Updated',
                header: 'Thanks!',
                message: 'You have successfully updated your data. You should receive an e-mail confirmation as well. Thank you for registering to be a Big Event Staff Member.'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Registration Failed',
                header: 'Sorry!',
                message: 'There was a problem updating your data. Please try again later.'
            });
        },

        delete: function (req, res) {
            var type = req.params.type;
            var query = { _id: req.session.user._id };
            var unsetMap = {};
            unsetMap[type] = '';
            var cmd = {
                $unset: unsetMap,
                $set: {
                    role: 'user'
                }
            };
            var opt = { w: 1 };

            users.update(query, cmd, opt, function (err, result) {
                if (err || !result) {
                    res.render('hero-unit', {
                        title: 'Staff Registration Removal Failed',
                        header: 'Sorry!',
                        message: 'There was a problem removing your registration data at this time. Please try again later.'
                    });
                } else {
                    res.render('hero-unit', {
                        title: 'Staff Registration Removed',
                        header: 'Staff Registration Removed',
                        message: 'Your staff registration data was successfully deleted and you are no longer registered for an interview. Thank you for your interest in Big Event and in serving your Auburn community.'
                    });
                    req.session.role = 'user';
                    delete req.session.user[type];
                }
            });
        },
        
        staff: {
            get: function (req, res) {
                var path = req.path;
                log('STAFF.GET: path: %s', path);
                var type = path.split('/')[2];
                log('STAFF.GET: type: %s', type);
                users.findOne({_id: req.params.id}, function(err, record) {
                    if(err || !record) {
                        log('STAFF.GET: Record not found for id %s', req.params.id);
                        res.render('hero-unit', {
                            title: 'Entry Not Found',
                            header: 'Entry Not Found',
                            message: 'No registered staff with id ' + req.params.id + ' could be found in the database.'
                        });
                    } else {
                        log('STAFF.GET: Record found');
                        var title = '';
                        if(type === 'committee') {
                            title = 'Committee Member Info';
                        } else if(type === 'leadership') {
                            title = 'Leadership Team Member Info';
                        } else if(type === 'coordinator') {
                            title = 'Project Coordinator Info';
                        }
                        res.render('staff-registration-review', {
                            title: title,
                            user: record,
                            staffMember: record[type],
                            type: type,
                            status: statusTypes[req.session.user.status]
                        });
                    }
                });
            },

            post: function (req, res) {
                var userId = req.params.id;
                var path = req.path;
                log('STAFF.GET: path: %s', path);
                var type = path.split('/')[2];
                log('STAFF.GET: type: %s', type);
                updateUserDocument(req, res, userId, type, function (err, doc) {
                    if (err) {
                        res.send(400);
                    } else {
                        emailer.send({
                            to: doc.email,
                            subject: 'Staff Application Update',
                            template: 'staff-registration-review',
                            locals: {
                                user: doc,
                                staffMember: doc[type],
                                userType: type
                            }
                        });
                        res.send(200, 'staff');
                    }
                });
            },

            delete: function (req, res) {
                var id = req.params.id;
                var path = req.path;
                log('STAFF.GET: path: %s', path);
                var type = path.split('/')[2];
                log('STAFF.GET: type: %s', type);
                var query = { _id: id};
                var unsetMap = {};
                unsetMap[type] = '';
                var cmd = {
                    $unset: unsetMap,
                    $set: {
                        role: 'user',
                        status: ''
                    }
                };
                var opt = { w: 1 };

                users.update(query, cmd, opt, function (err, result) {
                    if (err || !result) {
                        res.render('hero-unit', {
                            title: 'Staff Registration Removal Failed',
                            header: 'Sorry!',
                            message: 'There was a problem removing your registration data at this time. Please try again later.'
                        });
                    } else {
                        res.redirect('/staff/staffHomePage');
                    }
                });
            },
        }
    }
};
