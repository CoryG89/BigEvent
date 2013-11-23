(function () {
    'use strict';

    var $editButton = $('a[href="#edit"]');
    var $cancelButton = $('a[href="#cancel"]');
    var $reviewList = $('div#volunteer-review-list');
    var $volunteerFormContainer = $('div#volunteer-form-container');
    var $volunteerForm = $('form#volunteer-form');

    $editButton.on('click', function () {
        $editButton.addClass('hidden');
        $reviewList.addClass('hidden');

        $cancelButton.removeClass('hidden');
        $volunteerFormContainer.removeClass('hidden');
    });

    $cancelButton.on('click', function () {
        $cancelButton.addClass('hidden');
        $volunteerFormContainer.addClass('hidden');

        $reviewList.removeClass('hidden');
        $editButton.removeClass('hidden');
    });


    $volunteerForm.ajaxForm({
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
