(function () {
    'use strict';

    var $committeeButton = $('#committee-button');
    var $leadershipButton = $('#leadership-button');
    var $coordinatorButton = $('#coordinator-button');

    $committeeButton.on('click', function () {
        window.location.replace('/staffRegistration/committee');
    });
    $leadershipButton.on('click', function () {
        window.location.replace('/staffRegistration/leadership');
    });
    $coordinatorButton.on('click', function () {
        window.location.replace('/staffRegistration/coordinator');
    });

})();
