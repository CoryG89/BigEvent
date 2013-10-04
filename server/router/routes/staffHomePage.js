'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.tool]-  ' });
var tools = dbman.getCollection('tools');
var volunteers = dbman.getCollection('volunteers');
var jobSites = dbman.getCollection('jobSites');
var ObjectId = dbman.getObjectId();

module.exports = {

    get: function (req, res) {
        var error = "";
        //get the roll of this user in order to filter content he or she is allowed to touch
        var userRoll = req.session.user.roll;
        //set the staff variable to control how the site works while this user is logged in
        
        //set var to control paginations.
        //get tools
        tools.find().toArray(function(err, toolDocs){
            if(err){
                log('STAFFHOMEPAGE.GET: Error getting list of tools -> err: %s', err);
                error += "Error getting Tools.\n";
            } else if (!toolDocs) {
                log('STAFFHOMEPAGE.GET: Error getting list of tools -> err: unknown');
                error += "Error getting Tools.\n";
            }
            //get volunteers
            volunteers.find().toArray(function(err, volunteerDocs){
                if(err){
                    log('STAFFHOMEPAGE.GET: Error getting list of volunteers -> err: %s', err);
                    error += "Error getting Volunteers.\n";
                } else if (!volunteerDocs) {
                    log('STAFFHOMEPAGE.GET: Error getting list of volunteers -> err: unknown');
                    error += "Error getting Volunteers.\n";
                }
                //get job sites
                jobSites.find().toArray(function(err, jobSiteDocs){
                    if(err){
                        log('STAFFHOMEPAGE.GET: Error getting list of job sites -> err: %s', err);
                        error += "Error getting Job Sites.\n";
                    } else if (!jobSiteDocs) {
                        log('STAFFHOMEPAGE.GET: Error getting list of job sites -> err: unknown');
                        error += "Error getting Job Sites.\n";
                    }
                    //render page
                    res.render('staffHomePage', {
                        title: 'Staff Home Page',
                        toolList: toolDocs,
                        volunteerList: volunteerDocs,
                        jobSiteList: jobSiteDocs,
                        userRoll: userRoll,
                        error: error,
                        _layoutFile: 'default'
                    });
                });
            });
        });
    },

    post: function (req, res) {
        var newRecord = req.body;

        //set the name to all lower case for checking purposes. Saw and saw are the same thing
        newRecord.name = newRecord.name.toLowerCase();

        //check to see if the checkbox was checked. If it was not checked there will be no field for it in the record. Add one
        if(!newRecord.maxRequest)
        {
            newRecord.maxRequest = "off";
        }

        //check to see if we already have a tool by this name
        log('POST: Checking for name -- %s', newRecord.name);
        tools.findOne({name: newRecord.name}, function(error, oldRecord){
            if(error)
            {
                log('POST: Error checking database for tool', error);
                res.send(400, "Error");
            }
            else if(!oldRecord)
            {
                log('POST: Tool not found -> adding new entry to database');
                //calculate the number reamining in storage
                newRecord.numberRemaining = newRecord.totalAvailable - newRecord.numberInUse;
                //insert new entry
                tools.insert(newRecord, { w: 1 }, function (err, records) {
                    if (err || !records) {
                        log('POST: Error adding new record:\n\n%s\n\n', err);
                        res.send(400);
                    } else {
                        log('POST: New record successfully added to database');
                        res.send(200, {id: records[0]._id});
                    }
                });
            }
            else
            {
                log('POST: Found an entry -> notifying user');
                res.send(400, "Entry Found");
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Tool Added',
            header: 'Tool Added',
            message: 'Tool was added successfully.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Could Not Add Tool',
            header: 'Sorry!',
            message: 'There was a problem adding your tool. Please try again later.',
            _layoutFile: 'default'
        });
    }

};