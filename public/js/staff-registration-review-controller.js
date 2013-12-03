(function () {
    'use strict';

    var $form = $('form#staff-registration-form');
    var $editButton = $form.find('a#edit-button');
    var $cancelButton = $form.find('a#cancel-button');
    var $deleteButton = $form.find('a#delete-button');
    var $changeableInputs = $form.find('.changeable');

    $editButton.on('click', function () {
        $editButton.addClass('hidden');
        $cancelButton.removeClass('hidden');
        $deleteButton.removeClass('disabled');
        $changeableInputs.prop('disabled', false);
    });

    $cancelButton.on('click', function () {
        $cancelButton.addClass('hidden');
        $editButton.removeClass('hidden');
        $deleteButton.addClass('disabled');
        $changeableInputs.prop('disabled', true);
    });

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/staffRegistration/review/success');
            }
            else if (status === 'success' && data === 'staff') {
                alert('The Application was successfully updated.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function (xhr) {
            if(xhr.responseText === 'staff'){
                window.location.replace('/staff/staffRegistration/review/failure');
            } else {
                window.location.replace('/staffRegistration/review/failure');
            }
        }
    });

})();
