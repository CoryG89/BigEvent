'use strict';

var fs = require('fs');
var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[route.waiver]-  ' });

module.exports = {
    get: function (req, res) {
        log('Get: Attempting to read file.');
        fs.readFile(__dirname + '/../../uploads/waiver.txt', function(err, data) {
            if(err)
            {
                log('Get: Unable to read file. Err: %s', data);
                res.render('waiver', {
                    title: 'waiver',
                    content: 'Uable to load file'
                });
            }
            else
            {
                log('Get: Read file Successfully. Rendering page...');
                res.render('waiver', {
                    title: 'waiver',
                    content: data
                });
            }
        });
    },

    getUpdateForm: function (req, res) {
        log('GetUpdateForm: Loading waiver update form.');
        res.render('updateWaiver', {
            title: 'Update Waiver',
        });
    },

    update: function (req, res) {
        var file = req.files.file;
        log('Update: Saveing file with name: %s', file.name);
        //check to see if the file is a .txt file
        if(file.name.substr(file.name.lastIndexOf('.') + 1) === 'txt')
        {
            log('Update: Correct File Extention: %s', file.name.substr(file.name.lastIndexOf('.') + 1));
            //save file
            fs.rename(file.path, __dirname + '/../../uploads/waiver.txt', function(err) {
                if(err)
                {
                    log('Update: Error saving file: %s', err);
                    res.send(400, 'Error');
                }
                else
                {
                    log('Update: File Saved Successfully');
                    res.send(200, 'ok');
                }
            });
        }
        else
        {
            log('Update: Incorrect File Extention: %s', file.name.substr(file.name.lastIndexOf('.') + 1));
            res.send(400, 'ext');
        }
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Unable to Update',
            header: 'Unable to Update Waiver!',
            message: 'There was a problem updating the waiver. Please try again later.'
        });
    }
};
