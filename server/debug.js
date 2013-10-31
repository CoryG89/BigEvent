'use strict';

var util = require('util');
var globallyEnabled = false;

module.exports = {
    setEnabled: function (value) {
        if (typeof value === 'boolean') globallyEnabled = value;
    },
    getLogger: function (options) {
        var prefix = options.prefix !== undefined ? options.prefix : null;
        var enabled = options.enabled !== undefined ? options.enabled : true;

        var Logger = function Logger () {
            if (globallyEnabled && enabled) {
                var callback;
                var args = Array.prototype.slice.call(arguments);
                var last = args.length - 1;

                if (typeof args[last] === 'function')
                    callback = args.splice(last)[0];

                if (prefix)
                    args[0] = prefix + args[0];

                console.log.apply(console, args);

                if (callback) callback(util.format.apply(util, args));
            }
        };

        Logger.setEnabled = function (value) {
            if (typeof value === 'boolean') enabled = value;
        };

        Logger.setPrefix = function (value) {
            if (typeof value === 'string') prefix = value;
        };

        Logger.getEnabled = function () {
            return enabled;
        };

        Logger.getPrefix = function () {
            return prefix;
        };

        return Logger;
    }
};
