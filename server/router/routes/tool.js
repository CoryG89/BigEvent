'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');
var emailer = require('../../emailer');

var log = debug.getLogger({ prefix: '[route.tool]-  ' });
var tools = dbman.getCollection('tools');

module.exports = {

    get: function (req, res) {
        res.render('tool', {
            title: 'Add Tool',
            _layoutFile: 'default'
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
                tools.insert(newRecord, { w: 1 }, function (err, result) {
                    if (err) {
                        log('POST: Error adding new record:\n\n%s\n\n', err);
                        res.send(400);
                    } else {
                        log('POST: New record successfully added to database');
                        res.send(200, {recordName: newRecord.name});
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
        res.render('heroMessage', {
            title: 'Tool Added',
            header: 'Tool Added',
            message: 'Tool was added successfully.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('heroMessage', {
            title: 'Could Not Add Tool',
            header: 'Sorry!',
            message: 'There was a problem adding your tool. Please try again later.',
            _layoutFile: 'default'
        });
    },

    review: {
        get: function(req, res){
            var toolName = req.params.recordName;
            log('REVIEW.GET: Get Tool with name: %s', toolName);
            tools.findOne({name: toolName}, function(error, record){
                if(error){
                    log("REVIEW.GET: Error looking for record with name: %s", toolName);
                    res.send(400, "Error looking for record with name: %s", toolName);
                }
                else if(!record){
                    res.send(400, "REVIEW.GET: Unable to find record with name: %s", toolName);
                }
                else{
                    log("REVIEW.GET: Found record with name: %s", toolName);
                    res.render('toolReview', {
                        title: 'Edit Tool',
                        record: record,
                        _layoutFile: 'default'
                    });
                }
            });
        },

        post: function(req, res){

        },

        success: function (req, res) {
            res.render('heroMessage', {
                title: 'Tool Edited',
                header: 'Tool Edited',
                message: 'Tool was edited successfully.',
                _layoutFile: 'default'
            });
        },

        failure: function (req, res) {
            res.render('heroMessage', {
                title: 'Could Not Edit Tool',
                header: 'Sorry!',
                message: 'There was a problem Editing your tool. Please try again later.',
                _layoutFile: 'default'
            });
        }
    }

};
