'use strict';

var debug = require('../../debug');
var dbman = require('../../dbman');

var log = debug.getLogger({ prefix: '[route.zipcodes]-  ' });
var zips = dbman.getCollection('zips');

module.exports = {
    get: function (req, res) {
        zips.find().toArray(function(err, zipDocs){
            if(err || !zipDocs){
                log('GET: Could not get Zip Codes');
            }
            else{
                var zipMap = zipDocs[0];
                var counties = ['Lee', 'Chambers', 'Russell', 'Macon', 'Tallapoosa', 'Harris', 'Muscogee'];
                var zipValues = {
                    Lee: zipMap['lee-county-zips'],
                    Chambers: zipMap['chambers-county-zips'],
                    Russell: zipMap['russell-county-zips'],
                    Macon: zipMap['macon-county-zips'],
                    Tallapoosa: zipMap['tallapoosa-county-zips'],
                    Harris: zipMap['harris-county-zips'],
                    Muscogee: zipMap['muscogee-county-zips']
                };
                var zips = [];
                for(var i=0; i<counties.length; i++)
                {
                    var currentValue = zipValues[counties[i]];
                    if(currentValue !== undefined)
                    {
                        zips.push.apply(zips, currentValue.toString().split(','));
                    }
                }
                res.render('zip-codes', {
                    title: 'Update Zip Codes',
                    zipCodes: zips,
                    _layoutFile: 'default'
                });
            }
        });
    },

    post: function (req, res) {
        var record = req.body;
        record._id = '1z2i3p4s5';

        var query = {_id: '1z2i3p4s5'};
        var options = { w: 1, upsert:true};
        zips.update(query, record, options, function(err, result) {
            if (err || !result) {
                log('POST: Error updating zip codes:\n\n%s\n\n', err);
                res.send(400);
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
