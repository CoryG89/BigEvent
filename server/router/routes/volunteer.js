'use strict';

var util = require('util');

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');
var geocoder = require('../../geocoder');
var debug = require('../../debug');

var log = debug.getLogger({ prefix: '[route.volunteer]-  '});

var users = dbman.getCollection('users');
var volunteers = dbman.getCollection('volunteers');

var ObjectId = dbman.getObjectId();

function updateSession (session, object) {
    if (typeof object === 'object') {
        for (var prop in object) {
            if (object.hasOwnProperty(prop))
                session[prop] = object[prop];
        }
    }
}

module.exports = {

    get: function (req, res) {
        if (req.session.volunteer) {
            log('GET: Volunteer session detected');
            log('GET: Redirecting to /volunteer/account');
            res.redirect('/volunteer/account');
        }
        else {
            res.render('volunteer', {
                title: 'Volunteer',
                user: req.session.user,
                staff: 0,
                _layoutFile: 'default'
            });
        }
    },

    post: function (req, res) {
        var data = req.body;

        data._id = req.session.user._id;
        data.email = req.session.user.email;

        var address = util.format('%s %s, %s %s',
            data.address, data.city, data.state, data.zip);

        geocoder.send(address, function (response) {
            var result = response.results[0];
            data.location = result.geometry.location;
            data.formattedAddress = result.formatted_address;

            volunteers.insert(data, { w: 1 }, function (err, result) {
                if (err || !result) {
                    log('POST: Error inserting record:\n\n%s\n\n', err);
                    res.send(400);
                } else {
                    log('POST: Volunteer record inserted, updating session');

                    req.session.user.role = 'volunteer';
                    req.session.volunteer = { };
                    updateSession(req.session.volunteer, data);

                    var tasksCompleted = 0;
                    var numTasks = 2;
                    var responseSent = false;

                    var query = { _id: req.session.volunteer._id };
                    var cmd = { $set: { role: 'volunteer' } };
                    var opt = { w: 1 };

                    users.update(query, cmd, opt, function (err, result) {
                        if (err || !result) {
                            log('POST: Error updating record: \n\n%s\n\n', err);
                            if (!responseSent) res.send(400);
                        } else {
                            log('POST: User record successfully updated');
                            if (++tasksCompleted === numTasks) {
                                res.send('ok', 200);
                            }
                        }
                    });

                    emailer.send({
                        to: data.email,
                        subject: 'Volunteer Account Registration',
                        template: 'volunteer',
                        locals: { user: data }
                    }, function (err) {
                        if (err) {
                            if (!responseSent) res.send(400);
                        } else if (++tasksCompleted === numTasks) {
                            res.send('ok', 200);
                        }
                    });
                }
            });
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Successful Registration',
            header: 'Thanks!',
            message: 'You should receive an e-mail confirming your registration was successful. Thank you for volunteering to serve your Auburn community through Big Event.',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Registration Failed',
            header: 'Sorry!',
            message: 'There was a problem with the registration. Please try again later.',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    account: {
        get: function (req, res) {
            res.render('volunteer-account', {
                title: 'Volunteer Control Panel',
                record: req.session.volunteer,
                user: req.session.user,
                _layoutFile: 'default'
            });
        },

        post: function (req, res) {
            var data = req.body;

            var address = util.format('%s %s, %s %s',
                data.address, data.city, data.state, data.zip);

            geocoder.send(address, function (response) {
                var result = response.results[0];

                data.location = result.geometry.location;
                data.formattedAddress = result.formatted_address;
                
                var query = { _id: req.session.volunteer._id };
                var cmd = { $set: data };
                var opt = { w: 1 };

                volunteers.update(query, cmd, opt, function (err, result)
                {
                    if (err || !result)
                    {
                        log('VOLUNTEER.ACCOUNT.POST: unable to find record with id %s', req.session.volunteer._id);
                        log('VOLUNTEER.ACCOUNT.POST: Trying an ObjectId %s', req.session.volunteer._id);
                        volunteers.update({_id: new ObjectId(req.session.volunteer._id)}, cmd, opt, function (error, record)
                        {
                            if(error || !record)
                            {
                                log('POST: Update error, volunteer:\n\n%s\n\n', err);
                                res.send(400);
                            }
                            else
                            {
                                log('POST: Record successfully updated');
                                log('POST: Updating user session');
                                updateSession(req.session.volunteer, data);

                                emailer.send({
                                    to: req.session.volunteer.email,
                                    subject: 'Volunteer Account Update',
                                    template: 'volunteer-account',
                                    locals: { user: req.session.volunteer }
                                }, function (err) {
                                    if (err) {
                                        res.send(400);
                                    }
                                    else {
                                        res.send('ok', 200);
                                    }
                                });
                            }
                        });
                    } else {
                        log('POST: Record successfully updated');
                        log('POST: Updating user session');
                        updateSession(req.session.volunteer, data);

                        emailer.send({
                            to: req.session.volunteer.email,
                            subject: 'Volunteer Account Update',
                            template: 'volunteer-account',
                            locals: { user: req.session.volunteer }
                        }, function (err) {
                            if (err) {
                                res.send(400);
                            }
                            else {
                                res.send('ok', 200);
                            }
                        });
                    }
                });
            });
        },
        
        staff: {

            get: function (req, res) {
                volunteers.findOne({_id: req.params.id}, function(err, rec){
                    if(err || !rec)
                    {
                        log('VOLUNTEER.STAFF.GET: Record not found for id %s', req.params.id);
                        log('VOLUNTEER.STAFF.GET: Using an ObjectId');
                    }
                    else {
                        log('VOLUNTEER.STAFF.GET: Record found');
                        res.render('volunteer-account', {
                            title: 'Volunteer Account',
                            record: rec,
                            user: req.session.user,
                            _layoutFile: 'default'
                        });
                    }
                });
            },

            post: function (req, res) {
                var data = req.body;

                var address = util.format('%s %s, %s %s',
                    data.address, data.city, data.state, data.zip);

                geocoder.send(address, function (response) {
                    var result = response.results[0];

                    data.location = result.geometry.location;
                    data.formattedAddress = result.formatted_address;

                    var query = { _id: req.params.id };
                    var cmd = { $set: data };
                    var opt = { w: 1, new:true};

                    volunteers.findAndModify(query, null, cmd, opt, function (err, result) {
                        if (err || !result) {
                            log('VOLUNTEER.ACCOUNT.STAFF.POST: Unable to find record with id %s', req.params.id);
                            log('VOLUNTEER.ACCOUNT.STAFF.POST: Using an ObjectId %s', req.params.id);
                            res.send(400, 'staff');
                        } else {
                            log('POST: Record successfully updated');
                            emailer.send({
                                to: result.email,
                                subject: 'Volunteer Account Update',
                                template: 'volunteer-account',
                                locals: { user: result }
                            }, function (err) {
                                if (err) {
                                    res.send(400, 'staff');
                                }
                                else {
                                    res.send('staff', 200);
                                }
                            });
                        }
                    });
                });
            }
        },

        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Successfully Updated',
                header: 'Thanks!',
                message: 'You have successfully updated your data. You should receive an e-mail confirmation as well. Thank you for volunteering to serve your Auburn community through Big Event.',
                user: req.session.user,
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Registration Failed',
                header: 'Sorry!',
                message: 'There was a problem updating your data. Please try again later.',
                user: req.session.user,
                _layoutFile: 'default'
            });
        }
    }
};
