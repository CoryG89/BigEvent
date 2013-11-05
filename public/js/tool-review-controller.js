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
    var $numberRequested = $('input#numberRequested');

    var $deleteButton = $('a#delete-button');
    $deleteButton.addClass('disabled');
    $deleteButton.on('click', function(){
        //check to see if the link is disabled
        if($deleteButton.hasClass('disabled'))
        {
            return false;
        }
        //confirm the action
        var confirm = window.confirm('Are you sure you want to delete this tool?');
        if(confirm === false)
        {
            return false;
        }

        //set up the http request
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                alert('The Tool has been successfully been deleted.');
                window.location.replace('/staff/staffHomePage');
            }
        };

        //get id of the entry to be deleted
        var url = window.document.URL.toString();
        var urlPeices = url.split('/');
        xmlhttp.open('POST','/staff/tool/review/delete/' + urlPeices[urlPeices.length - 1], true);

        //make the http request
        xmlhttp.send();
        return true;
    });

    $('form#toolReview-form').ajaxForm({
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
