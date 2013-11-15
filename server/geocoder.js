'use strict';

var https = require('https');
var util = require('util');

var debug = require('./debug');
var log = debug.getLogger({ prefix: '[geocoder]-  ' });

var baseUri = 'https://maps.googleapis.com/maps/api/geocode/json';

module.exports = {
    send: function (addr, callback) {
        var encoded = encodeURIComponent(addr);
        var uri = util.format('%s?address=%s&sensor=false', baseUri, encoded);

        log('Sending request to geocoding server');
        https.get(uri, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                log('Got response from geocoding server');
                callback(JSON.parse(data));
            });
        }).on('error', function (err) {
            log('Error sending geocoding request:\n\n\t%s\n', err);
            callback(null, err);
        });
    }
};
