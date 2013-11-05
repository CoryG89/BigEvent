'use strict';

var util = require('util');
var mongodb = require('mongodb');
var auth = require('./auth');
var debug = require('../debug');

var serverConnection = new mongodb.Server(auth.host, auth.port);
var mongoClient = new mongodb.MongoClient(serverConnection);

var formattedUri = util.format('mongodb://%s:xxxxx@%s:%d/%s\n',
    auth.user, auth.host, auth.port, auth.name);

var log = debug.getLogger({ prefix: '[dbman]-  ' });

var db;
var cl = { };

var collectionNames = [
    'users',
    'volunteers',
    'jobsites',
    'tools',
    'executive',
    'committee',
    'leadership',
    'projectcoordinators',
    'zips'
];

/** Creates collections using the db object based on a given array of names.
    Calls the callback if an error occurs or when all collections have been 
    successfully created */
function createCollections (db, names, callback) {
    var current = 0;
    
    names.forEach(function (name) {
        db.createCollection(name, function (error, collection) {
            if (error) {
                log('Error creating collection \'%s\'', name, callback);
                return;
            }
            log('Sucessfully got collection \'%s\'', name);
            cl[name] = collection;

            if (++current === names.length) {
                log('Successfully got all collections');
                callback(null, cl);
            }
        });
    });
}

module.exports = {

    /** Connect to and authenticate with the database server before initializing
        the database and creating the needed collections */
    init: function (callback) {
        mongoClient.open(function (err, mongoClient) {
            if (err) {
                log('Error connecting:\n\n\t%s\n', err, callback);
                return;
            }
            db = mongoClient.db(auth.name);
            db.authenticate(auth.user, auth.pass, function (err, result) {
                if (err || !result) {
                    log('Error authenticating:\n\n\t%s\n', err, callback);
                    return;
                }
                log('Connected to database at:\n\n\t%s\n', formattedUri);
                createCollections(db, collectionNames, callback);
            });
        });
    },

    /** Returns a collection given a specified name */
    getCollection: function (name) {
        return cl[name];
    },

    /** Returns the database object being used by the module */
    getDatabase: function () {
        return db;
    },

    /** Returns the MongoDB ObjectID constructor */
    getObjectId: function() {
        return mongodb.ObjectID;
    }
};
