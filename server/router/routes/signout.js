'use strict';

var util = require('util');

var auth = require('../../../auth');
var config = require('../../../config');

var wlClientId = auth.windowsLive.clientId;
var wlRedirect = config.site.url;

var wlLogoutHost = 'https://login.live.com';
var wlLogoutPath = 'oauth20_logout.srf';
var wlLogoutQuery = 'client_id=%s&redirect_uri=%s';
wlLogoutQuery = util.format(wlLogoutQuery, wlClientId, wlRedirect);

var wlLogoutUri = util.format('%s/%s?%s', wlLogoutHost, wlLogoutPath, wlLogoutQuery);

module.exports = function (req, res) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect(wlLogoutUri);
    } else {
        res.redirect('/');
    }
};
