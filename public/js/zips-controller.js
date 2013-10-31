(function () {
    'use strict';

    var $form = $('form#zips-form');
    var $allowedZipsList = $('#allowed-zip-codes');
    var zips = $('#zip-values').val().split(',');
    var keys = ['lee', 'chambers', 'russell', 'macon', 'tallapoosa', 'harris', 'muscogee'];
    var zipValues = {
        lee: 'Lee: ',
        chambers: 'Chambers: ',
        russell: 'Russell: ',
        macon: 'Macon: ',
        tallapoosa: 'Tallapossa: ',
        harris: 'Harris: ',
        muscogee: 'Muscogee: '
    };

    //select the values that need to be selected
    //and save the values to the correct list for a county
    $('option').each(function () {
        if($.inArray(this.value, zips) !== -1)
        {
            this.selected = true;
            addToZipList(this.parentNode.id.split('-')[0], this.value);
        }
    });
    //add to the left list of values for ease of site of the user.
    for(var i=0; i<keys.length; i++)
    {
        var currentValue = zipValues[keys[i]];
        $allowedZipsList.append('<li><p>' + currentValue.substr(0, currentValue.length - 2) + '</p></li>');
    }

    $form.ajaxForm({
        beforeSubmit: function () {
            
        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                alert('The Zip Codes were updated successfully.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function () {
            window.location.replace('/staff/updateZipCodes/failure/failure');
        }
    });

    function addToZipList(type, value)
    {
        zipValues[type] += value + ', ';
    }

})();
