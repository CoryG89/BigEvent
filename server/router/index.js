'use strict';

var routes = require('./routes');

var router = {

    init: function (app) {
        app.get('/', routes.home);
        app.get('/home', routes.home);

        app.get('/signin', routes.signin.get);
        app.post('/signin', routes.signin.post);

        app.get('/volunteer', routes.volunteer.get);
        app.post('/volunteer', routes.volunteer.post);
        app.get('/volunteer/success', routes.volunteer.success);
        app.get('/volunteer/control-panel', routes.volunteer.controlPanel.get);

        app.get('/request', routes.request.get);
        app.post('/request', routes.request.post);
        app.get('/request/success', routes.request.success);

        app.get('*', routes.notfound);
    }

};

module.exports = router;
