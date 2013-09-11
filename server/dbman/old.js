'use strict';

/** Import required dependencies */
var util = require('util');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var moment = require('moment');
var mongodb = require('mongodb');

var client = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

/** MongoDB Standard URI Connection Data */
var auth = require('./auth');
var uri = util.format('mongodb://%s:%s@%s:%d/%s',
    auth.user, auth.pass, auth.host, auth.port, auth.name);

var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[dbman]-  ' });

/** MongoDB Database object */
var db;
var users;

/** MongoDB collection names */
var usersCollectionName = 'users';

/** Connect to the Mongo database at the URI using the client */
client.connect(uri, { auto_reconnect: true }, function (err, database) {

    /** Log result of the connection attempt */
    if (err) throw err;
    else if (database) {
        log('Connected to MongoDB database server at:\n\n\t%s\n', uri);
        createCollections(database);
    }
});

function createCollections(db, cb) {
    /** Get users collection, create it if it doesn't exist */
    db.createCollection(usersCollectionName, function (err, coll) {

        /** Log the result of the operation */
        if (err) throw err;
        else {
            log('Got collection: %s', usersCollectionName);
            users = coll;
        }
    });

    if (cb) cb();
}

var UUID = {
    getTimeBased: uuid.v1,
    getRandom: uuid.v4
};

/** Helper method for getting pretty timestamps using moment */
var getTimeStamp = function () {
    return moment().format('MMMM Do YYYY, h:mm:ss a');
};

/** Returns a date object with data based on the system time */
var getDate = function () {
    var date = new Date();
    var timestamp = getTimeStamp();
    return {
        'time': date.getTime(),
        'day': date.getDay(),
        'date': date.getDate(),
        'month': date.getMonth(),
        'year': date.getFullYear(),
        'hour': date.getHours(),
        'minutes': date.getMinutes(),
        'seconds': date.getSeconds(),
        'string': timestamp
    };
};

/** Helper method for salting and hashing password using bcrypt */
var getHash = function (pass, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(pass, salt, callback);
    });
};

/** Helper method for inserting records, guarantees result callback */
var insertRecord = function (collection, record, callback) {

    var errorMsg = 'insertRecord: Error -- %o';
    var unknownMsg = 'insertRecord: Unknown error inserting into database';
    var successMsg = 'insertRecord: succesfully inserted record';

    collection.insert(record, { w: 1 }, function (error, result) {
        if (error) {
            log('insertRecord: Error -- %o', error);
            callback(error);
        } else if (!result) {
            log (unknownMsg);
            callback(unknownMsg);
        } else {
            log(successMsg);
            callback(null, 'success');
        }
    });
};

/** Helper method for determining whether a record's username or email
    is already present in the database. */
var isAvailable = function (record, callback) {
    var username = record.username;
    var email = record.email;

    var errorMsg = 'isAvailable: Error -- %o';
    var userMsg = ' isAvailable: Account w/ given username already exists';
    var emailMsg = 'isAvailable: Account w/ given email already exists';
    var successMsg = 'isAvailable: Acct w/ given username/email available';

    users.findOne({ username: username }, function (error, record) {
        if (error) {
            log(errorMsg, error);
            callback(error);
        }
        else if (record) {
            log(userMsg);
            callback('username-taken');
        } else {
            users.findOne({ email: email }, function (error, record) {
                if (error) {
                    log(errorMsg, error);
                    callback(error);
                }
                else if (record) {
                    log(emailMsg);
                    callback('email-taken');
                }
                else {
                    log(successMsg);
                    callback(null, 'success');
                }
            });
        }
    });
};

var updateUserRecord = function (id, data, callback) {
    var cmd = { $set: data };
    var options = { w: 1, new: true };
    users.findAndModify(id, null, cmd, options, function (error, record) {
        if (error) {
            log('Error updating user record: %o', error);
            callback(error);
        } else if (!record) {
            log('User with id %s could not be found', id);
            callback(true);
        }
        else {
            log('Update successful');
            callback(null, record);
        }
    });
};


module.exports = {
    ObjectID: ObjectID,

    /** Authenticates a user based on a username, and hashed password */
    auth: function (user, hash, callback) {
        users.findOne({ username: user, password: hash }, function (err, rec) {
            if (err) {
                log(' auth: Error -- %o', err);
                callback(err);
            }
            else if (!rec.confirmed) {
                log(' auth: User account unconfirmed');
                callback('unconfirmed');
            }
            else {
                log(' auth: Authentication successful');
                callback(null, rec);
            }
        });
    },

    /** Authenticates a user based on a username and plain-text password */
    login: function (user, pass, callback) {
        var errorMsg = 'login: Error logging in -- %o';
        var failMsg = 'login: Username and/or password is invalid';
        var confMsg = 'login: Account is as of yet unconfirmed';
        var successMsg = 'login: User successfully logged in';

        users.findOne({ username: user }, function (error, record) {
            if (error) {
                log(errorMsg, error);
                callback(error);
            } else if (!record) {
                log(failMsg);
                callback('invalid');
            }
            else {
                bcrypt.compare(pass, record.password, function (error, result) {
                    if (error) {
                        log(errorMsg, error);
                        callback(error);
                    }
                    else if (!result) {
                        log(failMsg);
                        callback('invalid');
                    }
                    else if (!record.confirmed) {
                        log(confMsg);
                        callback('unconfirmed');
                    } else {
                        log(successMsg);
                        callback(null, record);
                    }
                });
            }
        });
    },

    /** Attempts to create a new user in the database */
    create: function (record, callback) {

        var successMsg = 'create: Account successfully created';

        /** Make sure username/email is available */
        isAvailable(record, function (error, result) {
            if (error) {
                callback(error);
            }
            else {

                /** Keep only a hashed password using a one-way function */
                getHash(record.password, function (error, hash) {
                    if (error) {
                        callback(error);
                    }
                    else {

                        /** Add the hash and other internal data to record */
                        record.password = hash;
                        record.confirmed = false;
                        record.confirmCode = UUID.getRandom();
                        record.reset = {date: null, code: null};
                        record.password = hash;
                        record.joinDate = getDate();

                        /** Actually write the record out to the database */
                        insertRecord(users, record, function (error, result) {
                            if (error) {
                                callback(error);
                            }
                            else {
                                log(successMsg);
                                callback(null, record);
                            }
                        });
                    }
                });
            }
        });
    },

    update: updateUserRecord,
    
    /** Confirms accounts based on id and confirmation code sent only to
        the email address used to register the account. */
    confirmAccount: function (id, confirmCode, callback) {
        var errorMsg = 'confirmAccount: Error -- %o';
        var userMsg = 'confirmAccount: Account with given user id %s not found';
        var codeMsg = 'confirmAccount: Confirm code %s does not match';
        var successMsg = 'confirmAccount: Account w/ user id %s confirmed';

        users.findOne({ _id: new ObjectID(id) }, function (error, record) {
            if (error) {
                log(errorMsg, error);
                callback(error);
            } else if (!record) {
                log(userMsg, id);
                callback('not-found');
            } else if (confirmCode !== record.confirmCode) {
                log(codeMsg, confirmCode);
                callback('bad-code');
            }
            else {
                record.confirmed = true;
                users.save(record, { safe: true }, callback);
            }
        });
    },

    /** Performs a lookup by object id in order to check whether or not
        an account has been confirmed or not. */
    checkConfirmation: function (id, callback) {
        users.findOne({ _id: new ObjectID(id) }, function (error, record) {
            if (error || !record) callback(error, null);
            else if (!record.confirmed) callback(null, false);
            else callback(null, true);
        });
    },

    createResetRecord: function (email, callback) {
        users.findOne({ email: email }, function (error, record) {
            if (error) debug(error, callback);
            else if (!record) debug('Email address not registered', callback);
            else {
                var data = {
                    reset: {
                        date: getDate(),
                        code: UUID.getRandom()
                    }
                };
                updateUserRecord(email, data, callback);
            }
        });
    },

    checkResetRecord: function (id, code, callback) {
        var errorMsg = 'checkResetRecord: Error -- %o';
        var invalidMsg = 'checkResetRecord: Account and/or reset data invalid';
        var successMsg = 'checkResetRecord: Record data is valid, ok to reset';

        users.findOne({ _id: new ObjectID(id) }, function (error, record) {
            if (error) {
                log(errorMsg, error);
                callback(error);
            }
            else if (!record || record.reset.code !== code) {
                log(invalidMsg);
                callback('invalid');
            }
            else {
                log(successMsg);
                callback(null, 'success');
            }
        });
    },

    resetPassword: function (id, code, pass, callback) {
        var errorMsg = 'resetPassword: Error -- %o';
        var hashMsg = 'resetPassword: Got new hash';

        this.checkResetRecord(id, code, function (error) {
            if (error) {
                log(errorMsg, error);
                callback(error);
            } else {
                getHash(pass, function (error, hash) {
                    log(hashMsg);
                    updateUserRecord(id, { password: hash }, callback);
                });
            }
        });
    }
};
