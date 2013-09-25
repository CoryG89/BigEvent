(function () {
    'use strict';

    var $form = $('form#control-panel-form');

    var $editButton = $('a#edit-button');
    var $cancelButton = $('a#cancel-button');
    var $controlPanelInputs = $('.control-panel-input');

    $editButton.on('click', function () {
        $editButton.addClass('hidden');
        $cancelButton.removeClass('hidden');
        $controlPanelInputs.prop('disabled', false);
    });

    $cancelButton.on('click', function () {
        $cancelButton.addClass('hidden');
        $editButton.removeClass('hidden');
        $controlPanelInputs.prop('disabled', true);
    });

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                window.location.replace('/volunteer/control-panel/success');
            }
        },

        error: function () {
            window.location.replace('/volunteer/control-panel/failure');
        }
    })

})();
