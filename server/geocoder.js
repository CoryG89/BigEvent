'use strict';

var https = require('https');
var util = require('util');

var baseUri = 'https://maps.googleapis.com/maps/api/geocode/json';

module.exports = {
    send: function (addr, callback) {
        var encoded = encodeURIComponent(addr);
        var uri = util.format('%s?address=%s&sensor=false', baseUri, encoded);

        https.get(uri, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                callback(JSON.parse(data));
            });
        }).on('error', function (err) {
            callback(null, err);
        });
    }
};
