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
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Registration Failed',
            header: 'Sorry!',
            message: 'There was a problem with the registration. Please try again later.',
            _layoutFile: 'default'
        });
    },

    account: {
        get: function (req, res) {
            if(req.query.id)
            {
                log('VOLUNTEER.ACCOUNT.GET: Getting volunteer with _id: %s', req.query.id);
                volunteers.findOne({_id: req.query.id}, function(err, record){
                    res.render('volunteer-account', {
                        title: 'Volunteer Control Panel',
                        user: record,
                        _layoutFile: 'default'
                    });
                });
            }
            else
            {
                log('VOLUNTEER.ACCOUNT.GET: No volunteer requested. Using session data.');
                res.render('volunteer-account', {
                    title: 'Volunteer Control Panel',
                    user: req.session.volunteer,
                    _layoutFile: 'default'
                });
            }
        },

        post: function (req, res) {
            var data = req.body;

            var address = util.format('%s %s, %s %s',
                data.address, data.city, data.state, data.zip);

            geocoder.send(address, function (response) {
                var result = response.results[0];

                data.location = result.geometry.location;
                data.formattedAddress = result.formatted_address;
                
                //determin how we are to query.
                var query;
                if(req.query.id)//means this request came from a logged in staff member not a Registered Volunteer
                {
                    query = { _id: req.query.id };
                }
                else 
                {
                    query = { _id: req.session.volunteer._id };
                }   
                var cmd = { $set: data };
                var opt = { w: 1 };

                volunteers.update(query, cmd, opt, function (err, result) {
                    if (err || !result) {
                        log('POST: Update error, volunteer:\n\n%s\n\n', err);
                        res.send(400);
                    } else {
                        log('POST: Record successfully updated');
                        log('POST: Updating user session');
                        if(!req.query.id)//means this request came from a Registered Volunteer
                        {
                            updateSession(req.session.volunteer, data);
                        }

                        var user, email;
                        if(req.query.id)//means the request did not come from a registered volunteer
                        {
                            log('VOLUNTEER.ACCOUNT.POST: Using query data for eamil.');
                            user = result[0];
                            email = result[0].email;
                        }
                        else
                        {
                            log('VOLUNTEER.ACCOUNT.POST: Using session data for eamil.');
                            user = req.session.volunteer;
                            email = req.session.volunteer.email;
                        }
                        emailer.send({
                            to: email,
                            subject: 'Volunteer Account Update',
                            template: 'volunteer-changed',
                            locals: { user: user }
                        }, function (err) {
                            if (err) {
                                res.send(400);
                            }
                            else if(req.query.id) {
                                res.send('query', 200);
                            }
                            else {
                                res.send('ok', 200);
                            }
                        });
                    }
                });
            });
        },
        
        success: function (req, res) {
            res.render('hero-unit', {
                title: 'Successfully Updated',
                header: 'Thanks!',
                message: 'You have successfully updated your data. You should receive an e-mail confirmation as well. Thank you for volunteering to serve your Auburn community through Big Event.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('hero-unit', {
                title: 'Registration Failed',
                header: 'Sorry!',
                message: 'There was a problem updating your data. Please try again later.',
                _layoutFile: 'default'
            });
        }
    }
};
