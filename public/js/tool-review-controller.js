(function () {
    'use strict';

    var $maxReqCheckbox = $('#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    var $maxReqLable = $('#maxRequestLable');
    if(!$maxReqCheckbox.prop('checked'))
    {
        $maxReqValue.addClass('hidden');
        $maxReqLable.addClass('hidden');
        $maxReqValue.prop('required', false);
        $maxReqValue.prop('disabled', true);
    }

    var $form = $('form#toolReview-form');
    var $editButton = $('a#edit-button');
    var $cancelButton = $('a#cancel-button');
    var $accountInputs = $('.tool-review-input');
    var $numberRequested = $('input#numberRequested');

    $('form#toolReview-form').ajaxForm({
        beforeSubmit: function () {

            //check to see if the inputed numbers are correct
            if(parseInt($('#totalAvailable').val()) < parseInt($('#numberInUse').val()))
            {
                alert('Number In Use cannot be greater than Total Available.');
                return false;
            }
            if($maxReqCheckbox.prop('checked'))
            {
                if(parseInt($numberRequested.val()) > parseInt($maxReqValue.val()))
                {
                    alert('You cannot request more than the Max Request Limit');
                    return false;
                }
            }
            return true;
        },

        success: function (data, status) {
            if (status === 'success' && data === 'OK') {
                window.location.replace('/staffHomePage');
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