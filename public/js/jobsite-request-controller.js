(function () {
    'use strict';

    var $form = $('form#jobsite-request-form');
    var $email = $form.children('input#email');
    var $emailConf = $form.children('input#email-conf');
    var $zip = $form.children('input#zip');

    $email.popover({
        title: 'Validate Email',
        content: 'Email addresses must match.',
        placement: 'left',
        trigger: 'manual'
    });

    $zip.popover({
        title: 'Validate Zip Code',
        content: 'Currently accepted zip codes are: 36830, 36832, and 36849.',
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

            switch ($zip.val()) {
                case '36830':
                case '36832':
                case '36849':
                    break;
                default:
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

        error: function (data, status) {
            if(data === 'staff'){
                window.location.replace('/staff/jobsite/request/failure');
            } else {
                window.location.replace('/jobsite/request/failure');
            }
        }
    });

})();
