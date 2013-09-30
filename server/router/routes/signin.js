'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.signin]-  ' });
var users = dbman.getCollection('users');

module.exports = {
    get: function (req, res) {
        res.render('signin', {
            title: 'Sign In',
            _layoutFile: 'default'
        });
    },

    post: function (req, res) {
        var data = req.body;
        var query = { _id: data.id };
        users.findOne(query, function (err, record) {
            if (err) {
                log('POST: Error querying database:\n\n%s\n\n', err);
                res.send(400);
            } else if (!record) {
                log('POST: Record does not exist, adding new user record');
                
                console.log(data);

                record = {
                    _id: data.id,
                    name: data.name,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.emails.account
                };

                var options = { w: 1 };
                users.insert(record, options, function (err) {
                    if (err) {
                        log('POST: Error adding new record:\n\n%s\n\n', err);
                        res.send(400);
                    } else {
                        log('POST: New record successfully added to database');
                        log('POST: Updating session');
                        req.session.user = record;
                        res.send('ok', 200);
                    }
                });

            } else {
                log('POST: User record found, updating session');
                req.session.user = record;
                res.send('ok', 200);
            }
        });
    }
};
