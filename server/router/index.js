'use strict';

module.exports = {
    init: function (app) {
        var routes = require('./routes');
        
        //user side routes
        app.get('/', routes.home);
        app.get('/home', routes.home);

        app.get('/signin', routes.signin.get);
        app.post('/signin', routes.signin.post);

        app.get('/waiver', routes.waiver);

        app.get('/access-denied', routes.accessDenied);

        app.get('/volunteer', routes.volunteer.get);
        app.post('/volunteer', routes.volunteer.post);
        app.get('/volunteer/success', routes.volunteer.success);
        app.get('/volunteer/failure', routes.volunteer.failure);

        app.get('/volunteer/account', routes.volunteer.account.get);
        app.post('/volunteer/account', routes.volunteer.account.post);
        app.get('/volunteer/account/success', routes.volunteer.account.success);
        app.get('/volunteer/account/failure', routes.volunteer.account.failure);

        app.get('/jobsite/request', routes.jobsite.request.get);
        app.post('/jobsite/request', routes.jobsite.request.post);
        app.get('/jobsite/request/success', routes.jobsite.request.success);
        app.get('/jobsite/request/failure', routes.jobsite.request.failure);

        //staff side routes
        app.get('/staff/volunteer/success', routes.volunteer.success);
        app.get('/staff/volunteer/failure', routes.volunteer.failure);

        app.get('/staff/volunteer/account/:id', routes.volunteer.account.staff.get);
        app.post('/staff/volunteer/account/:id', routes.volunteer.account.staff.post);
        app.get('/staff/volunteer/account/success', routes.volunteer.account.success);
        app.get('/staff/volunteer/account/failure', routes.volunteer.account.failure);
        app.post('/staff/volunteer/account/delete/:id', routes.volunteer.account.staff.delete);

        app.get('/staff/jobsite/request', routes.jobsite.request.get);
        app.post('/staff/jobsite/request', routes.jobsite.request.staff.post);
        app.get('/staff/jobsite/request/success', routes.jobsite.request.success);
        app.get('/staff/jobsite/request/failure', routes.jobsite.request.failure);

        app.get('/staff/jobsite/evaluation/:id', routes.jobsite.evaluation.get);
        app.post('/staff/jobsite/evaluation/:id', routes.jobsite.evaluation.post);
        app.get('/staff/jobsite/evaluation/success', routes.jobsite.evaluation.success);
        app.get('/staff/jobsite/evaluation/failure', routes.jobsite.evaluation.failure);
        app.post('/staff/jobsite/evaluation/delete/:id', routes.jobsite.evaluation.delete);
	
        app.get('/staff/tool', routes.tool.get);
        app.post('/staff/tool', routes.tool.post);
        app.get('/staff/tool/success', routes.tool.success);
        app.get('/staff/tool/failure', routes.tool.failure);

        app.get('/staff/tool/review/:id', routes.tool.review.get);
        app.post('/staff/tool/review/:id', routes.tool.review.post);
        app.post('/staff/tool/review/delete/:id', routes.tool.review.delete);
        app.get('/staff/tool/review/success', routes.tool.review.success);
        app.get('/staff/tool/review/failure', routes.tool.review.failure);

        app.get('/staff/staffHomePage', routes.staffHomePage.get);
        app.get('/staff/staffHomePage/updateTable', routes.staffHomePage.updateTable);
        app.get('/staff/staffHomePage/sort', routes.staffHomePage.sort);

        app.get('/staff/logout', routes.staffHomePage.logout);
        app.get('/staff/printHomeDepotReport', routes.staffHomePage.printHomeDepotReport);
        app.get('/staff/clearDatabase', routes.staffHomePage.clearDatabase);
        app.get('/staff/updateWaiver', routes.staffHomePage.updateWaiver);
        app.get('/staff/updateZipCodes', routes.staffHomePage.updateZipCodes);
        app.get('/staff/updateReports', routes.staffHomePage.updateReports);
        
        app.get('*', routes.notfound);
    }
};
