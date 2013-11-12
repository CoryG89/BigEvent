'use strict';

var fs = require('fs');
var moment = require('moment');
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
                //determine which tools need to be sent
                var toolsRequestArray = [];
                for(var i=0; i<toolsArray.length; i++)
                {
                    var currTool = toolsArray[i];
                    log('GET: currTool: %s', currTool.name);
                    log('GET: currTool.maxRequest: %s', currTool.maxRequest);
                    var requestAmount = currTool.numberRequested;
                    if(requestAmount > currTool.totalAvailable) //if this is false then there is enough tools in the tool shed to cover the request
                    {
                        requestAmount -= currTool.totalAvailable;
                        log('GET: requestAmount: %s', requestAmount);
                        if(currTool.maxRequest === 'on')
                        {
                            requestAmount = (requestAmount < currTool.maxRequestValue) ? requestAmount : currTool.maxRequestValue;
                        }
                        if(requestAmount !== 0)
                        {
                            currTool.requestAmount = requestAmount;
                            toolsRequestArray.push(currTool);
                        }
                    }
                }
                log('GET: number of tools with requests: %s', toolsRequestArray.length);

                pdfgen.render({
                    locals: {
                        site: { url: req.protocol + '://' + req.host },
                        tools: toolsRequestArray,
                    },
                    template: 'toolReport',
                    path: 'toolReport.pdf',
                    onSuccess: function () {
                        res.sendfile('toolReport.pdf', function (sendErr) {
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
                    },
                    onError: function () {
                        log('GET: Error rendering file');
                    }
                });

            }
        });
    },

    failure: function (req, res) {
        res.send(200);
    }
};
