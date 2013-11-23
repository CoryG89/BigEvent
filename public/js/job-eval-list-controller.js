(function () {
    'use strict';

    var map;
    var infoWindow;
    var mapMarkers = [];
    var evalListingHeaders = [];

    var $evalListingTable = $('table#eval-listing-table');
    var $listingMapContainer = $('div#listing-map-container');

    $evalListingTable.find('thead > tr > th > div').each(function(i, e) {
        evalListingHeaders.push(e.innerText);
    });

    var $evalListingRows = $evalListingTable.find('tbody > tr');

    $evalListingTable.on('filterEnd', updateMap);

    function updateMap() {
        var bounds = new google.maps.LatLngBounds();
        mapMarkers.forEach(function (marker) { marker.setMap(null); });
        mapMarkers = [];
        $evalListingRows.not('.filtered').each(function () {
            var addr = $(this).data('addr');
            var lat = $(this).data('lat');
            var lng = $(this).data('lng');
            var mapLatLng = new google.maps.LatLng(lat, lng);
            var marker = new google.maps.Marker({
                position: mapLatLng,
                title: addr
            });
            var infoWindowContent = '<ul>';
            
            $(this).find('td').each(function (i, e) {
                infoWindowContent += '<li><strong>' + evalListingHeaders[i] +
                    '</strong> ' + e.innerHTML + '</li>';
            });
            infoWindowContent += '</ul>';

            google.maps.event.addListener(marker, 'click', function () {
                if (infoWindow) infoWindow.close();

                infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent
                });
                infoWindow.open(map, marker);
            });

            marker.setMap(map);
            mapMarkers.push(marker);
            bounds.extend(mapLatLng);
        });
        map.setCenter(bounds.getCenter());
    }

    $(window).on('load', function () {
        var container = $listingMapContainer[0];
        map = new google.maps.Map(container, {
            zoom: 13
        });

        google.maps.event.addListener(map, 'click', function () {
            infoWindow.close();
        });
        updateMap();
    });

})();
