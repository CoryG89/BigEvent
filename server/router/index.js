'use strict';

module.exports = {
    init: function (app) {
        var routes = require('./routes');
        
        //user side routes
        app.get('/', routes.home);
        app.get('/home', routes.home);

        app.get('/signin', routes.signin.get);
        app.get('/signin/authenticate', routes.signin.authenticate);
        app.get('/signin/success', routes.signin.success);

        app.get('/signout', routes.signout);

        app.get('/waiver', routes.waiver.get);

        app.get('/access-denied', routes.accessDenied);

        app.get('/volunteer', routes.volunteer.get);
        app.post('/volunteer', routes.volunteer.post);
        app.get('/volunteer/success', routes.volunteer.success);
        app.get('/volunteer/failure', routes.volunteer.failure);

        app.get('/volunteer/account', routes.volunteer.account.get);
        app.post('/volunteer/account', routes.volunteer.account.post);
        app.get('/volunteer/account/delete', routes.volunteer.account.delete);
        app.get('/volunteer/account/success', routes.volunteer.account.success);
        app.get('/volunteer/account/failure', routes.volunteer.account.failure);

        app.get('/volunteer/team', routes.team.get);
        app.get('/volunteer/team/invite', routes.team.invite);
        app.get('/volunteer/team/join', routes.team.join);
        app.get('/volunteer/team/leave', routes.team.leave);
        app.get('/volunteer/team/:id', routes.team.get);
        
        app.get('/staff/volunteer/team/list', routes.staffTeamList);
        app.get('/staff/volunteer/team/:id', routes.team.get);

        app.get('/jobsite/request', routes.jobsite.request.get);
        app.post('/jobsite/request', routes.jobsite.request.post);
        app.get('/jobsite/request/success', routes.jobsite.request.success);
        app.get('/jobsite/request/failure', routes.jobsite.request.failure);

        app.get('/staffRegistration', routes.staffRegistration.get);
        app.get('/staffRegistration/success', routes.staffRegistration.success);
        app.get('/staffRegistration/failure', routes.staffRegistration.failure);
        app.get('/staffRegistration/review/success', routes.staffRegistration.review.success);
        app.get('/staffRegistration/review/failure', routes.staffRegistration.review.failure);
        app.get('/staffRegistration/review/delete/:type', routes.staffRegistration.review.delete);
        app.get('/staffRegistration/review/:type', routes.staffRegistration.review.get);
        app.post('/staffRegistration/review/:type', routes.staffRegistration.review.post);
        app.get('/staffRegistration/:type', routes.staffRegistration.getForm);
        app.post('/staffRegistration/:type', routes.staffRegistration.post);

        //staff side routes
        app.get('/staff/volunteer/success', routes.volunteer.success);
        app.get('/staff/volunteer/failure', routes.volunteer.failure);

        app.get('/staff/volunteer/account/success', routes.volunteer.account.success);
        app.get('/staff/volunteer/account/failure', routes.volunteer.account.failure);
        app.get('/staff/volunteer/account/delete/:id', routes.volunteer.account.staff.delete);
        app.get('/staff/volunteer/account/:id', routes.volunteer.account.staff.get);
        app.post('/staff/volunteer/account/:id', routes.volunteer.account.staff.post);

        app.get('/staff/jobsite/request', routes.jobsite.request.get);
        app.post('/staff/jobsite/request', routes.jobsite.request.staff.post);
        app.get('/staff/jobsite/request/success', routes.jobsite.request.success);
        app.get('/staff/jobsite/request/failure', routes.jobsite.request.failure);

        app.get('/staff/jobsite/evaluation/success', routes.jobsite.evaluation.success);
        app.get('/staff/jobsite/evaluation/failure', routes.jobsite.evaluation.failure);
        app.get('/staff/jobsite/evaluation/delete/:id', routes.jobsite.evaluation.delete);
        app.get('/staff/jobsite/evaluation/:id', routes.jobsite.evaluation.get);
        app.post('/staff/jobsite/evaluation/:id', routes.jobsite.evaluation.post);
	
        app.get('/staff/tool', routes.tool.get);
        app.post('/staff/tool', routes.tool.post);
        app.get('/staff/tool/success', routes.tool.success);
        app.get('/staff/tool/failure', routes.tool.failure);

        app.get('/staff/tool/review/success', routes.tool.review.success);
        app.get('/staff/tool/review/failure', routes.tool.review.failure);
        app.get('/staff/tool/review/delete/:id', routes.tool.review.delete);
        app.get('/staff/tool/review/:id', routes.tool.review.get);
        app.post('/staff/tool/review/:id', routes.tool.review.post);

        app.get('/staff/staffHomePage', routes.staffHomePage.get);
        app.get('/staff/staffHomePage/updateTable', routes.staffHomePage.updateTable);
        app.get('/staff/staffHomePage/sort', routes.staffHomePage.sort);

        app.get('/staff/coordinator/review/delete/:id', routes.staffRegistration.review.staff.delete);
        app.get('/staff/committee/review/delete/:id', routes.staffRegistration.review.staff.delete);
        app.get('/staff/leadership/review/delete/:id', routes.staffRegistration.review.staff.delete);
        app.get('/staff/committee/review/:id', routes.staffRegistration.review.staff.get);
        app.get('/staff/leadership/review/:id', routes.staffRegistration.review.staff.get);
        app.get('/staff/coordinator/review/:id', routes.staffRegistration.review.staff.get);
        app.post('/staff/committee/review/:id', routes.staffRegistration.review.staff.post);
        app.post('/staff/leadership/review/:id', routes.staffRegistration.review.staff.post);
        app.post('/staff/coordinator/review/:id', routes.staffRegistration.review.staff.post);

        app.get('/staff/toolReport', routes.toolReport.get);
        app.get('/staff/toolReport/failure', routes.toolReport.failure);

        app.get('/staff/updateZipCodes', routes.zipcodes.get);
        app.post('/staff/updateZipCodes', routes.zipcodes.post);
        app.get('/staff/updateZipCodes/failure', routes.zipcodes.failure);

        app.get('/staff/updateWaiver', routes.waiver.getUpdateForm);
        app.post('/staff/updateWaiver', routes.waiver.update);
        app.get('/staff/updateWaiver/failure', routes.waiver.failure);

        app.get('/staff/logout', routes.signin.get);
        app.get('/staff/clearDatabase', routes.staffHomePage.clearDatabase);
        app.get('/staff/updateReports', routes.staffHomePage.updateReports);
        
        app.get('*', routes.notfound);
    }
};
