(function () {
    'use strict';

    var cookieName = 'volunteer_redirect';

    $('form#volunteer-form').ajaxForm({

        success: function (data, status) {
            if (status === 'success') {
                if (data === 'ok') {
                    var redirectPath = $.cookie(cookieName);
                    if (redirectPath) {
                        $.removeCookie(cookieName);
                        var decodedPath = decodeURIComponent(redirectPath);
                        window.location.replace(decodedPath);
                    } else {
                        window.location.replace('/volunteer/success');
                    }
                }
                else {
                    window.location.replace('/staff/volunteer/account/' + data.id);
                }
            }
        },

        error: function (xhr) {
            if (xhr.responseText === 'staff') {
                window.location.replace('/staff/volunteer/failure');
            } else {
                window.location.replace('/volunteer/failure');
            }
        }

    });
})();
