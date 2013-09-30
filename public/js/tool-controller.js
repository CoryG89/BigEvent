(function () {
    'use strict';

    var $maxReqCheckbox = $('input#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    var $maxReqLable = $('#maxRequestLable');
    $maxReqValue.addClass('hidden');
    $maxReqLable.addClass('hidden');

    $('form#tool-form').ajaxForm({
        beforeSubmit: function () {

            //check to see if the inputed numbers are correct
            if($('#totalAvailable').val() < $('#numberInUse').val())
            {
                alert('Number In Use cannot be greater than Total Available.');
                return false;
            }
            return true;
        },

        success: function (data, status) {
            if (status === 'success') {
                window.location.replace('/tool/review?recordName=' + data.recordName);
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
            $maxReqValue.focus();
        }
        else
        {
            $maxReqLable.addClass('hidden');
            $maxReqValue.addClass('hidden');
        }
    });
    
})();