(function () {
    'use strict';

    $('form#volunteer-form').ajaxForm({
        beforeSubmit: function () {
            //validate email for staff side processing
            var email = $('#email').val();
            if(email.search(/^.+@tigermail.auburn.edu$/) === -1 &&
                email.search(/^.+@auburn.edu$/) === -1)
            {
                alert('Email must be a valid Auburn Email address');
            }
        },

        success: function (data, status) {
            if (status === 'success'){
                if(data === 'ok') {
                    window.location.replace('/volunteer/success');
                }
                else {
                    window.location.replace('/staff/volunteer/account/' + data.id);
                }
            }
        },

        error: function (data, status) {
            if(data === 'staff') {
                window.location.replace('/staff/volunteer/failure');
            } else {
                window.location.replace('/volunteer/failure');
            }
        }
    });    
})();
