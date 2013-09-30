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

        app.get('/request', routes.request.get);
        app.post('/request', routes.request.post);
        app.get('/request/success', routes.request.success);
        app.get('/request/failure', routes.request.failure);

        app.get('*', routes.notfound);
    }
};
