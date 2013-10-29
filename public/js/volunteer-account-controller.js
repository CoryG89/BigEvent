(function () {
    'use strict';

    var $form = $('form#volunteer-account-form');
    var $editButton = $('a#edit-button');
    var $cancelButton = $('a#cancel-button');
    var $accountInputs = $('.account-input');

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
        //set action
        xmlhttp.open('POST','/staff/volunteer/account/delete/' + urlPeices[urlPeices.length - 1], true);

        //make the http request
        xmlhttp.send();
        return true;
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

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/volunteer/account/success');
            }
            else if(status === 'success' && data === 'staff') {
                alert('The Volunteer was successfully updated.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function (data) {
            if(data === 'staff'){
                window.location.replace('/staff/volunteer/account/failure');
            } else {
                window.location.replace('/volunteer/account/failure');
            }
        }
    });

})();
