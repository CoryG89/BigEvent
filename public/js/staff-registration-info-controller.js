(function () {
    'use strict';

    var cookieName = 'staff_registration_redirect';

    $('form#staff-registration-form').ajaxForm({

        success: function (data, status) {
            if (status === 'success') {
                if (data === 'ok') {
                    var redirectPath = $.cookie(cookieName);
                    if (redirectPath) {
                        $.removeCookie(cookieName);
                        var decodedPath = decodeURIComponent(redirectPath);
                        window.location.replace(decodedPath);
                    } else {
                        window.location.replace('/staffRegistration/success');
                    }
                }
                else {
                    window.location.replace('/staffRegistration/review' + data.id);
                }
            }
        },

        error: function (xhr) {
            if (xhr.responseText === 'staff') {
                window.location.replace('/staff/staffRegistration/failure');
            } else {
                window.location.replace('/staffRegistration/failure');
            }
        }

    });
})();
