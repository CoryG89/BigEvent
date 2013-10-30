(function () {
    'use strict';

    $('form#volunteer-form').ajaxForm({

        success: function (data, status) {
            if (status === 'success'){
                if(data === 'ok') {
                    window.location.replace('/volunteer/success');
                }
                else {
                    window.location.replace('/staff/volunteer/account/' + data.id);
                }
            }
        },

        error: function (data) {
            if (data === 'staff') {
                window.location.replace('/staff/volunteer/failure');
            } else {
                window.location.replace('/volunteer/failure');
            }
        }

    });
})();
