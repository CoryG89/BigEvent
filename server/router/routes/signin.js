'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.signin]-  ' });
var users = dbman.getCollection('users');
var volunteers = dbman.getCollection('volunteers');

function validatePost (data) {
    return typeof data === 'object' &&
        typeof data.id === 'string' &&
        typeof data.emails === 'object' &&
        typeof data.emails.account === 'string' &&
        (data.emails.account.search(/^.+@tigermail.auburn.edu$/) !== '-1' ||
        data.emails.account.search(/^.+@auburn.edu$/) !== -1);
}

module.exports = {
    get: function (req, res) {
        res.render('signin', {
            title: 'Sign In',
            _layoutFile: 'default',
            user: req.session.user
        });
    },

    post: function (req, res) {
        var data = req.body;

        if (validatePost(data)) {

            var user = {
                _id: data.id,
                email: data.emails.account
            };

            users.findOne(user, function (err, record) {
                if (err) {
                    log('POST: Error querying database:\n\n%s\n\n', err);
                    res.send(400);
                } else if (!record) {
                    log('POST: Record does not exist');

                    user.role = 'user';

                    users.insert(user, { w: 1 }, function (err, result) {
                        if (err || !result) {
                            log('POST: Error writing to user collection -- %s', err);
                            res.send(400);
                        } else {
                            res.send('ok', 200);
                            req.session.user = user;
                        }
                    });

                } else {
                    log('POST: User record found, updating session');
                    req.session.user = record;

                    if (record.role === 'volunteer') {
                        volunteers.findOne({_id: record._id }, function (err, record) {
                            if (err) {
                                log('POST: Read error, volunteer collection -- %s');
                                res.send(400);
                            } else if (!record) {
                                log('POST: No volunteer record found');
                                res.send(400);
                            } else {
                                log('POST: Successfully read volunteer record');
                                log('POST: Updating user session');
                                req.session.volunteer = record;
                                res.send('ok', 200);
                            }
                        });
                    } else {
                        res.send('ok', 200);
                    }
                }
            });

        } else {
            res.send(400);
        }
    }
};
