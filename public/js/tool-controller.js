(function () {
    'use strict';

    var $maxReqCheckbox = $('#maxRequest');
    var $maxReqValue = $('input#maxRequestValue');
    $maxReqValue.addClass('hidden');

    $('form#tool-form').ajaxForm({
        beforeSubmit: function () {

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
            $maxReqValue.removeClass('hidden');
            $maxReqValue.prop('required', true);
        }
        else
        {
            $maxReqValue.addClass('hidden');
            $maxReqValue.prop('required', false);
        }
    });
    
})();
