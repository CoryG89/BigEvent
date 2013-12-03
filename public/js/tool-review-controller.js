(function () {
    'use strict';

    var $maxReqCheckbox = $('#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    var $maxReqLabel = $('#maxRequestLabel');
    if(!$maxReqCheckbox.prop('checked'))
    {
        $maxReqValue.addClass('hidden');
        $maxReqLabel.addClass('hidden');
        $maxReqValue.prop('required', false);
        $maxReqValue.prop('disabled', true);
    }

    var $editButton = $('a#edit-button');
    var $cancelButton = $('a#cancel-button');
    var $accountInputs = $('.tool-review-input');

    var $deleteButton = $('a#delete-button');
    $deleteButton.addClass('disabled');

    $('form#toolReview-form').ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'OK') {
                alert('Tool Updated Successfully.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function () {
            window.location.replace('/staff/tool/review/failure');
        }
    });

    $maxReqCheckbox.on('click', function(){
        if(this.checked)
        {
            $maxReqLabel.removeClass('hidden');
            $maxReqValue.removeClass('hidden');
            $maxReqValue.prop('required', true);
        }
        else
        {
            $maxReqLabel.addClass('hidden');
            $maxReqValue.addClass('hidden');
            $maxReqValue.prop('required', false);
        }
    });

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
    
})();
