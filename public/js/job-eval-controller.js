(function () {
    'use strict';

    var $form = $('form#job-eval-form');

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
