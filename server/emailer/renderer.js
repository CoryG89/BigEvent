'use strict';

var fs = require('fs');
var ejs = require('ejs');
var marked = require('marked');

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[emailer.renderer]-  ' });

/** Set default markdown options */
marked.setOptions({
    gfm: true,
    tables: true,
    smartLists: true,
    breaks: false,
    pedantic: false,
    sanitize: false
});

function unescape (html) {
    return html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&amp;/g, '&');
}

module.exports = {
    
    parse: function (string, locals) {
        var html;
        try {
            html = marked(string);
            html = unescape(html);
            html = ejs.render(html, locals);
        } catch (error) {
            log('Error parsing markdown string');
        } finally {
            return html;
        }
    },

    render: function (path, locals, callback) {
        var self = this;
        fs.readFile(path, 'utf8', function (error, markdown) {
            if (error) {
                log('Error reading file:\n\n%s\n\n', error);
                callback(error);
            } else {
                callback(null, self.parse(markdown, locals));
            }
        });
    }
};
