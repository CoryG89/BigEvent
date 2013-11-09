(function () {
    'use strict';

    var $form = $('form#volunteer-account-form');
    var $editButton = $form.find('a#edit-button');
    var $cancelButton = $form.find('a#cancel-button');
    var $deleteButton = $form.find('a#delete-button');
    var $accountInputs = $form.find('.account-input');

    $editButton.on('click', function () {
        $editButton.addClass('hidden');
        $cancelButton.removeClass('hidden');
        $deleteButton.removeClass('disabled');
        $accountInputs.prop('disabled', false);
    });

    $cancelButton.on('click', function () {
        $cancelButton.addClass('hidden');
        $editButton.removeClass('hidden');
        $deleteButton.addClass('disabled');
        $accountInputs.prop('disabled', true);
    });

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/volunteer/account/success');
            }
            else if (status === 'success' && data === 'staff') {
                alert('The Volunteer was successfully updated.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function (xhr) {
            if(xhr.responseText === 'staff'){
                window.location.replace('/staff/volunteer/account/failure');
            } else {
                window.location.replace('/volunteer/account/failure');
            }
        }
    });

})();
