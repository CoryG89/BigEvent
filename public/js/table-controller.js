(function () {
    'use strict';

    $('table.tablesorter').each(function () {
        $(this).tablesorter({
            theme: 'bootstrap',
            headerTemplate: '{content} {icon}',
            widthFixed: true,
            widgets: ['uitheme', 'filter', 'zebra'],
            widgetOptions: {
                zebra: ['even', 'odd'],
                filter_reset: ''
            }
        });
        
        $(this).tablesorterPager({
            container: $('#' + this.id + '-pager'),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
        });
    });
    
})();
