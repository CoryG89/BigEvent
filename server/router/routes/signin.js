'use strict';

var dbman = require('../../dbman');

var debug = require('../../../debug');
var log = debug.getLogger({ prefix: '[route.signin]-  ' });

module.exports = {
    get: function (req, res) {
        res.render('signin', {
            title: 'Sign In',
            _layoutFile: 'default'
        });
    },

    post: function (req, res) {
        var wlData = req.body;

        dbman.exists(wlData.id, function (error, record) {
            if (error) throw error;
            else if (record) {
                log('User with id %s exists', wlData.id);
                req.session.user = record;
                res.send('ok', 200);
            } else {
                log('User with id %s does not exist', wlData.id);
                record = {
                    _id: wlData.id,
                    wlData: wlData
                };

                dbman.create(record, function (error, record) {
                    if (error) throw error;
                    else {
                        req.session.user = record;
                        res.send('ok', 200);
                    }
                });
            }
        });
    }
};
