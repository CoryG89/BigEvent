'use strict';

var util = require('util');
var path = require('path');
var nodemailer = require('nodemailer');

var renderer = require('./renderer');
var debug = require('../debug');
var config = require('../../config');
var auth = require('../../auth');

var log = debug.getLogger({ prefix: '[emailer]-  ' });

var transport = nodemailer.createTransport('SMTP', {
    service: auth.email.service,
    auth: { user: auth.email.user, pass: auth.email.pass }
});

var enabled = config.emailNotifications.enabled;
var fromLabel = config.emailNotifications.fromLabel;
var templatesPath = 'server/views/email';

module.exports = {
    send: function (opt, callback) {
        if (!enabled) {
            log('Email notifications disabled, simulating success behavior', function (msg) {
                callback(null, msg);
            });
        }
        opt.template = util.format('%s.md', path.join(templatesPath, opt.template));
        renderer.render(opt.template, opt.locals, function (error, html) {
            if (error) {
                log('Error rendering template -- %s', error, callback);
            }
            else {
                transport.sendMail({
                    from: opt.from || fromLabel,
                    to: opt.to,
                    subject: opt.subject,
                    html: html
                }, function (error, response) {
                    if (error) {
                        log('Error sending mail -- %s', error, callback);
                    }
                    else {
                        log('Message sent successfully to \'%s\'', opt.to);
                        if (typeof callback === 'function')
                            callback(null, response);
                    }
                });
            }
        });
    }
    
};
