'use strict';

var fs = require('fs');
var uuid = require('node-uuid');
var dbman = require('../../dbman');
var pdfgen = require('../../pdfgen');
var debug = require('../../debug');
var log = debug.getLogger({ prefix: '[route.toolReport]-  '});
var tools = dbman.getCollection('tools');
var jobsites = dbman.getCollection('jobsites');

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
                jobsites.find().toArray(function(jerr, jobSiteArray){
                    if(jerr)
                    {
                        log('GET: Error getting jobsites. Err: %s', jerr);
                        res.render('hero-unit', {
                            title: 'Error',
                            header: 'Error generating Report.',
                            message: 'There was an error generating the report.'
                        });
                    }
                    else if(!jobSiteArray)
                    {
                        log('GET: Uable to get jobsites.');
                        res.render('hero-unit', {
                            title: 'Error',
                            header: 'Error generating Report.',
                            message: 'There was an error generating the report.'
                        });
                    }
                    else
                    {
                        //determine which tools need to be sent
                        var toolsRequestArray = [];
                        for(var i=0; i<toolsArray.length; i++)
                        {
                            var currTool = toolsArray[i];
                            log('GET: currTool: %s', currTool.name);
                            log('GET: currTool.maxRequest: %s', currTool.maxRequest);
                            //we need to loop through jobsites to determine how many of each tool
                            //is needed
                            var toolsNeeded = {};
                            for(var j=0; j<jobSiteArray.length; j++)
                            {
                                if(jobSiteArray[i].evaluation)
                                {
                                    var evalTools = jobSiteArray[i].evaluation.tools;
                                    for(var k=0; k<evalTools.length; k++)
                                    {
                                        var currEvalTool = evalTools[j];
                                        if(toolsNeeded[currEvalTool.name])
                                        {
                                            toolsNeeded[currEvalTool.name] += currEvalTool.quantity;
                                        }
                                        else
                                        {
                                            toolsNeeded[currEvalTool.name] = currEvalTool.quantity;
                                        }
                                    }
                                }
                            }
                            
                            //detrmine how many are to be requested
                            if(toolsNeeded[currTool.name] || toolsNeeded[currTool.name] > currTool.inventory) //determine if we need to request any of this tool
                            {
                                var numNeeded = toolsNeeded[currTool.name];
                                numNeeded -= currTool.inventory;
                                log('GET: numNeeded: %s', numNeeded);
                                if(currTool.maxRequest === 'on')
                                {
                                    numNeeded = (numNeeded < currTool.maxRequestValue) ? numNeeded : currTool.maxRequestValue;
                                }
                                if(numNeeded !== 0)
                                {
                                    toolsRequestArray.push({name: currTool.name, value: numNeeded});
                                }
                            }
                        }
                        log('GET: number of tools with requests: %s', toolsRequestArray.length);

                        var tempFilename = uuid.v4() + '.pdf';

                        pdfgen.render({
                            locals: {
                                site: { url: req.protocol + '://' + req.host + '/' },
                                tools: toolsRequestArray,
                            },
                            template: 'toolReport',
                            path: tempFilename,
                            onSuccess: function () {
                                res.sendfile(tempFilename, function (sendErr) {
                                    if(sendErr)
                                    {
                                        log('GET: Error sending response: %s', sendErr);
                                    }
                                    else
                                    {
                                        log('GET: Transfer Complete.');
                                    }
                                    fs.exists(tempFilename, function (exists) {
                                        if (exists) {
                                            fs.unlink(tempFilename, function(unlinkErr) {
                                                if(unlinkErr)
                                                {
                                                    log('GET: Unlink Error: %s', unlinkErr);
                                                }
                                                else
                                                {
                                                    log('GET: File Successufully Unlinked.');
                                                }
                                            });
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

            }
        });
    },

    failure: function (req, res) {
        res.send(200);
    }
};
