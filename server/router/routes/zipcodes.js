'use strict';

var util = require('util');
var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.zipcodes]-  ' });
var zips = dbman.getCollection('zips');
var zipsDocumentId = '1z2i3p4s5';

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
        //verify zips
        var zipsString = req.body.zips;
        var zipArray = zipsString.replace(/[\r\n\s]+/g, '').split(',');
        log('zipArray: %s', zipArray);

        zipArray.forEach(function (zip, i) {
            if (!/^\d\d\d\d\d$/.test(zip)) {

                var errorMsg = 'Entry %s is not a valid 5 digit zip code';
                res.send(util.format(errorMsg, i+1), 400);

            } else if (i === zipArray.length - 1) {

                var query = { _id: zipsDocumentId };
                var document = { _id: zipsDocumentId, zips: zipArray };
                var options = { w: 1, upsert: true };

                zips.update(query, document, options, function(err, result) {
                    if (err || !result) {
                        log('POST: Error updating zip codes:\n\n%s\n\n', err);
                        res.send('Error', 400);
                    } else {
                        log('POST: Zips Updated');
                        res.send('ok', 200);
                    }
                });
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
