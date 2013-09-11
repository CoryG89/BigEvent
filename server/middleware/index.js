'use strict';

/** Automatically export all routes in this file's containing directory */
var fs = require('fs');
var path = require('path');

var exportDirectory = path.dirname(__filename);

var directoryItems = fs.readdirSync(exportDirectory);

var directoryPaths = directoryItems.map(function (item) {
    return path.join(exportDirectory, item);
});

var exportPaths = directoryPaths.filter(function (item) {
    var stat = fs.statSync(item);
    var extname = path.extname(item);
    var basename = path.basename(item, extname);

    var isFileExport = stat.isFile() && extname === '.js' && basename !== 'index';
    var isDirExport = stat.isDirectory() && fs.existsSync(item + '/index.js');

    return isFileExport || isDirExport;
});

exportPaths.forEach(function (exportPath) {
    var anExport;
    var exportName = path.basename(exportPath, '.js');

    try {
        anExport = require(exportPath);
    } catch (error) {
        console.log('Error exporting [%s]\n\n\t[%s]', exportPath, error);
    }

    if (anExport) {
        module.exports[exportName] = anExport;
    } else {
        console.log('Error exporting [%s]', exportPath);
    }
});
