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
        var wlData = req.body;
        var query = { _id: wlData.id };
        var opt = { w: 1 };
        users.findOne(query, function (err, record) {
            if (err) {
                log('POST: Error querying database:\n\n%s\n\n', err);
                res.send(400);
            } else if (!record) {
                log('POST: Record does not exist, adding new user record');
                
                record = {
                    _id: wlData.id,
                    wlData: wlData
                };

                users.insert(record, opt, function (err) {
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
