function goToPage(type, linkType, totalNumberOfPages, siteUrl)
{
	//determin if we are moving forward a page or back a page
	var goToPageNumber = getGoToPageNumber(type, linkType);
	if(goToPageNumber === 0) //error occured
	{
		return false;
	}

	//determine if the link pressed is a valid action (not disabled)
	if(determineIfLinkPressedIsDisabled(type, linkType))
	{
		return false;
	}

	//determine which links if any need to be enabled or disabled
	determineNewPageLinkStates(type, goToPageNumber, totalNumberOfPages);

	//set up the http request
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
		{
			//determin the route for hyperlinks in the first column.
			var route = determineHyperLinkRoute(type, siteUrl);
			var response = JSON.parse(xmlhttp.response);
			var rowIndex = 1;
			var table = document.getElementById(type + "Table");

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
	if (type === 'volunteer')
	{
		xmlhttp.open("GET","/staff/staffHomePage/updateTable?type=vol&p=" + goToPageNumber, true);
	} 
	else if (type === 'tool') 
	{
		xmlhttp.open("GET","/staff/staffHomePage/updateTable?type=tool&p=" + goToPageNumber, true);
	} 
	else if (type === 'jobsite') 
	{
		xmlhttp.open("GET","/staff/staffHomePage/updateTable?type=jobsite&p=" + goToPageNumber, true);
	} 
	else 
	{
		//no type is an error just return false;
		return false;
	}

	//make the http request
	xmlhttp.send();
	//update the page number
	updatePageNumber(type, linkType);
	return true;
}

function getColumnHeaders(row)
{
	var headers = new Array();
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
		cell.innerHTML = "<a href='" + route + record['_id'] + "'>" +
                record['firstName'] + " " + record['lastName'] + "</a>";
	} 
	else 
	{
		cell.innerHTML = "<a href='" + route + record['_id'] + "'>" + record[header] + "</a>";
	}

	//loop through the rest of the cells
	for(var j=1; j<row.cells.length; j++) 
	{
   		cell = row.cells[j];
   		header = headers[j];
		if(header === 'doubleName')
		{
			cell.innerText = record['firstName'] + ' ' + record['lastName']; 
		} 
		else 
		{
			cell.innerText = record[header];
		}
    }
}

function determineNewPageLinkStates(type, goToPageNumber, totalNumberOfPages)
{
	if(goToPageNumber === 1 && totalNumberOfPages === 1) //we only have one page
	{
		disablePrevious(type, true);
		disableNext(type, true);
	}
	else if(goToPageNumber === 1) //we are on the first page and have more pages
	{
		disablePrevious(type, true);
		disableNext(type, false);
	}
	else if(goToPageNumber === totalNumberOfPages) //we are on the last page
	{
		disablePrevious(type, false);
		disableNext(type, true);
	}
	else //we are in the middle somewhere enable both links
	{
		disablePrevious(type, false);
		disableNext(type, false);
	}
}

function disablePrevious(type, shouldDisable)
{
	var $previousLi = $('#' + type + 'PreviousLi');
	var $previousLink = $('#' + type + 'PreviousLink');
	if(shouldDisable)
	{
		$previousLi.addClass('disabled');
		$previousLink.addClass('disabled');
	}
	else
	{
		$previousLi.removeClass('disabled');
		$previousLink.removeClass('disabled');
	}
}

function disableNext(type, shouldDisable)
{
	var $nextLi = $('#' + type + 'NextLi');
	var $nextLink = $('#' + type + 'NextLink');
	if(shouldDisable)
	{
		$nextLi.addClass('disabled');
		$nextLink.addClass('disabled');
	}
	else
	{
		$nextLi.removeClass('disabled');
		$nextLink.removeClass('disabled');
	}
}

function determineIfLinkPressedIsDisabled(type, linkType)
{
	var $link = $('#' + type + linkType + "Link");
	if($link.hasClass('disabled'))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function determineHyperLinkRoute(type, siteUrl)
{
	var route = siteUrl;
	if(type === 'tool')
	{
		route += "staff/tool/review/";
	}
	else if(type === 'volunteer')
	{
		route += "staff/volunteer/account/";
	}
	else if(type === 'jobsite')
	{
		route += "staff/jobsite/evaluation/";
	}
	return route;
}

function getGoToPageNumber(type, linkType)
{
	var goToPageNumber = 0;
	var $pageNumber = $('#' + type + "PageNumber");
	if(linkType === 'Previous')
	{
		goToPageNumber = parseInt($pageNumber.val()) - 1;
	}
	else if(linkType === 'Next')
	{
		goToPageNumber = parseInt($pageNumber.val()) + 1;
	}
	return goToPageNumber;
}

function updatePageNumber(type, linkType)
{
	var $pageNumber = $('#' + type + "PageNumber");
	if(linkType === 'Previous')
	{
		$pageNumber.val(parseInt($pageNumber.val()) - 1);
	}
	else if(linkType === 'Next')
	{
		$pageNumber.val(parseInt($pageNumber.val()) + 1);
	}
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