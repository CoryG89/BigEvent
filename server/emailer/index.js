'use strict';

var nodemailer = require('nodemailer');
var auth = require('./auth');
var renderer = require('./renderer');

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[emailer]-  ' });

var transport = nodemailer.createTransport('SMTP', {
    service: auth.service,
    auth: { user: auth.user, pass: auth.pass }
});

var fromLabel = 'Big Event <bigeventdemo@gmail.com>';
var templatesPath = 'server/views/email/';


module.exports = {

    send: function (opt, callback) {
        opt.template = templatesPath + opt.template + '.md';
        renderer.render(opt.template, opt.locals, function (error, html) {
            if (error) {
                log('Error rendering template -- %s', error);
                callback(error);
            }
            else {
                transport.sendMail({
                    from: opt.from || fromLabel,
                    to: opt.to,
                    subject: opt.subject,
                    html: html
                }, function (error, response) {
                    if (error) log('Error sending mail -- %s', error);
                    else {
                        log ('Message sent successfully');
                        callback(null, response);
                    }
                });
            }
        });
    }
    
};
