'use strict';

var dbman = require('../../dbman');
var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[routes.staffHome]-  ' });

var users = dbman.getCollection('users');
var jobsites = dbman.getCollection('jobsites');
var tools = dbman.getCollection('tools');

var userHeaders = [
    'Name', 'Email', 'Phone', 'Gender', 'Shirt Size', 'Address'
];

var jobsiteHeaders = [
    'Name', 'Email', 'Phone', 'Alt. Phone', 'Address'
];

var toolHeaders = [
    'Name', 'Quantity', 'Max Request Value'
];

function getUserRow(role, doc) {
    return {
        _id: doc._id,
        rowData: [
            doc[role].lastName + ', ' + doc[role].firstName, doc.email,
            doc[role].phone, doc[role].gender, doc[role].shirtSize,
            doc[role].formattedAddress
        ]
    };
}

function getJobsiteRow(doc) {
    return {
        _id: doc._id,
        rowData: [
            doc.lastName + ', ' + doc.firstName, doc.email, doc.phone,
            doc.altPhone, doc.formattedAddress
        ]
    };
}

function getToolRow(doc) {
    return {
        _id: doc._id,
        rowData: [
            doc.name, doc.inventory, doc.maxRequestValue
        ]
    };
}

function getUserData(role, callback) {
    users.find({ role: role }).toArray(function (err, docs) {
        if (err) callback(err);
        else callback(null, docs.map(getUserRow));
    });
}

function getJobsiteData(callback) {
    jobsites.find().toArray(function (err, docs) {
        if (err) callback(err);
        else callback(null, docs.map(getJobsiteRow));
    });
}

function getToolData(callback) {
    tools.find().toArray(function (err, docs) {
        if (err) callback(err);
        else callback(null, docs.map(getToolRow));
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
                linkField: {
                    column: 0,
                    path: '/staff/volunteer/account/'
                }
            };
        }
        if (++tasksCompleted === numTasks) callback(tableData);
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
        if (++tasksCompleted === numTasks) callback(tableData);
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
        if (++tasksCompleted === numTasks) callback(tableData);
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
        if (++tasksCompleted === numTasks) callback(tableData);
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
                linkField: {
                    column: 0,
                    path: '/staff/jobsite'
                }
            };
        }
        if (++tasksCompleted === numTasks) callback(tableData);
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
                linkField: {
                    column: 0,
                    path: '/staff/tool/review'
                }
            };
        }
        if (++tasksCompleted === numTasks) callback(tableData);
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
