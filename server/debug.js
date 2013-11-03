'use strict';

var util = require('util');
var globallyEnabled = false;

module.exports = {
    /** Returns a log function that acts as a shorthand for console.log. Each
        returned function can be enabled/disabled separately, and each can set
        a string which is prefixed to each string logged. Also allows a callback
        as the last argument which is passed the resulting formatted string */
    getLogger: function (options) {
        var prefix = options.prefix !== undefined ? options.prefix : null;
        var enabled = options.enabled !== undefined ? options.enabled : true;

        var log = function log () {
            var callback;
            var formatted = null;

            /** Get the arguments object a real array */
            var args = Array.prototype.slice.call(arguments);

            /** Check if last argument is a function, if so then
                splice it off and use it as a callback */
            var last = args.length - 1;
            if (typeof args[last] === 'function')
                callback = args.splice(last)[0];

            /** Prepend the prefix if set */
            if (typeof prefix === 'string')
                args[0] = prefix + args[0];

            /** Format the string with util module and log it */
            formatted = util.format.apply(util, args);

            /** If we're not currently disabled, log it to the console */
            if (globallyEnabled && enabled)
                console.log(formatted);

            /** If present, pass the callback the formatted string */
            if (callback) callback(formatted);
        };

        /** Enables/disables this particular log function */
        log.setEnabled = function (value) {
            if (typeof value === 'boolean') enabled = value;
        };

        /** Prefixes a string to each log for this particular log function */
        log.setPrefix = function (value) {
            if (typeof value === 'string') prefix = value;
        };

        /** Returns the status of this log particular log function */
        log.getEnabled = function () {
            return enabled;
        };

        /** Returns the prefix of this particular log function */
        log.getPrefix = function () {
            return prefix;
        };

        return log;
    },
    
    /** Enables/disables all logging to the console */
    setEnabled: function (value) {
        if (typeof value === 'boolean') globallyEnabled = value;
    },

    /** Enables/disables all logging to the console */
    getEnabled: function (value) {
        if (typeof value === 'boolean') globallyEnabled = value;
    }
};
