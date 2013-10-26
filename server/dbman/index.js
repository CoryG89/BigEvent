'use strict';

var util = require('util');

/** Import MongoDB Native Driver */
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

/** Import database authentication details */
var auth = require('./auth');

/** Format a MongoDB connection URI with aquired auth details */
var uri = util.format('mongodb://%s:%s@%s:%d/%s',
    auth.user, auth.pass, auth.host, auth.port, auth.name);

var debug = require('../debug');
var log = debug.getLogger({ prefix: '[dbman]-  ' });

var db;
var cl = { };

var collectionNames = [
    'users', 'volunteers', 'jobsites', 'tools', 'teams',
    'executive', 'committee', 'leadership', 'projectcoordinators'
];

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
            if (++current === names.length) callback();
        });
    });
};

module.exports = {

    /** Connect and initialize the database */
    init: function (callback) {
        var opt = { auto_reconnect: true };

        MongoClient.connect(uri, opt, function (err, database) {
            if (err) {
                log('Error connecting to datasbase -- %s', err);
            }
            else {
                log('Successfully connected to database at:\n\n%s\n', uri);
                db = database;
                createCollections(db, collectionNames, callback);
            }
        });
    },
    getCollection: function (name) {
        return cl[name];
    },
    getDatabase: function () {
        return db;
    },
    getObjectId: function() {
        return ObjectId;
    }
};
