'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.tool]-  ' });
var tools = dbman.getCollection('tools');
var volunteers = dbman.getCollection('volunteers');
var jobSites = dbman.getCollection('jobsites');

//set vars to control paginations.
var numberOfItems = 10;

function getLists(error, toolPageNumber, volunteersPageNumber, jobSitePageNumber, callback) {
    //get tools
    tools.find().skip(numberOfItems * (toolPageNumber - 1)).limit(numberOfItems).toArray(function(terr, toolDocs){
        if(terr){
            log('STAFFHOMEPAGE.GETLISTS: Error getting list of tools -> err: %s', terr);
            error += "Error getting Tools.\n";
        } else if (!toolDocs) {
            log('STAFFHOMEPAGE.GETLISTS: Error getting list of tools -> err: unknown');
            error += "Error getting Tools.\n";
        }
        //get volunteers
        volunteers.find().skip(numberOfItems * (volunteersPageNumber - 1)).limit(numberOfItems).toArray(function(verr, volunteerDocs){
            if(verr){
                log('STAFFHOMEPAGE.GETLISTS: Error getting list of volunteers -> err: %s', verr);
                error += "Error getting Volunteers.\n";
            } else if (!volunteerDocs) {
                log('STAFFHOMEPAGE.GETLISTS: Error getting list of volunteers -> err: unknown');
                error += "Error getting Volunteers.\n";
            }
            //get job sites
            jobSites.find().skip(numberOfItems * (jobSitePageNumber - 1)).limit(numberOfItems).toArray(function(jerr, jobSiteDocs){
                if(jerr){
                    log('STAFFHOMEPAGE.GETLISTS: Error getting list of job sites -> err: %s', jerr);
                    error += "Error getting Job Sites.\n";
                } else if (!jobSiteDocs) {
                    log('STAFFHOMEPAGE.GETLISTS: Error getting list of job sites -> err: unknown');
                    error += "Error getting Job Sites.\n";
                }
                callback(error, toolDocs, volunteerDocs, jobSiteDocs);
            });
        });
    });
}

function getCounts(callback){
    var error = "";
    //count the number of tools
    tools.count(function(terr, toolCount) {
        if(terr){
            log('STAFFHOMEPAGE.GETCOUNTS: Error getting tool count -> err: %s', terr);
            error += "Error getting Tool Count.\n";
        }
        log('STAFFHOMEOAGE.GETCOUNTS: Tool Count: %s', toolCount);
        //get volunteer count
        volunteers.count(function(verr, volCount){
            if(verr){
                log('STAFFHOMEPAGE.GETCOUNTS: Error getting volunteer count -> err: %s', verr);
                error += "Error getting Volunteer Count.\n";
            }
            log('STAFFHOMEOAGE.GETCOUNTS: Volunteer Count: %s', volCount);
            //get job site count 
            jobSites.count(function(jerr, jobCount){
               if(jerr){
                    log('STAFFHOMEPAGE.GETCOUNTS: Error getting job count -> err: %s', jerr);
                    error += "Error getting Job Count.\n";
                }
                log('STAFFHOMEOAGE.GETCOUNTS: Job Site Count: %s', jobCount);
                callback(error, toolCount, volCount, jobCount);
            });
        });
    });
}

module.exports = {

    get: function (req, res) {
        //check to see if you the user is a staff member
        var user = req.session.user;
        if(!(user.role === 'executive' || user.role === 'coordinator' || user.role === 'committee' || user.role === 'leadership')){
            res.render('hero-unit', {
                title: 'Access Denied',
                header: 'Access Denied',
                message: 'You are not allowed to view this page because you are not part of the Big Event Staff.',
                user: user,
                _layoutFile: 'default'
            });
        }
        //tool pagination variables
        var toolPageNumber = parseInt(req.query.tp);

        //volunteer pagination variables
        var volunteersPageNumber = parseInt(req.query.vp);

        //job sites pagination variables
        var jobSitePageNumber = parseInt(req.query.jp);

        getCounts(function(error, toolCount, volCount, jobCount) {
            //get number of pages for each table
            var toolNumPages = Math.ceil(toolCount/numberOfItems);
            var volNumPages = Math.ceil(volCount/numberOfItems);
            var jobSiteNumPages = Math.ceil(jobCount/numberOfItems);
            //get lists to populate each table
            getLists(error, toolPageNumber, volunteersPageNumber, jobSitePageNumber, function(error, toolDocs, volunteerDocs, jobSiteDocs) {
                log('\n\nvolPages: %s    volPageNumber: %s    volCount: %s\n\n', volNumPages, volunteersPageNumber, volCount);
                //render page
                res.render('staffHomePage', {
                    title: 'Staff Home Page',
                    toolList: toolDocs,
                    tp: toolPageNumber,
                    tpt: (toolNumPages === 0) ? 1 : toolNumPages,
                    volunteerList: volunteerDocs,
                    vp: volunteersPageNumber,
                    vpt: (volNumPages === 0) ? 1 : volNumPages,
                    jobSiteList: jobSiteDocs,
                    jp: jobSitePageNumber,
                    jpt: (jobSiteNumPages === 0) ? 1 : jobSiteNumPages,
                    user: user,
                    error: error,
                    _layoutFile: 'default'
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
            newRecord.maxRequest = 'off';
        }

        //check to see if we already have a tool by this name
        log('POST: Checking for name -- %s', newRecord.name);
        tools.findOne({name: newRecord.name}, function(error, oldRecord){
            if(error)
            {
                log('POST: Error checking database for tool', error);
                res.send(400, 'Error');
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
                res.send(400, 'Entry Found');
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Tool Added',
            header: 'Tool Added',
            message: 'Tool was added successfully.',
            user: req.session.user,
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Could Not Add Tool',
            header: 'Sorry!',
            message: 'There was a problem adding your tool. Please try again later.',
            user: req.session.user,
            _layoutFile: 'default'
        });
    }

};
