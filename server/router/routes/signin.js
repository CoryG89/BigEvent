'use strict';

var https = require('https');
var util = require('util');
var dbman = require('../../dbman');
var auth = require('../../../auth');
var config = require('../../../config');

var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[route.signin]-  ' });

var users = dbman.getCollection('users');

var wlClientId = auth.windowsLive.clientId;
var wlClientSecret = auth.windowsLive.clientSecret;
var wlScopes = ['wl.signin', 'wl.emails'].join(' ');

var wlRedirect = config.site.url + 'signin/success';

var wlLoginHost = 'https://login.live.com';
var wlAuthPath = 'oauth20_authorize.srf';
var wlAuthQuery = 'client_id=%s&scope=%s&response_type=code&redirect_uri=%s';
wlAuthQuery = util.format(wlAuthQuery, wlClientId, wlScopes, wlRedirect);
var wlAuthUri = util.format('%s/%s?%s', wlLoginHost, wlAuthPath, wlAuthQuery);

var wlAccessPath = 'oauth20_token.srf';
var wlAccessQuery = 'client_id=%s&redirect_uri=%s&client_secret=%s&code=%s&grant_type=authorization_code';
wlAccessQuery = util.format(wlAccessQuery, wlClientId, wlRedirect, wlClientSecret);
var wlAccessFmt = util.format('%s/%s?%s', wlLoginHost, wlAccessPath, wlAccessQuery);

var wlApiHost = 'https://apis.live.net';
var wlApiPath = 'v5.0/me';
var wlApiQuery = 'access_token=%s';
var wlApiFmt = util.format('%s/%s?%s', wlApiHost, wlApiPath, wlApiQuery);

var redirectCookieName = 'signin_redirect';
var defaultRedirectPath = '/home';

function handleRedirect(req, res) {
    var redirectPath = req.cookies[redirectCookieName];
    if (redirectPath) {
        redirectPath = decodeURIComponent(redirectPath);
        res.redirect(redirectPath);
    } else {
        res.redirect(defaultRedirectPath);
    }
}

module.exports = {
    get: function (req, res) {
        res.render('signin', {
            title: 'Sign In',
            header: 'Please sign-in to continue'
        });
    },

    authenticate: function (req, res) {
        log('Redirecting to WL authentication endpoint');
        res.redirect(wlAuthUri);
    },

    success: function (req, res) {
        var wlAuthCode = req.query.code;
        var wlAccessUri = util.format(wlAccessFmt, wlAuthCode);

        log('Got WL authorization code, sending access request');
        https.get(wlAccessUri, function (response) {
            var data = '';
            response.on('data', function (chunk) { data += chunk; });

            response.on('end', function () {
                data = JSON.parse(data);
                var accessToken = data.access_token;
                var wlApiUri = util.format(wlApiFmt, accessToken);

                log('Got WL access token, sending API request');
                https.get(wlApiUri, function (response) {
                    var data = '';
                    response.on('data', function (chunk) { data += chunk; });

                    response.on('end', function () {
                        data = JSON.parse(data);

                        var userData = {
                            _id: data.id,
                            email: data.emails.account
                        };

                        log('WL API response received, querying db for user document');
                        users.findOne(userData, function (err, result) {
                            if (err) {
                                log('Error querying users collection:\n\n\t%s\n', err);
                                res.send(400);
                            } else {
                                if (!result) {
                                    userData.role = 'user';
                                    
                                    log('User document not found, inserting new user document');
                                    users.insert(userData, { w: 1 }, function (err) {
                                        if (err) {
                                            log('Error inserting user document:\n\n\t%s\n', err);
                                            res.send(400);
                                        } else {
                                            log('Successfully inserted document, saving user session');
                                            req.session.user = userData;
                                            handleRedirect(req, res);
                                        }
                                    });

                                } else {
                                    log('User document found, saving user session');
                                    userData = result;
                                    req.session.user = userData;
                                    handleRedirect(req, res);
                                }
                            }
                        });
                    });

                }).on('error', function (err) {
                    log('Error sending request to WL api endpoint:\n\n\t%s\n', err);
                    res.send(400);
                });
            });

        }).on('error', function (err) {
            log('Error sending request to WL access endpoint:\n\n\t%s\n', err);
            res.send(400);
        });

    }
};
