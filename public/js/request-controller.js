(function () {
    'use strict';

    var $form = $('form#request-form');
    var $email = $form.children('input#email');
    var $emailConf = $form.children('input#email');

    $form.ajaxForm({
        beforeSubmit: function () {
            if ($email.val() === $emailConf.val()) {
                return true;
            } else {
                alert('Email address fields must match.');
                return false;
            }
        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/request/success');
            }
        },

        error: function () {
            window.location.replace('/volunteer/failure');
        }
    });

})();
