'use strict';

var fs = require('fs');
var dbman = require('../../dbman');
var pdfgen = require('../../pdfgen');
var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[route.toolReport]-  '});
var tools = dbman.getCollection('tools');

module.exports = {
    get: function (req, res) {
        tools.find().toArray(function(err, toolsArray) {
            if(err)
            {
                log('GET: Error getting tools: %s', err);
                res.render('hero-unit', {
                    title: 'Could Not Generate Tool Report',
                    header: 'Sorry!',
                    message: 'There was a problem generating the tool report. Please try again later.',
                    _layoutFile: 'default'
                });
            }
            else if(!tools)
            {
                log('GET: No Tools found.');
                res.render('hero-unit', {
                    title: 'No Tools Found',
                    header: 'Sorry!',
                    message: 'No tools were found. Please try again later.',
                    _layoutFile: 'default'
                });
            }
            else
            {
                log('GET: %s tools found.', toolsArray.length);
                //determin which tools need to be sent
                var toolsRequestArray = [];
                for(var i=0; i<toolsArray; i++)
                {
                    var currTool = toolsArray[i];
                    var requestAmount = currTool.numberRequested - currTool.totalAvailable;
                    if(currTool.maxRequest === 'on')
                    {
                        requestAmount = (requestAmount < currTool.maxrequestValue) ? requestAmount: currTool.maxrequestValue;
                    }
                    if(requestAmount !== 0)
                    {
                        currTool.requestAmount = requestAmount;
                        toolsRequestArray.add(currTool);
                    }
                }
                var options = {locals: {tools: toolsRequestArray}, template: 'toolReport', path: '/staff/toolReport.pdf', onSuccess: function(message){
                    log('GET: Success: %s', message);
                    res.sendfile('/staff/toolReport.pdf', function(sendErr){
                        if(sendErr)
                        {
                            log('GET: Unable to send file. Error: %s', sendErr);
                            res.render('hero-unit', {
                                title: 'Could Not Generate Tool Report',
                                header: 'Sorry!',
                                message: 'There was a problem generating the tool report. Please try again later.',
                                _layoutFile: 'default'
                            });
                        }
                        else
                        {
                            log('GET: Transfer Complete.');
                        }
                        fs.unlink('toolReport.pdf', function(unlinkErr){
                            if(unlinkErr)
                            {
                                log('GET: Unlink Error: %s', unlinkErr);
                            }
                        });
                    });
                }, onError: function() {
                    log('GET: Error rendering file');
                }};
                pdfgen.render(options);
            }
        });
    },

    failure: function (req, res) {
        res.send(200);
    }
};
