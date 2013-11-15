(function () {
    'use strict';

    var $form = $('form#update-waiver-form');

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                alert('The Waivers have been updated.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function () {
            window.location.replace('/staff/updateWaiver/failure');
        }
    });

})();
