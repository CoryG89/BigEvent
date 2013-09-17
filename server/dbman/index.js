'use strict';

/** Import required Node.JS modules */
var util = require('util');
var mongodb = require('mongodb');

/** Import local database authentication details */
var auth = require('./auth');

/** Import debugging module and get a logger */
var debug = require('../debug');
var log = debug.getLogger({ prefix: '[dbman]-  ' });

/** Get needed MongoDB objects */
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

/** Format a MongoDB connection URI with given auth details */
var uri = util.format('mongodb://%s:%s@%s:%d/%s',
    auth.user, auth.pass, auth.host, auth.port, auth.name);

/** Collections */
var cl = { };

var createCollection = function (db, name) {
    db.createCollection(name, function (error, collection) {
        if (error) log('Error creating collection [%s]', name);
        else {
            log('Sucessfully got/created collection [%s]', name);
            cl[name] = collection;
        }
    });
};

/** Connect and initialize the database */
MongoClient.connect(uri, { auto_reconnect: true }, function (error, db) {
    if (error) {
        log('Error connecting to datasbase -- %s', error);
    }
    else {
        log('Successfully connected to database at:\n\n\t%s\n', uri);

        createCollection(db, 'users');
        createCollection(db, 'requests');
    }
});

module.exports = {
    ObjectID: ObjectID,
    
    exists: function (id, callback) {
        cl.users.findOne({ _id: id }, function (error, record) {
            if (error) {
                log('exists: Error finding record -- %s', error);
                callback(error);
            } else if (!record) {
                log('exists: Record not found for id %s', id);
                callback(null, record);
            } else {
                log('exists: Record found for id %s', id);
                callback(null, record);
            }
        });
    },

    create: function (record, callback) {
        cl.users.insert(record, { w: 1 }, function (error, result) {
            if (error) {
                log('create: Error inserting into database -- %s', error);
                callback(error);
            } else if (!result) {
                log('create: Unknown error inserting into database');
                callback(true);
            } else {
                log('create: New record successfully inserted');
                callback(null, record);
            }
        });
    },

    update: function (id, data, callback) {
        var cmd = { $set: data };
        var opt = { w: 1, new: true };

        cl.users.findAndModify(id, null, cmd, opt, function (error, record) {
            if (error) {
                log('update: Error updating record -- %s', error);
                callback(error);
            } else if (!record) {
                log('update: User with id %s could not be found', id);
                callback(true);
            } else {
                log('update: User record successfully updated');
                callback(null, record);
            }
        });
    },

    submitRequest: function (record, callback) {
        cl.requests.insert(record, { w: 1 }, function (error, result) {
            if (error) {
                log('create: Error inserting into database -- %s', error);
                callback(error);
            } else if (!result) {
                log('create: Unknown error inserting into database');
                callback(true);
            } else {
                log('create: New record successfully inserted');
                callback(null, record);
            }
        });
    }
};
