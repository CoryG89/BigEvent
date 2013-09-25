'use strict';

var router = {
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
        app.get('/volunteer/control-panel', routes.volunteer.controlPanel.get);
        app.post('/volunteer/control-panel', routes.volunteer.controlPanel.post);
        app.get('/volunteer/control-panel/success', routes.volunteer.controlPanel.success);
        app.get('/volunteer/control-panel/failure', routes.volunteer.controlPanel.failure);

        app.get('/request', routes.request.get);
        app.post('/request', routes.request.post);
        app.get('/request/success', routes.request.success);

        app.get('*', routes.notfound);
    }
};

module.exports = router;
