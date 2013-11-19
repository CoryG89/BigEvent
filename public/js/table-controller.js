(function () {
    'use strict';

    $.extend($.tablesorter.themes.bootstrap, {
        table: 'table table-bordered',
        sortNone: 'bootstrap-icon-unsorted',
        sortAsc: 'icon-chevron-up',
        sortDesc: 'icon-chevron-down'
    });

    $('table.tablesorter').each(function () {
        $(this).tablesorter({
            theme: 'bootstrap',
            headerTemplate: '{content} {icon}',
            widthFixed: true,
            widgets: ['uitheme', 'filter', 'zebra'],
            widgetOptions: {
                zebra: ['even', 'odd'],
                filter_reset: '.reset'
            }
        });
        
        $(this).tablesorterPager({
            container: $('#' + this.id + '-pager'),
            output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
        });
    });

})();
