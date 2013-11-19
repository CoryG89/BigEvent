'use strict';

var dbman = require('../../dbman');
var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[routes.staffHome]-  ' });

var users = dbman.getCollection('users');
var jobsites = dbman.getCollection('jobsites');
var tools = dbman.getCollection('tools');

var userHeaders = [
    'Last Name', 'First Name', 'Email', 'Phone', 'Gender', 'Shirt Size',
    'Address'
];

var jobsiteHeaders = [
    'Last Name', 'First Name', 'Email', 'Phone', 'Alt. Phone', 'Address'
];

var toolHeaders = [
    'Name', 'Quantity', 'Max Request Limit'
];

function getUserRow(role, doc) {
    return [
        doc[role].lastName, doc[role].firstName, doc.email, doc[role].phone,
        doc[role].gender, doc[role].shirtSize, doc[role].formattedAddress
    ];
}

function getJobsiteRow(doc) {
    return [
        doc.lastName, doc.firstName, doc.email, doc.phone, doc.altPhone,
        doc.formattedAddress
    ];
}

function getToolRow(doc) {
    return [
        doc.name, doc.totalAvailable, doc.maxRequestValue
    ];
}

function getUserData(role, callback) {
    var data = [];
    users.find({ role: role }).toArray(function (err, docs) {
        if (err) {
            callback(err);
        } else {
            docs.forEach(function (e, i) {
                data[i] = {
                    _id: e._id,
                    data: getUserRow(role, e)
                };
            });
            callback(null, data);
        }
    });
}

function getJobsiteData(callback) {
    var data = [];
    jobsites.find().toArray(function (err, docs) {
        if (err) {
            callback(err);
        } else {
            docs.forEach(function (e, i) {
                data[i] = {
                    _id: e._id,
                    data: getJobsiteRow(e)
                };
            });
            callback(null, data);
        }
    });
}

function getToolData(callback) {
    var data = [];
    tools.find().toArray(function (err, docs) {
        if (err) {
            callback(err);
        } else {
            docs.forEach(function (e, i) {
                data[i] = {
                    _id: e._id,
                    data: getToolRow(e)
                };
            });
            callback(null, data);
        }
    });
}

function getTableData(callback) {
    var numTasks = 6;
    var tasksCompleted = 0;
    var tableData = { };

    getUserData('volunteer', function (err, rows) {
        if (err) {
            log('Error getting volunteer data:\n\n\t%s\n', err);
        } else {
            log('Successfully got volunteer data');
            tableData.volunteer = {
                title: 'Volunteers',
                id: 'volunteer-table',
                headers: userHeaders,
                rows: rows,
                linkField: 0,
                linkPath: 'staff/volunteer/account'
            };
        }
        if (++tasksCompleted === numTasks)
            callback(tableData);
    });

    getUserData('coordinator', function (err, data) {
        if (err) {
            log('Error getting coordinator data:\n\n\t%s\n', err);
        } else {
            log('Successfully got coordinator data');
            tableData.coordinator = {
                title: 'Project Coordinators',
                id: 'coordinator-table',
                headers: userHeaders,
                rows: data
            };
        }
        if (++tasksCompleted === numTasks)
            callback(tableData);
    });

    getUserData('leadership', function (err, data) {
        if (err) {
            log('Error getting leadership data:\n\n\t%s\n', err);
        } else {
            log('Successfully got leadership data');
            tableData.leadership = {
                title: 'Leadership',
                id: 'leadership-table',
                headers: userHeaders,
                rows: data
            };
        }
        if (++tasksCompleted === numTasks)
            callback(tableData);
    });

    getUserData('committee', function (err, data) {
        if (err) {
            log('Error getting committtee data:\n\n\t%s\n', err);
        } else {
            log('Successfully got committee data');
            tableData.committee = {
                title: 'Committee',
                id: 'committee-table',
                headers: userHeaders,
                rows: data
            };
        }
        if (++tasksCompleted === numTasks)
            callback(tableData);
    });

    getJobsiteData(function (err, data) {
        if (err) {
            log('Error getting jobsite data:\n\n\t%s\n', err);
        } else {
            log('Successfully got jobsite data');
            tableData.jobsite = {
                title: 'Job Sites',
                id: 'jobsite-table',
                headers: jobsiteHeaders,
                rows: data,
                linkField: 0,
                linkPath: 'staff/jobsite/evaluation'
            };
        }
        if (++tasksCompleted === numTasks)
            callback(tableData);
    });

    getToolData(function (err, data) {
        if (err) {
            log('Error getting tool data:\n\n\t%s\n', err);
        } else {
            log('Successfully got tool data');
            tableData.tool = {
                title: 'Tools',
                id: 'tool-table',
                headers: toolHeaders,
                rows: data,
                linkField: 0,
                linkPath: 'staff/tool/review'
            };
        }
        if (++tasksCompleted === numTasks)
            callback(tableData);
    });
}

module.exports = {
    get: function (req, res) {
        getTableData(function(tableData) {
            res.render('staffHome', {
                title: 'Staff',
                tableData: tableData
            });
        });
    }
};
