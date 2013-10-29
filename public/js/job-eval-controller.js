(function () {
    'use strict';

    var $form = $('form#job-eval-form');

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
        xmlhttp.open('POST','/staff/jobsite/evaluation/delete/' + urlPeices[urlPeices.length - 1], true);

        //make the http request
        xmlhttp.send();
        return true;
    });

    $form.ajaxForm({
        beforeSubmit: function () {
            
        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                alert('The Jobsite Evaluation was sumitted Successfully.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function () {
            window.location.replace('/staff/jobsite/evaluation/failure');
        }
    });

})();
