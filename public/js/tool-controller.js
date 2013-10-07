(function () {
    'use strict';

    var $maxReqCheckbox = $('#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    var $maxReqLable = $('#maxRequestLable');
    $maxReqValue.addClass('hidden');
    $maxReqLable.addClass('hidden');
    var $numberRequested = $('input#numberRequested');

    $('form#tool-form').ajaxForm({
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
            if (status === 'success') {
                window.location.replace('/tool/review/' + data.id);
            }
        },

        error: function (data, status) 
        {
            if(data.responseText === "Entry Found")
            {
                alert('A Tool by this name already exists. Please go edit this Tool or create a new Tool by giving it a new name.');
            }
            else
            {
                window.location.replace('/tool/failure');
            }
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
    
})();