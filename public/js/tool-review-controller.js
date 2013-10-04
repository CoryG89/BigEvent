(function () {
    'use strict';

    var $maxReqCheckbox = $('#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    var $maxReqLable = $('#maxRequestLable');
    if(!$maxReqCheckbox.prop('checked'))
    {
        $maxReqValue.addClass('hidden');
        $maxReqLable.addClass('hidden');
    }

    var $form = $('form#toolReview-form');
    var $editButton = $('a#edit-button');
    var $cancelButton = $('a#cancel-button');
    var $accountInputs = $('.tool-review-input');

    $('form#toolReview-form').ajaxForm({
        beforeSubmit: function () {

            //check to see if the inputed numbers are correct
            if(parseInt($('#totalAvailable').val()) < parseInt($('#numberInUse').val()))
            {
                alert('Number In Use cannot be greater than Total Available.');
                return false;
            }

            //set all disabled fields to not disabled so that the request will contain their values
            $('input#name').prop('disabled', false);
            $('input#numberRemaining').prop('disabled', false);

            return true;
        },

        success: function (data, status) {
            if (status === 'success' && data === 'OK') {
                window.location.replace('/tool/review/success');
            }
        },

        error: function () {
            window.location.replace('/tool/review/failure');
        }
    });

    $maxReqCheckbox.on('click', function(){
        if(this.checked)
        {
            $maxReqLable.removeClass('hidden');
            $maxReqValue.removeClass('hidden');
            $maxReqValue.prop('required', true);
        }
        else
        {
            $maxReqLable.addClass('hidden');
            $maxReqValue.addClass('hidden');
            $maxReqValue.prop('required', false);
        }
    });

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
    
})();