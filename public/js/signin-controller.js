(function () {
    'use strict';

    function handleRedirect () {
        var redirectPath = $.cookie('request_path');
        if (redirectPath) {
            $.removeCookie('request_path');
            var decodedPath = decodeURIComponent(redirectPath);
            window.location.replace(decodedPath);
        }
    }

    function postJSON (data, callback) {
        var req = new XMLHttpRequest();
        req.open('POST', window.location.href, true);
        req.setRequestHeader('Content-type', 'application/json');
        req.onload = callback;
        req.send(data);
    }

    function getData () {
        WL.api({
            path: 'me',
            method: 'GET',
        }).then (function (response) {
            console.log('WL.api: %o', response);

            var data = JSON.stringify(response);
            postJSON(data, handleRedirect);

        }, function (response) {
            console.log('WL.api: %o', response);
        });
    }

    WL.init({

        client_id: '0000000048103F2A',
        redirect_uri: 'http://bigevent.com',
        scope: ['wl.signin', 'wl.basic', 'wl.emails'],
        response_type: 'token',
        status: true

    }).then(function () {

        WL.ui({
            name: 'signin',
            element: 'wl-ui'
        });

        WL.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                getData();
            } else {
                WL.Event.subscribe('auth.login', getData);
            }
        });

    }, function (response) {
        console.log('WL.init:  %o', response.error);
    });

})();
