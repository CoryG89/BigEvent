(function () {
    'use strict';

    var $maxReqCheckbox = $('#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    var $maxReqLabel = $('#maxRequestLabel');
    $maxReqValue.addClass('hidden');
    $maxReqLabel.addClass('hidden');
    var $numberRequested = $('input#numberRequested');

    $('form#tool-form').ajaxForm({
        beforeSubmit: function () {

            //check to see if the inputed numbers are correct
            if(parseInt($('#totalAvailable').val(), 10) < parseInt($('#numberInUse').val(), 10))
            {
                alert('Number In Use cannot be greater than Total Available.');
                return false;
            }
            if($maxReqCheckbox.prop('checked'))
            {
                if(parseInt($numberRequested.val(), 10) > parseInt($maxReqValue.val(), 10))
                {
                    alert('You cannot request more than the Max Request Limit');
                    return false;
                }
            }
            return true;
        },

        success: function (data, status) {
            if (status === 'success') {
                window.location.replace('/staff/tool/review/' + data.id);
            }
        },

        error: function (xhr)
        {
            if(xhr.responseText === 'Entry Found')
            {
                alert('A Tool by this name already exists. Please go edit this Tool or create a new Tool by giving it a new name.');
            }
            else
            {
                window.location.replace('/staff/tool/failure');
            }
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
    
})();
