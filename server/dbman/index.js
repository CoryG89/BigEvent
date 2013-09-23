'use strict';

/** Import required Node.JS modules */
var util = require('util');
var mongodb = require('mongodb');

/** Get needed MongoDB objects */
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

/** Import local database authentication details */
var auth = require('./auth');

/** Format a MongoDB connection URI with given auth details */
var uri = util.format('mongodb://%s:%s@%s:%d/%s',
    auth.user, auth.pass, auth.host, auth.port, auth.name);

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[dbman]-  ' });

var db;
var cl = { };

var createCollections = function (db, names, callback) {
    var current = 0;
    names.forEach(function (name) {
        db.createCollection(name, function (error, collection) {
            if (error) {
                log('Error creating collection \'%s\'', name);
            } else {
                log('Sucessfully got collection \'%s\'', name);
                cl[name] = collection;
            }
            if (++current === names.length) callback(cl);
        });
    });
};

module.exports = {
    init: function (callback) {
        /** Connect and initialize the database */
        var opt = { auto_reconnect: true };
        MongoClient.connect(uri, opt, function (err, database) {
            if (err) {
                log('Error connecting to datasbase -- %s', err);
            }
            else {
                log('Successfully connected to database at:\n\n%s\n', uri);
                db = database;
                createCollections(db, ['users', 'requests'], function () {
                    callback();
                });
            }
        });
    },
    getCollection: function (name) {
        return cl[name];
    },
    getDatabase: function () {
        return db;
    }
};
