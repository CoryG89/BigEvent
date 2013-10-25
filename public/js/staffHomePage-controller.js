(function () {
    'use strict';
    //get needed info

    var pageNumber = {
        volunteer: 1,
        jobsite: 1,
        tool: 1,
        committee: 1,
        leadership: 1,
        projectCoordinator: 1
    };

    var totalPages = {
        tool: parseInt($('#toolNumPages').val(), 10),
        volunteer: parseInt($('#volunteerNumPages').val(), 10),
        jobsite: parseInt($('#jobsiteNumPages').val(), 10),
        committee: parseInt($('#committeeNumPages').val(), 10),
        leadership: parseInt($('#leadershipNumPages').val(), 10),
        projectCoordinator: parseInt($('#projectCoordinatorNumPages').val(), 10)
    };

    //this stores the current sorting state for each table. 1 is asc order and
    //-1 is dec. '' for the column means there is no sorting in place. 
    var currentSortStatus = {
        volunteer: {
            column: '',
            direction: 1
        },
        jobsite: {
            column: '',
            direction: 1
        },
        tool: {
            column: '',
            direction: 1
        },
        committee: {
            column: '',
            direction: 1
        },
        leadership: {
            column: '',
            direction: 1
        },
        projectCoordinator: {
            column: '',
            direction: 1
        }
    };

    var $tableHeaders = $('th');

    $tableHeaders.on('click', function (evt) {
        console.log('tableheaders click event: %o', evt);
        var cell = evt.target;
        var tableId = cell.offsetParent.id;
        var type = tableId.split('-')[0];
        sort(type, cell.id);
    });

    $tableHeaders.on('mouseover', function (evt) {
        var cell = evt.target;
        cell.style.backgroundColor = 'gainsboro';
        document.body.style.cursor = 'pointer';
    });

    $tableHeaders.on('mouseout', function (evt) {
        var cell = evt.target;
        cell.style.backgroundColor = 'white';
        document.body.style.cursor = 'auto';
    });

    var pagerLinks = { };

    $('ul.pager').each(function () {
        var pagerId = this.id;
        var type = pagerId.split('-')[0];

        var $nextLi = $(this).children('li.next');
        var $previousLi = $(this).children('li.previous');
        var $nextLink = $nextLi.children('a');
        var $previousLink = $previousLi.children('a');

        $nextLink.on('click', function (evt) {
            goToPage(type, 'Next', totalPages[type]);
            evt.preventDefault();
        });

        $previousLink.on('click', function (evt) {
            goToPage(type, 'Previous', totalPages[type]);
            evt.preventDefault();
        });

        // map pager links to later efficiently access for enabling/disabling
        pagerLinks[type] = {
            $next: $nextLi,
            $previous: $previousLi
        };
    });

    function sort(type, sortKey)
    {
        //set up the http request
        var xmlhttp = new XMLHttpRequest();
        //set the sorting values
        var sortValue = setSortValues(type, sortKey);

        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                //reset the table to page one
                pageNumber[type] = 1;

                //determine which links if any need to be enabled or disabled
                determineNewPageLinkStates(type, 1);

                //determin the route for hyperlinks in the first column.
                var route = determineHyperLinkRoute(type);
                var response = JSON.parse(xmlhttp.response);
                var rowIndex = 1;
                var table = document.getElementById(type + '-table');

                //get headers id's so we know how to access each item
                var row = table.rows[0];
                var headers = getColumnHeaders(row);

                //loop through and change each row in the table. 
                var record;
                for (var responseIndex = 0; responseIndex < response.length; responseIndex++)
                {
                    row = table.rows[rowIndex];
                    record = response[responseIndex];
                    if(row)
                    {
                        replaceRow(type, row, headers, record, route);
                    }
                    else
                    {
                        row = insertTableRow(table, rowIndex, headers.length);
                        replaceRow(type, row, headers, record, route);
                    }
                    rowIndex++;
                }
                clearRemainingRows(table, rowIndex);
            }
        };

        xmlhttp.open('GET','/staff/staffHomePage/sort?type=' + type + '&key=' + sortKey + '&dir=' + sortValue, true);

        //make the http request
        xmlhttp.send();
        return true;
    }

    function setSortValues(type, sortKey)
    {
        // 1 is ascending order -1 is decending order
        if(currentSortStatus[type].column === sortKey)
        {
            var direction = currentSortStatus[type].direction;
            if(direction === 1)
            {
                currentSortStatus[type].direction = -1;
                return -1;
            }
            else
            {
                currentSortStatus[type].direction = 1;
            }
        }
        else
        {
            currentSortStatus[type].column = sortKey;
            currentSortStatus[type].direction = 1;
        }
        return 1;
    }

    function goToPage(type, linkType)
    {
        //determin if we are moving forward a page or back a page
        var goToPageNumber = pageNumber[type];

        if (linkType === 'Previous') {
            goToPageNumber--;
        }
        else if (linkType === 'Next') {
            goToPageNumber++;
        }
        else {
            return false; // error
        }

        console.log('goToPageNumber: %d', goToPageNumber);

        //determine if the link pressed is a valid action (not disabled)
        if(determineIfLinkPressedIsDisabled(type, linkType))
        {
            return false;
        }

        //determine which links if any need to be enabled or disabled
        determineNewPageLinkStates(type, goToPageNumber);

        //set up the http request
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                //determin the route for hyperlinks in the first column.
                var route = determineHyperLinkRoute(type);
                var response = JSON.parse(xmlhttp.response);
                var rowIndex = 1;
                var table = document.getElementById(type + '-table');

                //get headers id's so we know how to access each item
                var row = table.rows[0];
                var headers = getColumnHeaders(row);

                //loop through and change each row in the table. 
                var record;
                for (var responseIndex = 0; responseIndex < response.length; responseIndex++)
                {
                    row = table.rows[rowIndex];
                    record = response[responseIndex];
                    if(row)
                    {
                        replaceRow(type, row, headers, record, route);
                    }
                    else
                    {
                        row = insertTableRow(table, rowIndex, headers.length);
                        replaceRow(type, row, headers, record, route);
                    }
                    rowIndex++;
                }
                clearRemainingRows(table, rowIndex);
                pageNumber[type] = goToPageNumber;
            }
        };

        xmlhttp.open('GET','/staff/staffHomePage/updateTable?type=' + type + '&p=' + goToPageNumber + '&key=' + currentSortStatus[type].column + '&dir=' + currentSortStatus[type].direction, true);

        //make the http request
        xmlhttp.send();
        return true;
    }

    function getColumnHeaders(row)
    {
        var headers = [];
        for(var j=0; j<row.cells.length; j++)
        {
            headers[j] = row.cells[j].id;
        }
        return headers;
    }

    function clearRemainingRows(table, lastRowIndex)
    {
        for(var k = table.rows.length - 1; k >= lastRowIndex; k--)
        {
            table.deleteRow(k);
        }
    }

    function replaceRow(type, row, headers, record, route)
    {
        //the first cell should have a hyperlink to the item represented by the row
        var cell = row.cells[0];
        var header = headers[0];
        if(header === 'doubleName')
        {
            cell.innerHTML = '<a href="' + route + record._id + '">' +
                    record.lastName + ', ' + record.firstName + '</a>';
        }
        else
        {
            cell.innerHTML = '<a href="' + route + record._id + '">' + record[header] + '</a>';
        }

        //loop through the rest of the cells
        for(var j=1; j<row.cells.length; j++)
        {
            cell = row.cells[j];
            header = headers[j];
            if(header === 'doubleName')
            {
                cell.innerText = record.lastName + ', ' + record.firstName;
            }
            else
            {
                cell.innerText = record[header];
            }
        }
    }

    function determineNewPageLinkStates(type, goToPageNumber)
    {
        var $next = pagerLinks[type].$next;
        var $previous = pagerLinks[type].$previous;
        var totalNumberOfPages = totalPages[type];

        if(goToPageNumber === 1 && totalNumberOfPages === 1) //we only have one page
        {
            $previous.addClass('disabled');
            $next.addClass('disabled');
        }
        else if(goToPageNumber === 1) //we are on the first page and have more pages
        {
            $previous.addClass('disabled');
            $next.removeClass('disabled');
        }
        else if(goToPageNumber === totalNumberOfPages) //we are on the last page
        {
            $previous.removeClass('disabled');
            $next.addClass('disabled');
        }
        else //we are in the middle somewhere enable both links
        {
            $previous.removeClass('disabled');
            $next.removeClass('disabled');
        }
    }

    function determineIfLinkPressedIsDisabled(type, linkType)
    {
        var $link = $('#' + type + linkType + 'Link');
        if($link.hasClass('disabled'))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function determineHyperLinkRoute(type)
    {
        var route = '/staff/' + type + '/';
        if(type === 'tool')
        {
            route += 'review/';
        }
        else if(type === 'volunteer')
        {
            route += 'account/';
        }
        else if(type === 'jobsite')
        {
            route += 'evaluation/';
        }
        else if(type === 'committee')
        {
            route += 'review/';
        }
        else if(type === 'leadership')
        {
            route += 'review/';
        }
        else if(type === 'projectCoordinator')
        {
            route += 'review/';
        }
        return route;
    }

    function insertTableRow(table, rowIndex, numberOfCells)
    {
        var row = table.insertRow(rowIndex);
        for(var cellIndex=0; cellIndex<numberOfCells; cellIndex++)
        {
            row.insertCell(cellIndex);
        }
        return row;
    }

})();
