(function () {
    'use strict';

    $('form#volunteer-form').ajaxForm({
        beforeSubmit: function () {
            /** Client-side data form validation goes here */
        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/volunteer/success');
            }
        },

        error: function () {
            window.location.replace('/volunteer/failure');
        }
    });
    
})();
