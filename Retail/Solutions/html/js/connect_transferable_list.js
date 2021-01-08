/*
 * Copyright (c) TEMENOS HEADQUARTERS SA, All rights reserved.
 *
 * This source code is protected by copyright laws and international copyright treaties,
 * as well as other intellectual property laws and treaties.
 *  
 * Alteration, duplication or redistribution of this source code in any form 
 * is not permitted without the prior written authorisation of TEMENOS HEADQUARTERS SA.
 * 
 */

var UNSELECT_LIST_PREFIX = "UNSEL_";
var SELECT_LIST_PREFIX = "SEL_";
var SEL_BTN_PREFIX = "B1_";
var SELALL_BTN_PREFIX = "B2_";
var DESEL_BTN_PREFIX = "B3_";
var DESELALL_BTN_PREFIX = "B4_";

//Transferable lists are set up initially with all list values displayed in the unselect (ie left) list with the selected options highlighted.
//This function calls 'selectThese()' to copy highlighted values from the unselect list to the select list.
function copyTransferableListValues(ns, onload)
{
	var lists = document.forms[ns+"form1"].getElementsByTagName("select");
	for (var i=0; i < lists.length ; i++ )
	{
		if (lists[i].id.indexOf(UNSELECT_LIST_PREFIX) > -1)
		{
		    var compPrefix = getCompID(ns, lists[i].id);
		    if  ( compPrefix == null )
		    {
		        compPrefix = "";
		    }
			var listId = lists[i].id.substring(lists[i].id.indexOf(UNSELECT_LIST_PREFIX) + UNSELECT_LIST_PREFIX.length);
			var unselListName = compPrefix + UNSELECT_LIST_PREFIX + listId;
			var selListName = compPrefix + SELECT_LIST_PREFIX + listId;
			var hiddenName = compPrefix + listId;
			selectThese(ns,unselListName,selListName);
			setHiddenWithSelected(ns,selListName,hiddenName,onload);
		}
	}
}

function selectThese(ns,from,to)
{
	var fromList = document.getElementById(ns + from);
	var toList = document.getElementById(ns + to);
	var removed = new Array();
	for(var i = 0; i < fromList.length; i++)
	{
		//clear blank option needed for xhtml if there is one
		if (i == 0) removeEmptyOption(toList);

		if (fromList.options[i].selected)
		{
			var newOption = new Option(fromList.options[i].text,fromList.options[i].value);
			newOption.id = fromList.options[i].id;
			toList.options[toList.options.length] = newOption;
			removed[removed.length] = i;
		}
	}
	for(var i = ((fromList.length) - 1); i >= 0; i--)
	{
		for (var i2=((removed.length) - 1); i2 >= 0; i2--)
		{
			if (removed[i2] == i)
			{
				fromList.options[i] = null;
			}
		}
	}
}

function selectAll(ns,from,to)
{
	var fromList = document.getElementById(ns + from);
	var toList = document.getElementById(ns + to);
	for(var i = 0; i < fromList.length; i++)
	{
		if (i == 0) removeEmptyOption(toList);
		var newOption = new Option(fromList.options[i].text,fromList.options[i].value);
		newOption.id = fromList.options[i].id;
		toList.options[toList.options.length] = newOption;
	}
	for(var i = ((fromList.length) - 1); i >= 0; i--)
	{
		fromList.options[i] = null;
	}
}

function removeEmptyOption(p_list)
{
	if (p_list.options.length > 0)
	{
		var firstOption = p_list.options[0];
		if (firstOption.value == null || firstOption.value == "")
		{
			p_list.options[0] = null;
		}
	}
}

function setHiddenWithSelected(ns,selList,selHidden,onload)
{
	var selList = document.getElementById(ns + selList);
	var v = "";
	var selected = 0;
	for(var i = 0; i < selList.length; i++)
	{
		if (i > 0)
		{
			v += '\|';
		}
		v += selList.options[i].value;
		selected++;
	}
	hidden = document.getElementById(ns + selHidden);
	hidden.value = v;
	//run any check hidden code...
	callOnChangeHandler(selList, onload);
}

function callOnChangeHandler(selList, onload)
{
	if (!selList.disabled && selList.onchange)
	{
 		if (onload && ('' + selList.onchange).indexOf('ajaxCheckHidden') >=0)
		{
			var oc = '' + selList.onchange;
			var chIndex = oc.indexOf('ajaxCheckHidden');
			var ch = oc.substring(chIndex , oc.indexOf(';', chIndex));			
			var funcArgs = oc.substring(chIndex+16 , oc.indexOf(';', chIndex)-1).replace(/'/g,'').replace(/"/g,'').split(', ');			
			if (funcArgs.indexOf('this')>0) funcArgs[funcArgs.indexOf('this')] =  selList;
			ajaxCheckHidden.apply(window,funcArgs)
		}
		else if (!onload)
		{
	        execute(selList, "onchange", CHANGED_SELECTION_TRIGGER);
		}
	}
}