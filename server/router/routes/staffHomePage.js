'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.staffHomePage]-  ' });
var users = dbman.getCollection('users');
var tools = dbman.getCollection('tools');
var jobSites = dbman.getCollection('jobsites');

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
        users.find({ role: 'volunteer' }).limit(itemsPerPage).toArray(function(verr, volunteerDocs){
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
                users.find({ role: 'committee' }).limit(itemsPerPage).toArray(function(cerr, committeeMemberDocs){
                    if(cerr){
                        log('STAFFHOMEPAGE.GETLISTS: Error getting list of committee members -> err: %s', cerr);
                        error += 'Error getting Committee Members.\n';
                    } else if (!committeeMemberDocs) {
                        log('STAFFHOMEPAGE.GETLISTS: Error getting list of job sites -> err: unknown');
                        error += 'Error getting Job Sites.\n';
                    }
                    users.find({ role: 'leadership' }).limit(itemsPerPage).toArray(function(lerr, leadershipDocs){
                        if(lerr){
                            log('STAFFHOMEPAGE.GETLISTS: Error getting list of leaderhip team members -> err: %s', lerr);
                            error += 'Error getting leaderhip team members.\n';
                        } else if (!leadershipDocs) {
                            log('STAFFHOMEPAGE.GETLISTS: Error getting list of leadership team members -> err: unknown');
                            error += 'Error getting leadership team members.\n';
                        }
                        users.find({ role: 'coordinator' }).limit(itemsPerPage).toArray(function(perr, pcDocs){
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
        log('STAFFHOMEPAGE.GETCOUNTS: Tool Count: %s', toolCount);
        //get volunteer count
        users.count({ role: 'volunteer' }, function(verr, volCount){
            if(verr){
                log('STAFFHOMEPAGE.GETCOUNTS: Error getting volunteer count -> err: %s', verr);
                error += 'Error getting Volunteer Count.\n';
            }
            log('STAFFHOMEPAGE.GETCOUNTS: Volunteer Count: %s', volCount);
            //get job site count 
            jobSites.count(function(jerr, jobCount){
                if(jerr){
                    log('STAFFHOMEPAGE.GETCOUNTS: Error getting job count -> err: %s', jerr);
                    error += 'Error getting Job Count.\n';
                }
                log('STAFFHOMEPAGE.GETCOUNTS: Job Site Count: %s', jobCount);
                users.count({ role: 'committee' }, function(cerr, committeeMemberCount){
                    if(cerr){
                        log('STAFFHOMEPAGE.GETCOUNTS: Error getting committee member count -> err: %s', cerr);
                        error += 'Error getting committee member count.\n';
                    }
                    log('STAFFHOMEPAGE.GETCOUNTS: Committee Member Count: %s', committeeMemberCount);
                    users.count({ role: 'leadership' }, function(lerr, leadershipCount){
                        if(lerr){
                            log('STAFFHOMEPAGE.GETCOUNTS: Error getting leadership team member count -> err: %s', lerr);
                            error += 'Error getting leadership team member Count.\n';
                        }
                        log('STAFFHOMEPAGE.GETCOUNTS: Leadership Member Count: %s', leadershipCount);
                        users.count({ role: 'coordinator' }, function(perr, coordinatorCount){
                            if(perr){
                                log('STAFFHOMEPAGE.GETCOUNTS: Error getting project coordinator count -> err: %s', perr);
                                error += 'Error getting project coordinator Count.\n';
                            }
                            log('STAFFHOMEPAGE.GETCOUNTS: Project Coordnator Count: %s', coordinatorCount);
                            callback(error, toolCount, volCount, jobCount, committeeMemberCount, coordinatorCount, leadershipCount);
                        });
                    });
                });
            });
        });
    });
}

module.exports = {

    get: function (req, res) {
        getCounts(function(error, toolCount, volCount, jobCount, committeeMemberCount, coordinatorCount, leadershipCount) {
            //get number of pages for each table
            var toolNumPages = Math.ceil(toolCount / itemsPerPage);
            var volNumPages = Math.ceil(volCount / itemsPerPage);
            var jobSiteNumPages = Math.ceil(jobCount / itemsPerPage);
            var committeeNumPages = Math.ceil(committeeMemberCount / itemsPerPage);
            var leadershipNumPages = Math.ceil(leadershipCount / itemsPerPage);
            var coordinatorNumPages = Math.ceil(coordinatorCount / itemsPerPage);
            //get lists to populate each table
            getLists(error, function(error, toolDocs, volunteerDocs, jobSiteDocs, committeeMemberDocs, leadershipDocs, pcDocs) {
                //we need to loop through jobsites to determine how many of each tool
                //is needed
                var toolsNeeded = {};
                for(var i=0; i<jobSiteDocs.length; i++)
                {
                    if(jobSiteDocs[i].evaluation)
                    {
                        var evalToolsList = jobSiteDocs[i].evaluation.tools;
                        for(var j=0; j<evalToolsList.length; j++)
                        {
                            var evalTool = evalToolsList[j];
                            if(toolsNeeded[evalTool.name])
                            {
                                toolsNeeded[evalTool.name] += evalTool.quantity;
                            }
                            else
                            {
                                toolsNeeded[evalTool.name] = evalTool.quantity;
                            }
                        }
                    }
                }
                
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
                    toolsNeeded: toolsNeeded,
                    coordinatorList: pcDocs,
                    ppt: (coordinatorNumPages === 0) ? 1 : coordinatorNumPages,
                    error: error
                });
            });
        });
    },

    updateTable: function (req, res) {
        var type = req.query.type;
        var page = parseInt(req.query.p, 10);
        log('pageNumber: %s', page);

        var sortDir = parseInt(req.query.dir, 10);

        var key = req.query.key;

        var collection;
        var query;
        if(type === 'tool') {
            collection = tools;
        } else if(type === 'jobsite') {
            collection = jobSites;
        } else if(type === 'volunteer') {
            collection = users;
            query = { role: 'volunteer' };
        } else if(type === 'commiteee') {
            collection = users;
            query = { role: 'commitee' };
        } else if(type === 'leadership') {
            collection = users;
            query = { role: 'leadership' };
        } else if(type === 'coordinator') {
            collection = users;
            query = { role: 'coordinator' };
        } else {
            //there was an error
            res.send(400, 'Invalid Type');
        }
        //determine if we must sort
        if(key === '') //this means no sorting is in place.
        {
            //get the entries for the page
            collection.find(query).skip(itemsPerPage * (page - 1)).limit(itemsPerPage).toArray(function(err, docs){
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
                collection.find(query).sort([['lastName', sortDir], ['firstName', sortDir]]).skip(itemsPerPage * (page - 1)).limit(itemsPerPage).toArray(function(err, docs){
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
                collection.find(query).sort(key, sortDir).skip(itemsPerPage * (page - 1)).limit(itemsPerPage).toArray(function(err, docs){
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
        var query;
        if(type === 'tool') {
            collection = tools;
        } else if(type === 'jobsite') {
            collection = jobSites;
        } else if(type === 'volunteer') {
            collection = users;
            query = { role: 'volunteer' };
        } else if(type === 'commiteee') {
            collection = users;
            query = { role: 'commitee' };
        } else if(type === 'leadership') {
            collection = users;
            query = { role: 'leadership' };
        } else if(type === 'coordinator') {
            collection = users;
            query = { role: 'coordinator' };
        } else {
            //there was an error
            res.send(400, 'Invalid Type');
        }

        //we have to sort differently if the key is doubleName which means its lastName, firstName for the column
        if(key === 'doubleName')
        {
            collection.find(query).sort([['lastName', sortDir], ['firstName', sortDir]]).limit(itemsPerPage).toArray(function(err, docs){
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
            collection.find(query).sort(key, sortDir).limit(itemsPerPage).toArray(function(err, docs){
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

    clearDatabase: function(req, res) {
        res.render('hero-unit', {
            title: 'Implement Me',
            header: 'Implement Me',
            message: 'Clearing the Database is not yet implemented.'
        });
    },

    updateWaiver: function(req, res) {
        res.render('hero-unit', {
            title: 'Implement Me',
            header: 'Implement Me',
            message: 'Updating the Waiver is not yet implemented.'
        });
    },

    updateReports: function (req, res) {
        res.render('hero-unit', {
            title: 'Implement Me',
            header: 'Implement Me',
            message: 'Updating of Reports is not yet implemented.'
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Tool Added',
            header: 'Tool Added',
            message: 'Tool was added successfully.'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Could Not Add Tool',
            header: 'Sorry!',
            message: 'There was a problem adding your tool. Please try again later.'
        });
    }

};
