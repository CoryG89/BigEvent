'use strict';

module.exports = {
    init: function (app) {
        var routes = require('./routes');
        
        app.get('/', routes.home);
        app.get('/home', routes.home);

        app.get('/signin', routes.signin.get);
        app.post('/signin', routes.signin.post);

        app.get('/volunteer', routes.volunteer.get);
        app.post('/volunteer', routes.volunteer.post);
        app.get('/volunteer/success', routes.volunteer.success);
        app.get('/volunteer/failure', routes.volunteer.failure);

        app.get('/volunteer/account', routes.volunteer.account.get);
        app.post('/volunteer/account', routes.volunteer.account.post);
        app.get('/volunteer/account/success', routes.volunteer.account.success);
        app.get('/volunteer/account/failure', routes.volunteer.account.failure);
        
        app.get('/volunteer/account/id/:id', routes.volunteer.account.id.get);
        app.post('/volunteer/account/id/:id', routes.volunteer.account.id.post);

        app.get('/jobsite/request', routes.jobsite.request.get);
        app.post('/jobsite/request', routes.jobsite.request.post);
        app.get('/jobsite/request/success', routes.jobsite.request.success);
        app.get('/jobsite/request/failure', routes.jobsite.request.failure);

        app.get('/jobsite/evaluation', routes.jobsite.evaluation.get);
        app.post('/jobsite/evaluation', routes.jobsite.evaluation.post);
        app.get('/jobsite/evaluation/success', routes.jobsite.evaluation.success);
        app.get('/jobsite/evaluation/failure', routes.jobsite.evaluation.failure);
	
        app.get('/tool', routes.tool.get);
        app.post('/tool', routes.tool.post);
        app.get('/tool/success', routes.tool.success);
        app.get('/tool/failure', routes.tool.failure);

        app.get('/tool/review/:id', routes.tool.review.get);
        app.post('/tool/review/:id', routes.tool.review.post);
        app.get('/tool/review/success', routes.tool.review.success);
        app.get('/tool/review/failure', routes.tool.review.failure);

        app.get('/staffHomePage', routes.staffHomePage.get);
        
        app.get('*', routes.notfound);
    }
};
