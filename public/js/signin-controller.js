(function () {
    'use strict';

    /** Attach handlers to log each event that the Windows Live API supports */
    WL.Event.subscribe('wl.log', function (evt) {
        console.log('WL.Event[wl.log]: %o', evt);
    });
    WL.Event.subscribe('auth.login', function (evt) {
        console.log('WL.Event[auth.login]:  %o', evt);
    });
    WL.Event.subscribe('auth.logout', function (evt) {
        console.log('WL.Event[auth.logout]:  %o', evt);
    });
    WL.Event.subscribe('auth.sessionChange', function (evt) {
        console.log('WL.Event[auth.sessionChange]: %o', evt);
    });
    WL.Event.subscribe('auth.statusChange', function (evt) {
        console.log('WL.Event[auth.statusChange]:  %o', evt);
    });

    var getCookies = function (cookies) {
        cookies = cookies || document.cookie;
        var cookieList = cookies.split(';');
        cookies = {};
        cookieList.forEach(function (cookie) {
            var equalsIndex = cookie.search('=');
            var name = cookie.substring(0, equalsIndex);
            var value = cookie.substring(equalsIndex + 1, cookie.length);
            cookies[name] = value;
        });
        return cookies;
    };

    WL.init({

        client_id: '0000000048103F2A',
        redirect_uri: 'http://bigevent.com',
        scope: ['wl.signin', 'wl.basic', 'wl.emails'],
        response_type: 'token',
        status: true

    }).then(function (response) {
        console.log('WL.init:  %o', response);

        WL.ui({
            name: 'signin',
            element: 'wl-ui'
        });

        WL.Event.subscribe('auth.login', function (evt) {
            console.log('auth.login: %o', evt);
            WL.api({
                path: 'me',
                method: 'GET',
            }).then (function (response) {
                console.log('WL.api: %o', response);

                var data = JSON.stringify(response);

                var req = new XMLHttpRequest();
                req.open('POST', window.location.href, true);
                req.setRequestHeader('Content-type', 'application/json');
                req.onload = function (evt) {
                    console.log('onload: %o', evt);
                    var cookies = getCookies();
                    if (cookies.prev_path) {
                        var decodedPath = decodeURIComponent(cookies.prev_path);
                        window.location.replace(decodedPath);
                    }
                };
                req.send(data);

                
            }, function (response) {
                console.log('WL.api: %o', response);
            });
        });


    }, function (response) {
        console.log('WL.init:  %o', response.error);
    });

})();
