(function () {
    'use strict';

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

})();
