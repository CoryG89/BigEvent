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

        error: function (xhr) {
            if(xhr.responseText === 'ext')
            {
                alert('Invalid file extention. File must have a .txt extention.');
            }
            else
            {
                window.location.replace('/staff/updateWaiver/failure');
            }
        }
    });

})();
