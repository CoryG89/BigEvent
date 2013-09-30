(function () {
    'use strict';

    

    $('form#toolReview-form').ajaxForm({
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
            if (status === 'success' && data === 'ok') {
                window.location.replace('/tool/review/success');
            }
        },

        error: function () {
            window.location.replace('/tool/review/failure');
        }
    });
    
})();