(function () {
    'use strict';

    var $form = $('form#volunteer-account-form');
    var $editButton = $('a#edit-button');
    var $cancelButton = $('a#cancel-button');
    var $accountInputs = $('.account-input');

    $editButton.on('click', function () {
        $editButton.addClass('hidden');
        $cancelButton.removeClass('hidden');
        $accountInputs.prop('disabled', false);
    });

    $cancelButton.on('click', function () {
        $cancelButton.addClass('hidden');
        $editButton.removeClass('hidden');
        $accountInputs.prop('disabled', true);
    });

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/volunteer/account/success');
            }
            else if(status === 'success' && data === 'staff') {
                alert('The Volunteer was successfully updated.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function (data, status) {
            if(data === 'staff'){
                window.location.replace('/staff/volunteer/account/failure');
            } else {
                window.location.replace('/volunteer/account/failure');
            }
        }
    });

})();
