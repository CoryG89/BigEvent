(function () {
    'use strict';

    var $form = $('form#jobsite-request-form');
    var $email = $form.children('input#email');
    var $emailConf = $form.children('input#email-conf');
    var $zip = $form.children('input#zip');
    var zipValues = $('#zip-values').val().split(',');

    $email.popover({
        title: 'Validate Email',
        content: 'Email addresses must match.',
        placement: 'left',
        trigger: 'manual'
    });

    var zipMessage = 'Currently accepted zip codes are: ';
    for(var i=0; i<zipValues.length; i++)
    {
        zipMessage += zipValues[i] + ', ';
    }
    $zip.popover({
        title: 'Validate Zip Code',
        content: zipMessage.substr(0, zipMessage.length - 2),
        placement: 'left',
        trigger: 'manual'
    });

    $form.ajaxForm({
        beforeSubmit: function () {
            if ($email.val() !== $emailConf.val()) {
                $email.popover('show');
                $(document).one('focusin', function () {
                    $email.popover('hide');
                });
                return false;
            }
            if($.inArray($zip.val(), zipValues) === -1)
            {
                $zip.popover('show');
                $(document).one('focusin', function () {
                    $zip.popover('hide');
                });
                return false;
            }
        },

        success: function (data, status) {
            if (status === 'success') {
                if(data === 'ok') {
                    window.location.replace('/jobsite/request/success');
                }
                else
                {
                    window.location.replace('/staff/jobsite/evaluation/' + data.id);
                }
            }
        },

        error: function (data) {
            if(data === 'staff'){
                window.location.replace('/staff/jobsite/request/failure');
            } else {
                window.location.replace('/jobsite/request/failure');
            }
        }
    });

})();
