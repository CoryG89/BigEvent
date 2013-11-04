'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.zipcodes]-  ' });
var zips = dbman.getCollection('zips');

module.exports = {
    get: function (req, res) {
        var query = { _id: '1z2i3p4s5'};
        var options = { };
        zips.findOne(query, options, function(err, zipDoc) {
            if(err || !zipDoc){
                log('GET: Could not get Zip Codes');
                res.render('zip-codes', {
                    title: 'Update Zip Codes',
                    zips: zipDoc,
                    _layoutFile: 'default'
                });
            }
            else{
                log('GET: Found Zips %s:', zipDoc.zips);
                log('GET: Found Zips %s:', zipDoc.zips.join(','));
                res.render('zip-codes', {
                    title: 'Update Zip Codes',
                    zips: zipDoc.zips.join(', '),
                    _layoutFile: 'default'
                });
            }
        });
    },

    post: function (req, res) {
        var record = req.body;
        record._id = '1z2i3p4s5';

        //verify zips
        var zipsString = record.zips;
        var zipArray = zipsString.split(' ').join('').split(',');
        log('zipArray: %s', zipArray);
        for(var i=0; i<zipArray.length; i++)
        {
            var currentZip = zipArray[i];
            if(currentZip.length !== 5)
            {
                res.send('There is an error in the ' + (i+1) + ' entry. This is not a valid zip code. It should have a length of 5 digits.', 400);
            }
            for(var j=0; j<currentZip.length; j++)
            {
                if(!(/^\d+$/.test(currentZip.charAt(j))))
                {
                    res.send('There is an error in the ' + (i+1) + 'entry and the ' + (j+1) + 'character. This character is not an integer.', 400);
                }
            }
        }
        record.zips = zipArray;
        var query = {_id: '1z2i3p4s5'};
        var options = { w: 1, upsert:true};
        zips.update(query, record, options, function(err, result) {
            if (err || !result) {
                log('POST: Error updating zip codes:\n\n%s\n\n', err);
                res.send('Error', 400);
            } else {
                log('POST: Zips Updated');
                res.send('ok', 200);
            }
        });
    },

    success: function (req, res) {
        res.render('hero-unit', {
            title: 'Zip Codes Updated',
            header: 'Zip Codes Updated',
            message: 'You successfully updated the Zip Codes that are allowed when registering a job site.',
            _layoutFile: 'default'
        });
    },

    failure: function (req, res) {
        res.render('hero-unit', {
            title: 'Submission Failed',
            header: 'Sorry!',
            message: 'There was a problem updating the Zip Codes that are allowed when registering a job site.',
            _layoutFile: 'default'
        });
    }
};
