'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.staffHomePage]-  ' });
var tools = dbman.getCollection('tools');
var volunteers = dbman.getCollection('volunteers');
var jobSites = dbman.getCollection('jobsites');
var committeeMembers = dbman.getCollection('committee');
var leadershipTeamMembers = dbman.getCollection('leadership');
var projectCoordinators = dbman.getCollection('projectcoordinators');

//set vars to control paginations.
var itemsPerPage = 10;

function getLists(error, callback) {
    //get tools
    tools.find().limit(itemsPerPage).toArray(function(terr, toolDocs){
        if(terr){
            log('STAFFHOMEPAGE.GETLISTS: Error getting list of tools -> err: %s', terr);
            error += 'Error getting Tools.\n';
        } else if (!toolDocs) {
            log('STAFFHOMEPAGE.GETLISTS: Error getting list of tools -> err: unknown');
            error += 'Error getting Tools.\n';
        }
        //get volunteers
        volunteers.find().limit(itemsPerPage).toArray(function(verr, volunteerDocs){
            if(verr){
                log('STAFFHOMEPAGE.GETLISTS: Error getting list of volunteers -> err: %s', verr);
                error += 'Error getting Volunteers.\n';
            } else if (!volunteerDocs) {
                log('STAFFHOMEPAGE.GETLISTS: Error getting list of volunteers -> err: unknown');
                error += 'Error getting Volunteers.\n';
            }
            //get job sites
            jobSites.find().limit(itemsPerPage).toArray(function(jerr, jobSiteDocs){
                if(jerr){
                    log('STAFFHOMEPAGE.GETLISTS: Error getting list of job sites -> err: %s', jerr);
                    error += 'Error getting Job Sites.\n';
                } else if (!jobSiteDocs) {
                    log('STAFFHOMEPAGE.GETLISTS: Error getting list of job sites -> err: unknown');
                    error += 'Error getting Job Sites.\n';
                }
                committeeMembers.find().limit(itemsPerPage).toArray(function(cerr, committeeMemberDocs){
                    if(cerr){
                        log('STAFFHOMEPAGE.GETLISTS: Error getting list of committee members -> err: %s', cerr);
                        error += 'Error getting Committee Members.\n';
                    } else if (!committeeMemberDocs) {
                        log('STAFFHOMEPAGE.GETLISTS: Error getting list of job sites -> err: unknown');
                        error += 'Error getting Job Sites.\n';
                    }
                    leadershipTeamMembers.find().limit(itemsPerPage).toArray(function(lerr, leadershipDocs){
                        if(lerr){
                            log('STAFFHOMEPAGE.GETLISTS: Error getting list of leaderhip team members -> err: %s', lerr);
                            error += 'Error getting leaderhip team members.\n';
                        } else if (!leadershipDocs) {
                            log('STAFFHOMEPAGE.GETLISTS: Error getting list of leadership team members -> err: unknown');
                            error += 'Error getting leadership team members.\n';
                        }
                        projectCoordinators.find().limit(itemsPerPage).toArray(function(perr, pcDocs){
                            if(perr){
                                log('STAFFHOMEPAGE.GETLISTS: Error getting list of project coordinators -> err: %s', perr);
                                error += 'Error getting project coordinators.\n';
                            } else if (!pcDocs) {
                                log('STAFFHOMEPAGE.GETLISTS: Error getting list of project coordinators -> err: unknown');
                                error += 'Error getting project coordinators.\n';
                            }
                            callback(error, toolDocs, volunteerDocs, jobSiteDocs, committeeMemberDocs, leadershipDocs, pcDocs);
                        });
                    });
                });
            });
        });
    });
}

function getCounts(callback){
    var error = '';
    //count the number of tools
    tools.count(function(terr, toolCount) {
        if(terr){
            log('STAFFHOMEPAGE.GETCOUNTS: Error getting tool count -> err: %s', terr);
            error += 'Error getting Tool Count.\n';
        }
        log('STAFFHOMEOAGE.GETCOUNTS: Tool Count: %s', toolCount);
        //get volunteer count
        volunteers.count(function(verr, volCount){
            if(verr){
                log('STAFFHOMEPAGE.GETCOUNTS: Error getting volunteer count -> err: %s', verr);
                error += 'Error getting Volunteer Count.\n';
            }
            log('STAFFHOMEOAGE.GETCOUNTS: Volunteer Count: %s', volCount);
            //get job site count 
            jobSites.count(function(jerr, jobCount){
                if(jerr){
                    log('STAFFHOMEPAGE.GETCOUNTS: Error getting job count -> err: %s', jerr);
                    error += 'Error getting Job Count.\n';
                }
                log('STAFFHOMEOAGE.GETCOUNTS: Job Site Count: %s', jobCount);
                committeeMembers.count(function(cerr, committeeMemberCount){
                    if(cerr){
                        log('STAFFHOMEPAGE.GETCOUNTS: Error getting committee member count -> err: %s', jerr);
                        error += 'Error getting committee member count.\n';
                    }
                    log('STAFFHOMEOAGE.GETCOUNTS: Committee Member Count: %s', jobCount);
                    leadershipTeamMembers.count(function(lerr, leadershipCount){
                        if(lerr){
                            log('STAFFHOMEPAGE.GETCOUNTS: Error getting leadership team member count -> err: %s', jerr);
                            error += 'Error getting leadership team member Count.\n';
                        }
                        log('STAFFHOMEOAGE.GETCOUNTS: Leadership Member Count: %s', jobCount);
                        projectCoordinators.count(function(perr, projectCoordinatorCount){
                            if(perr){
                                log('STAFFHOMEPAGE.GETCOUNTS: Error getting project coordinator count -> err: %s', perr);
                                error += 'Error getting project coordinator Count.\n';
                            }
                            log('STAFFHOMEOAGE.GETCOUNTS: Project Coordnator Count: %s', projectCoordinatorCount);
                            callback(error, toolCount, volCount, jobCount, committeeMemberCount, projectCoordinatorCount, leadershipCount);
                        });
                    });
                });
            });
        });
    });
}

function isStaffRole(role) {
    return role === 'executive' || role === 'coordinator' ||
        role === 'committee' || role === 'leadership';
}

module.exports = {

    get: function (req, res) {
        //check to see if you the user is a staff member
        var user = req.session.user;

        if(!(isStaffRole(user.role))) {
            res.render('hero-unit', {
                title: 'Access Denied',
                header: 'Access Denied',
                message: 'You are not allowed to view this page because you are not part of the Big Event Staff.',
                user: user,
                _layoutFile: 'default'
            });
        } else {
            getCounts(function(error, toolCount, volCount, jobCount, committeeMemberCount, projectCoordinatorCount, leadershipCount) {
                //get number of pages for each table
                var toolNumPages = Math.ceil(toolCount / itemsPerPage);
                var volNumPages = Math.ceil(volCount / itemsPerPage);
                var jobSiteNumPages = Math.ceil(jobCount / itemsPerPage);
                var committeeNumPages = Math.ceil(committeeMemberCount / itemsPerPage);
                var leadershipNumPages = Math.ceil(leadershipCount / itemsPerPage);
                var projectCoordinatorNumPages = Math.ceil(projectCoordinatorCount / itemsPerPage);
                //get lists to populate each table
                getLists(error, function(error, toolDocs, volunteerDocs, jobSiteDocs, committeeMemberDocs, leadershipDocs, pcDocs) {
                    //render page
                    res.render('staffHomePage', {
                        title: 'Staff Home Page',
                        toolList: toolDocs,
                        tpt: (toolNumPages === 0) ? 1 : toolNumPages,
                        volunteerList: volunteerDocs,
                        vpt: (volNumPages === 0) ? 1 : volNumPages,
                        jobSiteList: jobSiteDocs,
                        jpt: (jobSiteNumPages === 0) ? 1 : jobSiteNumPages,
                        committeeList: committeeMemberDocs,
                        cpt: (committeeNumPages === 0) ? 1 : committeeNumPages,
                        leadershipList: leadershipDocs,
                        lpt: (leadershipNumPages === 0) ? 1 : leadershipNumPages,
                        projectCoordinatorList: pcDocs,
                        ppt: (projectCoordinatorNumPages === 0) ? 1 : projectCoordinatorNumPages,
                        user: user,
                        error: error,
                        _layoutFile: 'default'
                    });
                });
            });
        }
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

    updateTable: function (req, res) {
        var type = req.query.type;
        var page = parseInt(req.query.p, 10);
        log('pageNumber: %s', page);

        var sortDir = parseInt(req.query.dir, 10);

        var key = req.query.key;

        var collection;
        if(type === 'volunteer') {
            collection = volunteers;
        } else if(type === 'tool') {
            collection = tools;
        } else if(type === 'jobsite') {
            collection = jobSites;
        } else if(type === 'committee') {
            collection = committeeMembers;
        } else if(type === 'leadership') {
            collection = leadershipTeamMembers;
        } else if(type === 'projectCoordinator') {
            collection = projectCoordinators;
        } else {
            //there was an error
            res.send(400, 'Invalid Type');
        }
        //determine if we must sort
        if(key === '') //this means no sorting is in place.
        {
            //get the entries for the page
            collection.find().skip(itemsPerPage * (page - 1)).limit(itemsPerPage).toArray(function(err, docs){
                if(err){
                    log('STAFFHOMEPAGE.GETLISTS: Error updating table -> err: %s', err);
                    res.send(400, 'Error');
                } else if (!docs) {
                    log('STAFFHOMEPAGE.GETLISTS: Error getting table entries (No entries)');
                    res.send(400, 'No Entries');
                }
                else {
                    res.send(200, docs);
                }
            });
        }
        else
        {
            //get the entries for the page
            //we have to sort differently if the key is doubleName which means its lastName, firstName for the column
            if(key === 'doubleName')
            {
                collection.find().sort([['lastName', sortDir], ['firstName', sortDir]]).skip(itemsPerPage * (page - 1)).limit(itemsPerPage).toArray(function(err, docs){
                    if(err){
                        log('STAFFHOMEPAGE.GETLISTS: Error updating table -> err: %s', err);
                        res.send(400, 'Error');
                    } else if (!docs) {
                        log('STAFFHOMEPAGE.GETLISTS: Error getting table entries (No entries)');
                        res.send(400, 'No Entries');
                    }
                    else {
                        res.send(200, docs);
                    }
                });
            }
            else
            {
                collection.find().sort(key, sortDir).skip(itemsPerPage * (page - 1)).limit(itemsPerPage).toArray(function(err, docs){
                    if(err){
                        log('STAFFHOMEPAGE.GETLISTS: Error updating table -> err: %s', err);
                        res.send(400, 'Error');
                    } else if (!docs) {
                        log('STAFFHOMEPAGE.GETLISTS: Error getting table entries (No entries)');
                        res.send(400, 'No Entries');
                    }
                    else {
                        res.send(200, docs);
                    }
                });
            }
        }
    },

    sort: function (req, res){
        var type = req.query.type;

        var key = req.query.key;
        
        var sortDir = parseInt(req.query.dir, 10);

        var collection;
        if(type === 'volunteer') {
            collection = volunteers;
        } else if(type === 'tool') {
            collection = tools;
        } else if(type === 'jobsite') {
            collection = jobSites;
        } else if(type === 'committee') {
            collection = committeeMembers;
        } else if(type === 'leadership') {
            collection = leadershipTeamMembers;
        } else if(type === 'projectCoordinator') {
            collection = projectCoordinators;
        } else {
            //there was an error
            res.send(400, 'Invalid Type');
        }

        //we have to sort differently if the key is doubleName which means its lastName, firstName for the column
        if(key === 'doubleName')
        {
            collection.find().sort([['lastName', sortDir], ['firstName', sortDir]]).limit(itemsPerPage).toArray(function(err, docs){
                if(err){
                    log('STAFFHOMEPAGE.GETLISTS: Error updating table -> err: %s', err);
                    res.send(400, 'Error');
                } else if (!docs) {
                    log('STAFFHOMEPAGE.GETLISTS: Error getting table entries (No entries)');
                    res.send(400, 'No Entries');
                }
                else {
                    res.send(200, docs);
                }
            });
        }
        else
        {
            collection.find().sort(key, sortDir).limit(itemsPerPage).toArray(function(err, docs){
                if(err){
                    log('STAFFHOMEPAGE.GETLISTS: Error updating table -> err: %s', err);
                    res.send(400, 'Error');
                } else if (!docs) {
                    log('STAFFHOMEPAGE.GETLISTS: Error getting table entries (No entries)');
                    res.send(400, 'No Entries');
                }
                else {
                    res.send(200, docs);
                }
            });
        }
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
