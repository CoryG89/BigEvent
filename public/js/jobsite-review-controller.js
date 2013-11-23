(function () {
    'use strict';
    
    var $mapContainer = $('div#map-container');
    var $editButton = $('a[href="#edit"]');
    var $cancelButton = $('a[href="#cancel"]');
    var $backButton = $('a#back-button');
    var $reviewList = $('#jobsite-review-data');
    var $reviewForm = $('form#jobsite-form');

    $editButton.on('click', function () {
        $editButton.addClass('hidden');
        $reviewList.addClass('hidden');

        $cancelButton.removeClass('hidden');
        $reviewForm.removeClass('hidden');
    });

    $cancelButton.on('click', function () {
        $cancelButton.addClass('hidden');
        $reviewForm.addClass('hidden');

        $reviewList.removeClass('hidden');
        $editButton.removeClass('hidden');
    });

    $backButton.on('click', function () {
        window.history.back();
    });

    $reviewForm.ajaxForm({
        success: function () {
            alert('Successfully updated job site request data.');
            window.location.reload();
        },

        error: function () {
            alert('Could not update job site request data.');

        }
    });

    $(window).on('load', function () {
        var addr = $mapContainer.data('addr');
        var lat = $mapContainer.data('lat');
        var lng = $mapContainer.data('lng');

        console.log(addr);
        console.log(lat);
        var mapLatLng = new google.maps.LatLng(lat, lng);

        var map = new google.maps.Map($mapContainer[0], {
            zoom: 13,
            center: mapLatLng
        });

        var marker = new google.maps.Marker({
            position: mapLatLng,
            title: addr
        });
        marker.setMap(map);
    });

})();
