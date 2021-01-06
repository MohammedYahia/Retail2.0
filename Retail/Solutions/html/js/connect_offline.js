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

//This overrides the default version in connect.js.  In offline 
//forms, the path separator character is a \ not a /.

debug = false;
debugTiming = false;
var undoRules = "";//new Array();
var doUpdateUserValues = true;

function getImageDirPath(namespace)
{
	return "." + getVariable(namespace, 'imageDirPath');
} 

var APP_DIRECTORY = "data";
var TXT_EXTENSION = ".app";
var OFFLINE_CONTROLLER = "html/offlineController.html";

//var APP_FORM;

var MATCH_ALL_SUBSCRIPTS    = new RegExp("\\[[^\\]]+]", "g");
var MATCH_PART_FUNCTIONS    = new RegExp("\\.[A-Z]+()");

var OPEN_FILE_FOR_READ = 1;
var OPEN_FILE_FOR_WRITE = 2;
var OPEN_FILE_FOR_APPEND = 8;
  
var PREFIX = 0;
var SUFFIX = 1;
var ROW_SUFFIX = "_R";
var FIELDSET_PREFIX = "FS_";

var getOfflineFileNamePagePath = "html/getOfflineFileName.html";

var SW_SYSDATE = "SYSDATE";
var SW_SYSDATETIME = "SYSDATETIME";
var SW_SYSTIME = "SYSTIME";
var SW_SYSDAY = "SYSDAY";
var SW_SYSMONTH = "SYSMONTH";
var SW_SYSYEAR = "SYSYEAR";
var SW_SYSHOUR = "SYSHOUR";
var SW_SYSHOUR_OF_DAY = "SYSHOUR_OF_DAY";
var SW_SYSMINUTE = "SYSMINUTE";
var SW_SYSSECOND = "SYSSECOND";
var SW_SYSAM_PM = "SYSAM_PM";
var SW_SYSTIMEMILLIS = "SYSTIMEMILLIS";
var SW_PAGE = "PAGE";
var SW_PROCESS = "PROCESS";
var SW_PHASE = "PHASE";
var SW_PROJECTHOME = "PROJECTHOME";


var DAYS_PART = "DAY";
var MONTHS_PART = "MONTH";
var YEARS_PART = "YEAR";
var HOURS_PART = "HOUR";
var MINUTES_PART = "MINUTE";
var SECONDS_PART = "SECOND";

var DATE_FN = ".DATE()";
var TIME_FN = ".TIME()";
var DAY_FN = ".DAY()";
var MONTH_FN = ".MONTH()";
var YEAR_FN = ".YEAR()";
var HOUR_FN = ".HOUROFDAY()";
var MINUTE_FN = ".MINUTES()";
var SECOND_FN = ".SECONDS()";

var NOT_REQUIRED = "Not Required";

var PART_LOOKUP = new Array();
PART_LOOKUP["Day"] = DAY_FN;
PART_LOOKUP["Month"] = MONTH_FN;
PART_LOOKUP["Year"] = YEAR_FN;
PART_LOOKUP["Hours"] = HOUR_FN;
PART_LOOKUP["Minutes"] = MINUTE_FN;
PART_LOOKUP["Seconds"] = SECOND_FN;
PART_LOOKUP["Not Required"] = NOT_REQUIRED;


var DATE_PART_ID = new Array();
DATE_PART_ID["DATE"] = "DATE";
DATE_PART_ID["TIME"] = "TIME";
DATE_PART_ID["DAY"] = "DAY";
DATE_PART_ID["MONTH"] = "MONTH";
DATE_PART_ID["YEAR"] = "YEAR";
DATE_PART_ID["HOUROFDAY"] = "HOUROFDAY";
DATE_PART_ID["MINUTES"] = "MINUTES";
DATE_PART_ID["SECONDS"] = "SECONDS";

var DEFAULT_DATE_ORDER = new Array();
DEFAULT_DATE_ORDER[0] = DAY_FN;
DEFAULT_DATE_ORDER[1] = MONTH_FN;
DEFAULT_DATE_ORDER[2] = YEAR_FN;

var DEFAULT_TIME_ORDER = new Array();
DEFAULT_TIME_ORDER[0] = HOUR_FN;
DEFAULT_TIME_ORDER[1] = MINUTE_FN;
DEFAULT_TIME_ORDER[2] = SECOND_FN;

var DEFAULT_DATE_SEP_ORDER = new Array();
DEFAULT_DATE_SEP_ORDER[0] = "/";
DEFAULT_DATE_SEP_ORDER[1] = "/";

var DEFAULT_TIME_SEP_ORDER = new Array();
DEFAULT_TIME_SEP_ORDER[0] = ":";
DEFAULT_TIME_SEP_ORDER[1] = ":";

var DEFAULT_DATETIME_ORDER = new Array();
DEFAULT_DATETIME_ORDER[0] = DAY_FN;
DEFAULT_DATETIME_ORDER[1] = MONTH_FN;
DEFAULT_DATETIME_ORDER[2] = YEAR_FN;
DEFAULT_DATETIME_ORDER[3] = HOUR_FN;
DEFAULT_DATETIME_ORDER[4] = MINUTE_FN;
DEFAULT_DATETIME_ORDER[5] = SECOND_FN;

var DEFAULT_SEPARATOR_ORDER = new Array();
DEFAULT_SEPARATOR_ORDER[0] = "/";
DEFAULT_SEPARATOR_ORDER[1] = "/";
DEFAULT_SEPARATOR_ORDER[2] = " ";
DEFAULT_SEPARATOR_ORDER[3] = ":";
DEFAULT_SEPARATOR_ORDER[4] = ":";

var readOnlyFields = new Array(); //ids of fields which have been set (statically, not dynamically) to read-only
var readOnlyFieldDisplays = new Array(); //read-only display type of each field on phase i.e. 'disabled answer' or 'text'
var stateObjects = new Object(); //stores read-only details for each field on phase
var attributes = new Array(); //stores presentation attributes for the phase e.g. decimal symbol, digit group symbol 
var dollarLookup = null; //backs up $$...$ so qlr can update page..
var pageErrors = new Array();

/************************************************************************
* Method: update
* Description:  This gets called by the onload method in the body tag.
*               It runs the prephase rules, and then setups the fields
*               with the dictionary values.  We then set them up to be 
*               disabled (if they are!)
* 
**************************************************************************/
var totalTime = 0;
var prevTime, currentTime;

function logTime(description) {
	if(debugTiming) {
		var currentTime = (new Date()).getTime();
		totalTime += (currentTime - prevTime);
		alert(description + (currentTime - prevTime));
		prevTime = (new Date()).getTime();
	}
}

function update(question)
{
	if(debugTiming){
		alert("Starting update");
		prevTime = (new Date()).getTime();
	}

    var form = document.getElementById("form1");
    var page = form.elements["PAGE"].value;
	var formElements = form.elements;
	parent.CURRENT_PAGE = page;
	
	//Check whether an object containing the last mandatory and read-only state has already been saved for this page.  If not, create one.  (NB: not very efficient - needs tidying up.)
	var pageKey = form.elements["PAGE"].value;
	if (parent.getPageState(pageKey))
	{
		stateObjects = parent.getPageState(pageKey);
	}
		
	//Set up a 'stateObj' for each form element, storing its editable display, text display, current read-only status and display type.  
	//This acts as a 'master copy' of each element when it might, for example, have been turned into text display and we need to turn it back to editable display.
	//Mandatory state now stored in stateObj too.
	for (var i=0; i < formElements.length ; i++)
    {
        if (formElements[i].id && formElements[i].name && formElements[i].type && formElements[i].type != "hidden" && formElements[i].type != "button")
		{
			var roObject = stateObjects[formElements[i].id];
			if (roObject)
			{
				//Workaround - although a 'stateObj' has been stored in parent.stateObjects, the stateObj.node bit doesn't appear to be stored, so I have to initialise this afresh each time.
				roObject.node = formElements[i];
			}
			else
			{
				roObject = new stateObj(formElements[i]);
				stateObjects[formElements[i].id] = roObject;
    		}
		}
    }
	logTime("pass1 (setup state objects): ");

    //Re-populate system words in dictionary prior to running rules
	populateSystemWordsIntoDictionary();
	var func;
	if (question)
	{
		func = new Function(page + "_" + question + "()");
	}
	else
	{
    	func = new Function(page + "_prephase()");
    }
    try
    {
    	func();
    }
    catch(ex)
	{
		var pageParts = page.split("_");
		var page = pageParts[0] + "_" + pageParts[1];
		var pageSections = parent.navPageSections[page];
		if (pageParts.length == 3) //page section number has been appended to page name
		{
			if (pageSections.sectionIndex == 0) 
			{
				//if current page section is first section, we should have a prephase function to run
				func = new Function(page + "_prephase()");
				func();
			}
		}
	}
	logTime("pass2 (run pre phase rules): ");

	updateDynamicLists();
	logTime("pass3 (update dynamic lists): ");
	
	var tableSelectors = new Array();
	var firstSelector = new Array();
	//For each form element in stateObjects, set the corresponding form field to the latest session value (or default value if a session value isn't found).
	for (var id in stateObjects)
    {
		var obj = stateObjects[id];
        if (obj.node.type == "hidden" || obj.node.type == "button"){
            continue;
        }
		var formObj = document.getElementById(obj.node.id);
		var val = null;
		if (formObj && obj.node.name)
		{
			if (obj.node.name.indexOf(UNSELECT_LIST_PREFIX) == 0)
			{
				var diName = obj.node.name.substring(UNSELECT_LIST_PREFIX.length);
				val = getSessionValueForPresentation(diName);
				if (debug)
					alert("UNSELECT_LIST_PREFIX: Value for " + obj.node.name + " = " + val);
				selectTransferableListValues(formObj, val);
			}
			else if (obj.node.name.indexOf(SELECT_LIST_PREFIX) == 0)
			{
				var diName = obj.node.name.substring(SELECT_LIST_PREFIX.length);
				val = getSessionValueForPresentation(diName);
                var hidden = document.getElementById(diName);
                hidden.value = val;
            }
            else if (obj.node.name.indexOf(SINGLE_CHECKBOX_PREFIX) == 0)
			{	//Get sessioned value for checkbox's hidden field
				var diName = obj.node.name.substring(1);
				val = getSessionValueForPresentation(diName);
				setFieldValue(formObj, val);
			}
			else
			{
                if  ( formObj.name && formObj.name == SELECTALL_NAME )
                {
                    tableSelectors.push(formObj);
                }
                else
                {
    				val =  getSessionValueForPresentation(obj.node.name);
    				if (debug)
    					alert("Value for " + obj.node.name + " = " + val);
    				//Store the first Selector found for table recolouring	
    				if (formObj.id && endsWith(formObj.id, SELECTOR_INDICATOR + "R1"))
    				{
    					firstSelector.push(formObj);
    				}
    				if (val == null || val == "undefined" || val == "")
    				{
    					//check if there is a default value...
    					val = "" + getElementValue(formObj);
    					if (val != null && val != "" && !formObj.disabled){
    						setDefaultSessionValue(obj.node.name, val);
						}
    				}
    				setFieldValue(formObj, val);
                }
			}
			//not sure if this is needed - removed for performance reasons...
			//var val = getElementValue(formObj);
			if (val != null && val.length > 0)
			{
				//Update 'master copy' of field in stateObjects with the latest value.
				if (formObj.value == val)
				{
					obj.displayText = val;
					obj.node.value = val;
				}
			}
		}	              
    }
	logTime("pass4 (populate values): ");
	
    //Handle dynamic mandatory fields
    updateDynamicMandatoryFields();
	logTime("pass5 (update dynamic mand fields): ");

	//Handle dynamic and static read-only fields
	updateDynamicReadOnlyFields();    
	logTime("pass6 (update dynamic read only fields): ");

	//update tables - selectors and hidden rows.
    updateTables(tableSelectors, firstSelector);
	logTime("pass7 (update tables): ");


    //Now substitute any remaining $$ values (except in hidden conditions!!)
	//start off with everything now, due to divs...
	if (dollarLookup)
	{
		for (var id in dollarLookup)
		{
			var elem = document.getElementById(id);
			if (elem)
			{
				elem.innerHTML = tokenReplace(dollarLookup[id]);
			}
		}
		offlineSetupScript();
	}
	else
	{
		var doc = document.getElementsByTagName("body")[0];
		var elems = new Array()
		addElement(doc, "div", elems);
		addElement(doc, "span", elems);
		addElement(doc, "td", elems);
		addElement(doc, "th", elems);
		addElement(doc, "table", elems);
		addElement(doc, "fieldset", elems);
		addElement(doc, "input", elems);
		addElement(doc, "select", elems);
		addElement(doc, "a", elems);
		addElement(doc, "button", elems);
		for (var i = 0; i < elems.length ; i++ )
		{
			var elem = elems[i];
			if (elem.tagName == "TR") continue;
			if (elem.id && ( elem.id.indexOf("p1_") == 0 || elem.id.indexOf("p4_") == 0 || elem.id.indexOf("TXT_") == 0) )
			{ 
				//check for $$ (and that there aren't any tables in innerHTML
				var inner_html = elem.innerHTML;
				if (inner_html.indexOf("$$") >= 0 && inner_html.indexOf("<TABLE") < 0)
				{
					var startHiddenConditionInd = inner_html.indexOf("checkHiddenOffline\(");
					if (startHiddenConditionInd < 0)
					{
						//if there is a [C] and in a table - we set the instance up...
						var origInst;
						var dgToInc;
						if (inner_html.indexOf("[C]") >= 0)
						{
							var table = getParentNode(elem, 'table');
							if (table && table.id && attributes[table.id] && attributes[table.id].DataGroupsToIncrement)
							{
								var whichRow = getParentNode(elem, 'tr');
								var rowId = whichRow.id;
								if (rowId.indexOf("_R") > 0)
								{
									//strip off the _Rx part and set the insatnce to x
									var inst = rowId.substring(rowId.lastIndexOf("_R") + 2);
									dgToInc = attributes[table.id].DataGroupsToIncrement;
									origInst = parent.dataGroupInstances[dgToInc];
									parent.dataGroupInstances[dgToInc] = inst;
								}
							}
						}
						if (!dollarLookup) dollarLookup = new Array();
						dollarLookup[elem.id] = inner_html;
						elem.innerHTML = tokenReplace(inner_html, false, true);
						if (origInst != null && dgToInc != null)
						{
							parent.dataGroupInstances[dgToInc] = origInst;
						}
					}
					else
					{
						//there might only be $$ in the hidden conditions, in which case we don't want to do a TokenReplace.
						//that is because the state of a question may have already been set up, which would then be changed
						//by updating the innerHTML...
						var endHiddenConditionInd = inner_html.indexOf("\)", startHiddenConditionInd);
						var tmpHTML = inner_html.substring(startHiddenConditionInd, endHiddenConditionInd);

						if (inner_html.indexOf("$$") < startHiddenConditionInd ||
							inner_html.indexOf("$$") > endHiddenConditionInd)
						{
							var tokenReplacedHTML = tokenReplace(inner_html.substring(0,startHiddenConditionInd), false, true);
							tokenReplacedHTML += tmpHTML;
							tokenReplacedHTML += tokenReplace(inner_html.substring(endHiddenConditionInd), false, true);
							elem.innerHTML = tokenReplacedHTML;
						}
					}
				}
			}
		}
	}

    
	logTime("pass8 (final $$...$ replacement): ");

	if(debugTiming){
		alert("total time = " + totalTime);
	}

    //Save page state as we might need to know the last mandatory or read-only state later.
    parent.addPageState(pageKey, stateObjects);
}

function updateTables(p_selectors, p_firstSelector)
{
	for (var sel = 0; sel < p_firstSelector.length; sel++)
	{
		var tbody = getParentNode(p_firstSelector[sel], 'tbody');
     	if (tbody && tbody.childNodes && tbody.childNodes.length )
	    {
	       if 	(	tbody.childNodes[1].onmouseout 
	         		&&  tbody.childNodes[1].onmouseout.toString().indexOf("mouseLeft") > -1
	     		)
	       {
	          	tbody.childNodes[1].onmouseout();
		   }
	   }
	}
    for (var sel = 0; sel < p_selectors.length; sel++)
    {
        var selectAll = p_selectors[sel];
        var checked = false;
        var tbody = getParentNode(selectAll, 'tbody');
        if (tbody && tbody.childNodes && tbody.childNodes.length )
        {
            checked = true;
            for (var i=1; i<tbody.childNodes.length; i++)
            {
                if (tbody.childNodes[i].innerHTML)
                {
                    var selector = getSelector(tbody.childNodes[i]);
                    if  ( selector == null || !selector.checked )
                    {
                        checked = false;
                        break;
                    }
                }
            }
        }
        selectAll.checked = checked;
    }

    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length ; i++ )
    {
        var table = tables[i];
        updateHiddenRowsInTable(table);
    }
}    

function checkRowHidden()
{
}


function updateHiddenRowsInTable(table)
{
	if (table.id && attributes[table.id] != null)	{
		if (attributes[table.id].NoEmptyRows == 'true')		{
			var rowsToShow = getLastInstance(attributes[table.id].DataGroupsToIncrement);
			var rows = table.getElementsByTagName('tr');
			for (var j = 1; j < rows.length ; j++ ) {
				if(j > rowsToShow)				{
					rows[j].style.display = 'none';
				}
			}

			if (rowsToShow == 0){
				var cell = document.createElement('td');
				cell.innerHTML = "" + attributes[table.id].NoRecordsMessage;
				var row  = document.createElement('tr');
				row.appendChild(cell);
				table.appendChild(row);
			}
		}
	}
}

/************************************************************************
* Method: getBaseId
* Description:  Checks whether valToRemove is found at the beginning or end of the id.  If found, returns the id minus the prefix or suffix. 
* 
**************************************************************************/
function getBaseId(id, valToRemove, prefixOrSuffix)
{
	id = id.toUpperCase();
	valToRemove = valToRemove.toUpperCase();

	if (PREFIX == prefixOrSuffix)
	{
		if (id.indexOf(valToRemove) == 0)
		{
			id = id.substring(valToRemove.length);
		}
	}
	else if (SUFFIX == prefixOrSuffix)
	{ 	//Not always a perfect suffix, e.g. we will need to use "_R" to remove suffixes of "_R1", "_R2" etc.!
		//if (id.indexOf(valToRemove) > 0 && id.substring(valToRemove.length) == valToRemove)
		if (id.lastIndexOf(valToRemove) > 0)
		{
			id = id.substring(0,id.lastIndexOf(valToRemove));
		}
	}
	return id;
}

/************************************************************************
* Method: removeSuffixOrPrefixFromId
* Description:  Checks id for all possible prefixes and suffixes, and has any found removed from the base id
* 
**************************************************************************/
function removeSuffixOrPrefixFromId(id, retainFinalPrefix)
{
	id = getBaseId(id, SELECT_LIST_PREFIX, PREFIX); //Transferable "select" list
	id = getBaseId(id, UNSELECT_LIST_PREFIX, PREFIX); //Transferable "un-select" list
	id = getBaseId(id, SEL_BTN_PREFIX, PREFIX); //Transferable list "select" navigation button
	id = getBaseId(id, SELALL_BTN_PREFIX, PREFIX); //Transferable list "select all" navigation button
	id = getBaseId(id, DESEL_BTN_PREFIX, PREFIX); //Transferable list "de-select" navigation button
	id = getBaseId(id, DESELALL_BTN_PREFIX, PREFIX); //Transferable list "de-select all" navigation button
	id = getBaseId(id, DATE_SUFFIX, SUFFIX); //Date part of date
	id = getBaseId(id, TIME_SUFFIX, SUFFIX); //Time part of date
	id = getBaseId(id, DAY_SUFFIX, SUFFIX); //Day part of date
	id = getBaseId(id, MONTH_SUFFIX, SUFFIX); //Month part of date
	id = getBaseId(id, YEAR_SUFFIX, SUFFIX); //Year part of date
	id = getBaseId(id, HOURS_SUFFIX, SUFFIX); //Hours part of date
	id = getBaseId(id, MINUTES_SUFFIX, SUFFIX); //Minutes part of date
	id = getBaseId(id, SECONDS_SUFFIX, SUFFIX); //Seconds part of date
	id = getBaseId(id, ROW_SUFFIX, SUFFIX); //Identifies a table row
	id = getBaseId(id, FIELDSET_PREFIX, PREFIX); //Identifies a radio or checkbox fieldset
	if (! retainFinalPrefix)
	{
		id = getBaseId(id, "_", SUFFIX); //Identifies radio buttons checkboxes from a group of more than one.
	}
	
	return id;
}

/************************************************************************
* Object: stateObj
* Description:  Object to store read-only information about a form element:
* 	node - editable form input field
*	baseId - form field id, stripped of any prefixes or suffixes (e.g. row index suffixes, transferable list prefixes).
*	readOnly - current read-only state of field i.e. true/false.  Initially set to static read-only state but may be updated if the read-only state is changed dynamically from a setProcessItemStatus rule.
*	displayType - how to display field in its read-only state i.e. disabled html/text.
*	displayText - the text 'value' of the field, used when displaying the field as read-only text.
*	divInnerHTML - the (editable) inner html of the form field's outermost div.  We toggle between this editable inner html and a text inner html constructed from displayText above.
* 
**************************************************************************/
function stateObj(node)
{
	this.node = node;
	this.type = node.type;
	this.baseId = removeSuffixOrPrefixFromId(this.node.id, this.type!="radio" && this.type!="checkbox");
	this.readOnly = getNodeReadOnly(this.baseId);
	this.displayType = getNodeDisplayType(this.baseId);
	this.displayText = getNodeRODisplayText(this.node);
	this.divInnerHTML;
	this.mandatory = getNodeMandatory(this.baseId,this.node.id);
    this.mandMessage = getNodeMandMessage(this.baseId, this.node.id);
}

/************************************************************************
* Method: getNodeReadOnly
* Description:  Checks whether the field has been set statically to read-only (static read-onlys are hard-coded into the 'readOnlyFields' array when the page is generated).
* 
**************************************************************************/
function getNodeReadOnly(id)
{
	id = removeSuffixOrPrefixFromId(id, true);
	var isReadOnly = false;
	for (var i = 0; i < readOnlyFields.length; i++)
	{
		if (id == readOnlyFields[i])
		{
			isReadOnly = true;
			break;
		}	
	}
	return isReadOnly;
}

/************************************************************************
* Method: getNodeRODisplayText
* Description:  Gets the read-only text of the node by getting the current value of its corresponding form field
* 
**************************************************************************/
function getNodeRODisplayText(node)
{
	var text = getElementDisplayValue(node);
	/*if (text == null || text.length == 0)
	{
		text = "";
	}*/
	return text;
}

/************************************************************************
* Method: getNodeDisplayType
* Description:  Gets the read-only display type of the field.  These are hard-coded into the 'readOnlyFieldDisplays' array when the page is generated.
* 
**************************************************************************/
function getNodeDisplayType(baseId)
{
	var displayType = readOnlyFieldDisplays[baseId];
	if (displayType == null || displayType.length == 0)
	{
		displayType = 'Text';
	}
	return displayType;
}

function getElementDisplayValue(comp, namespace){
 if (namespace  == null) namespace = "";

 if (comp.type == "text" || comp.type == "textarea" || comp.type == "password" || comp.type == "file" || comp.type == "hidden" ) return comp.value;
 else if (comp.type == "select-one"){
   for (var i = 0; i < comp.length; i++){
    if (comp[i].selected  && comp[i].value.length > 0) 
    {return comp[i].text;}
   }
   return "";
 }
 else if (comp.type == "select-multiple"){
   var v = ""; var selected = 0;
   if (comp.id != null && comp.id.indexOf(SELECT_LIST_PREFIX) == 0){
    for(var i = 0; i < comp.length; i++){
     if (i > 0)  v += '\|';
     if (comp.options[i].value.length > 0) v += comp.options[i].text;
    }
   }
   else{
    for(var i = 0; i < comp.length; i++){
     if (comp.options[i].selected && comp.options[i].value.length > 0){
      if (selected > 0)  v += '\|';
      v += comp.options[i].text;
      selected++;
     }
    }
   }
   return v;
 }
 else if (comp.type == "checkbox"){
  var v = ""; var selected = 0;
  var p0;
  if (comp.id.indexOf("_Selector_") > 0) // get the selector checkbox items...
   return "";
  else
   p0 = comp.parentNode.parentNode.getElementsByTagName("input");
  if (comp.name != null && (comp.name.indexOf(SINGLE_CHECKBOX_PREFIX) == 0)){
   var str = "";
   if (p0[0].checked) str = p0[0].value.substring(0, p0[0].value.indexOf("|"));
   else str = p0[0].value.substring(p0[0].value.indexOf("|") + 1);
   p0[1].value = str;
   return str;
  }
  for (var i = 0; i < p0.length ; i++){
   if (p0[i].checked && !p0[i].parentNode.disabled){
    if (selected > 0)  v += '\|';
     v += p0[i].parentNode.childNodes[1].innerHTML;
    selected++;
   }    
  }
  return v;
 }
 else if (comp.type == "radio"){
   if (comp.name == null || comp.name == ""){
       return "";
   }
   var p0;
   if (comp.id.indexOf("_Selector_") > 0) // get the selector radio items...
    return "";
   else
    p0 = comp.parentNode.parentNode.getElementsByTagName("input");
   for (var i = 0; i < p0.length ; i++){
       if (p0[i].checked) 
	   {
		   return p0[i].parentNode.childNodes[1].innerHTML;
	   }
   }
   return "";
 }
 else if (comp.type == null && comp[0] != null){
   if (comp[0].type == "radio"){
    for (var i = 0; i < comp.length; i++){
     if (comp[i].checked) return comp[i].parentNode.childNodes[1].innerHTML;
    }
   }
   return "";
 }
}

/************************************************************************
* Method: getNodeMandatory
* Description:  Get initial mandatory state of node.
* 
**************************************************************************/
function getNodeMandatory(baseId, id)
{
    var mandmessage = document.getElementById("MM_" + baseId);    

    if (mandmessage != null)
		mand = true;
	else
		mand = false;
	
	return mand;
}

/************************************************************************
* Method: getNodeMandMessage
* Description:  Get mandatory message stored in node's 'title' attribute.
* 
**************************************************************************/
function getNodeMandMessage(baseId, id)
{
    var mandmessage = document.getElementById("MM_" + baseId);    
    var msg = "";
    if (mandmessage)
    {
        msg = mandmessage.innerHTML;
    }
    
    return msg;
}

/************************************************************************
* Method: updateDynamicReadOnlyFields
* Description:  Handles dynamic read-only fields.  Update phase, process or question whose read-only status was changed in a Set Process Item Status rule.
* 
**************************************************************************/
function updateDynamicReadOnlyFields()
{
    var page = parent.getCurrentProcessAndPhase();
	var process = parent.getCurrentProcess();
    var phase = page;   
    var stateObj = null;
	var updatePhaseOrProcess = false;
	var processedIds = new Array();

    if ((readOnlyStateObj = parent.questionState["phase_" + phase]) != null)
	{
		//Read-only status of current phase has been changed
		updatePhaseOrProcess = true;
	}
	else if ((readOnlyStateObj = parent.questionState["process_" + process]) != null)
	{
		//Read-only status of current process has been changed
		updatePhaseOrProcess = true;
	} 

	for (var id in stateObjects)
	{
		var obj = stateObjects[id];
		if (obj.node.type == "hidden"){
			continue;
		} 
		if (obj.node.name && obj.node.id && (! obj.node.id.indexOf(SELECT_LIST_PREFIX) == 0))
		{
			if (! fieldProcessed(processedIds, obj))
			{
				if (! updatePhaseOrProcess)
				{	
					//Has read-only status of current field been changed?
					if (parent.questionState[obj.baseId] != null)
					{
						//Update 'master copy' of field with new read-only status
						var readOnly = parent.questionState[obj.baseId];
						obj.readOnly = readOnly;
					}
					//Update field display
					updateReadOnlyQuestion(obj);
					delete parent.questionState[obj.baseId];
				}
				else
				{
					//Read-only status of current field's phase or process has been changed. 
					evalReadOnlyQuestion(obj,readOnlyStateObj);
				}
				if (isRowId(obj.node.id))
					processedIds.push(obj.node.id);
				else
					processedIds.push(obj.baseId);
			}
	   }
	}
	if (updatePhaseOrProcess)
	{
		delete parent.questionState["phase_" + phase];
		delete parent.questionState["process_" + process];
	}
}

/************************************************************************
* Method: evalReadOnlyQuestion
* Description: Determine latest read-only status of question by determining whether new state should override current state
* 
**************************************************************************/
function evalReadOnlyQuestion(obj,stateObj)
{
		var readOnly = stateObj.state; //New read-only state
		//var currentlyReadOnly = obj.readOnly; //Old read-only state
		var ignoreReadOnly = stateObj.ignoreCurrentState; //Whether to ignore old read-only state
		//readOnly = fieldIsReadOnly(currentlyReadOnly, readOnly, ignoreReadOnly);	
		var roIds =  readOnlyFields.join();
		if (roIds.indexOf(obj.baseId) >=0 && ignoreReadOnly)
		{
			readOnly = true;
		}
		else
		{
			readOnly = stateObj.state;
		}
		//Update 'master copy' with latest read-only state.
		obj.readOnly = readOnly;
		updateReadOnlyQuestion(obj);
}

/************************************************************************
* Method: fieldIsReadOnly
* Description: Determines latest read-only state.
* 
**************************************************************************/
function fieldIsReadOnly(currentlyReadOnly, newReadOnly, ignoreCurrentReadOnly)
{
	var readOnly;
	if (!newReadOnly && currentlyReadOnly && !ignoreCurrentReadOnly)
	{
		readOnly = false;
	}
	else if (!newReadOnly && !currentlyReadOnly)
	{
	    readOnly = false;
	}
	else
	{
		readOnly = true;
	}
	return readOnly;
}

/************************************************************************
* Method: updateReadOnlyQuestion
* Description:  Gets form fields corresponding to node to be updated and determines what display type should be
* 
**************************************************************************/

function updateReadOnlyQuestion(obj)
{
		var isTransList = false;
		var isList = false;
		var displayType;
		
		if (obj.node.id != null)
		{
			//Try to extract data item name from node name to test whether question is transferable list
			var id = "";
			if (obj.node.id.indexOf(UNSELECT_LIST_PREFIX) == 0)
				id = obj.node.id.substring(UNSELECT_LIST_PREFIX.length);
			else if (obj.node.id.indexOf(SELECT_LIST_PREFIX) == 0)
				id = obj.node.id.substring(SELECT_LIST_PREFIX.length);
			
			if (id.length > 0)
			{
				isTransList = true;
			}

			if (isRadio(obj.node) || isCheckBox(obj.node))
			{
				isList = true;
			}

			if (obj.displayType == "Text")
			{
                if  ( obj.node.id.indexOf('.') > -1 )
                {
                    var part = obj.node.id.substring(obj.node.id.indexOf('.')+1);
                    if  ( part in DATE_PART_ID )
                    {
                        var formObj = document.getElementById(obj.node.id);
                        var spanClass = formObj.className;
                        if (spanClass == null || spanClass.length == 0)
                        {
                            spanClass = formObj.parentNode.className;
                        }
                    
                        for (part in DATE_PART_ID)
                        {
                            var dateObjId = obj.baseId + "." + part;
                            var dateObj = document.getElementById(dateObjId);
                            if  ( dateObj != null )
                            {
                                setDatePartReadOnlyText(obj, dateObj, spanClass);
                            }
                        }
                        return;
                    }
                }
				setNodeReadOnlyText(obj);
			}
			else //disabled html component
			{
				if (isTransList)
				{
					//Get unselect and select lists and navigation buttons using data item name
					var formObj = new Array();
					formObj[0] = document.getElementById(UNSELECT_LIST_PREFIX + id);
					formObj[1] = document.getElementById(SELECT_LIST_PREFIX + id);
					formObj[2] = document.getElementById(SEL_BTN_PREFIX + id);
					formObj[3] = document.getElementById(SELALL_BTN_PREFIX + id);
					formObj[4] = document.getElementById(DESEL_BTN_PREFIX + id);
					formObj[5] = document.getElementById(DESELALL_BTN_PREFIX + id);

					for (var i=0; i<formObj.length; i++)
						setNodeReadOnlyDisabled(formObj[i], obj.readOnly);
				}
				else if (isList)
				{
					//May be multiple options for the list or checkbox which all need disabling.  Options are suffixed with an instance number.
					var instanceNum = 0;
					var formObj = document.getElementById(obj.node.id);
					while (formObj != null)
					{
						setNodeReadOnlyDisabled(formObj, obj.readOnly);
						instanceNum++;
						var nextListItem;
						if (obj.node.id.indexOf(ROW_SUFFIX) > 0)
							nextListItem = obj.node.id.substring(0, obj.node.id.indexOf(ROW_SUFFIX)) + '_' + instanceNum + obj.node.id.substring(obj.node.id.indexOf(ROW_SUFFIX));
						else
							nextListItem = obj.node.id + '_' + instanceNum;
						formObj = document.getElementById(nextListItem);
					}
				}
				else
				{
					var formObj = document.getElementById(obj.node.id);
					setNodeReadOnlyDisabled(formObj, obj.readOnly);
				}
			}	
		}
}


/************************************************************************
* Method: setNodeReadOnlyDisabled
* Description:  Switches the 'disabled html' display of a field on or off.
* 
**************************************************************************/
function setNodeReadOnlyDisabled(node, readOnly)
{
	if (readOnly)
	{
		node.disabled = true;
		node.readOnly = true;
	}
	else
	{
		node.disabled = false;
		node.readOnly = false;
	}
}

/************************************************************************
* Method: setDatePartReadOnlyText
* Description:  Switches the 'text' display of a field on or off for a date part
* 
**************************************************************************/

function setDatePartReadOnlyText(obj, dateObj, spanClass)
{
    if (obj.readOnly)
    {
        try
        {
            //Store 'editable' version of the field as we may need it later
            dateObj.copyOfOuterHTML = dateObj.outerHTML;
            //Get latest display value of field
            var displayText = getNodeRODisplayText(dateObj);
            //Replace editable field with span, class and display text
            var text = "<span class='" + spanClass + "'>" + displayText + "</span>"; 
            dateObj.outerHTML = text;
        }
        catch(ex)
        {
        }
    }
    else
    {
        //Switch div's inner html from text to editable display
        if (dateObj.copyOfOuterHTML != null && dateObj.copyOfOuterHTML.length > 0)
        {
            //Set div's inner html to the previously stored editable version of field
            dateObj.outerHTML = dateObj.copyOfOuterHTML;
            dateObj.copyOfOuterHTML = "";
        }
    }
}


/************************************************************************
* Method: setNodeReadOnlyText
* Description:  Switches the 'text' display of a field on or off.
* 
**************************************************************************/
function setNodeReadOnlyText(obj)
{
	//Get the outermost div for the field to be updated.  We're going to update its inner html with either an editable or a text version of the field.
	var divCell = getDivForNode(obj);
	if (divCell != null)
	{
		if (obj.readOnly)
		{
			//Switch div's inner html from editable to text display
			try
			{
    			//Get stylesheet class for form element
    			var formObj = document.getElementById(obj.node.id);
    			var spanClass = formObj.className;
    			if (spanClass == null || spanClass.length == 0)
    			{
    				spanClass = formObj.parentNode.className;
    			}
    			//Store 'editable' version of the field as we may need it later
    			obj.divInnerHTML = divCell.innerHTML;
    			//Get latest display value of field
    			obj.displayText = getNodeRODisplayText(formObj);
    			//Replace editable field with span, class and display text
    			var text = "<span class='" + spanClass + "'>" + obj.displayText + "</span>"; 
    			divCell.innerHTML = text;
			}
			catch(ex)
			{
			}
		}
		else
		{
			//Switch div's inner html from text to editable display
			if (obj.divInnerHTML != null && obj.divInnerHTML.length > 0)
			{
				//Set div's inner html to the previously stored editable version of field
				divCell.innerHTML = obj.divInnerHTML;
				obj.divInnerHTML = "";
			}
		}
	}
}

/************************************************************************
* Method: getDivForNode
* Description:  Returns the outermost div element for a field (the inner html of this div is toggled between editable and text-only displays)
* 
**************************************************************************/
function getDivForNode(obj)
{
	var divCell = obj.node;
	while (divCell){
		divCell = divCell.parentNode;
		if (divCell && divCell.id && divCell.id.indexOf("p4_") == 0)
			break;
	}
	
	if (divCell != null && divCell.nodeName != "div" && divCell.nodeName != "DIV" && divCell.childNodes.length > 0)
	{
		var cellId = divCell.id;
		divCell = document.getElementById(cellId).childNodes.item(0);
	}
	return divCell;
}

function isRowId(id)
{
	row = false;
	var i = id.indexOf(ROW_SUFFIX);
	if (i > 0)
	{
		var suffix = id.substring(i + 2);
		try
		{
			parseInt(suffix);
			row = true;
		}
		catch(ex)
		{
		}
	}
	return row;
}

/************************************************************************
* Method: fieldProcessed
* Description:  Checks whether a field has already been processed.
* 
**************************************************************************/
function fieldProcessed(arr, obj)
{
	var searchVal = "";
	var id = obj.node.id;
	if (isRowId(id))
	{
		searchVal = id;
	}
	else
	{
		searchVal = obj.baseId;
	}

	var found = false;
	
	for (var i=0; i < arr.length; i++)
	{
		if (arr[i] == searchVal)
		{
			found = true;
			break;
		}
	}
	return found;
}

/************************************************************************
* Method: updateDynamicMandatoryFields
* Description:  Determine whether the mandatory status of the phase, process or any questions on this page have been altered in a Set Process Item Status rule.
* 
**************************************************************************/
function updateDynamicMandatoryFields()
{
	var form = document.getElementById("form1");
    var page = parent.getCurrentProcessAndPhase();
	var process = parent.getCurrentProcess();
    var phase = page;
    var mandStateObj = null;
	var updatePhaseOrProcess = false;
	var processedIds = new Array();
	
	if ((mandStateObj = parent.questionMandatoryState["phase_" + phase]) != null)
	{
		updatePhaseOrProcess = true;
	}
	else if ((mandStateObj = parent.questionMandatoryState["process_" + process]) != null)
	{
		updatePhaseOrProcess = true;
	}
		
	for (var id in stateObjects)
	{
		var obj = stateObjects[id];
		if (obj.node.type == "hidden" || obj.node.type == "button" || obj.node.id.toUpperCase().indexOf(UNSELECT_LIST_PREFIX) == 0){
				continue;
		}
		if (obj.node.id && obj.node.id.length > 0)
		{
			//Check whether we've already processed this base id (we don't want to process each instance of a radio or checkbox group).
			if (! fieldProcessed(processedIds, obj))
			{
				if (! updatePhaseOrProcess)
				{	
					mandStateObj = null;
					//Has mandatory status of current field been changed?
					mandStateObj = parent.questionMandatoryState[obj.baseId];
					if (mandStateObj != null)
					{
						//Update 'master copy' of field with new mandatory status
						obj.mandatory = mandStateObj.state;
						obj.mandMessage = mandStateObj.mandMessage;
					}
					//Update field display
					updateMandQuestion(obj);
					delete parent.questionMandatoryState[obj.baseId];
				}
				else
				{
					//Mandatory status of current field's phase or process has been changed. 
					evalMandQuestion(obj,mandStateObj);
				}
				//Add baseId to array of processed ids so that we don't try to process it again.
				if (isRowId(obj.node.id))
					processedIds.push(obj.node.id);
				else
					processedIds.push(obj.baseId);
			}
	   }
	}
	if (updatePhaseOrProcess)
	{
		delete parent.questionMandatoryState["phase_" + phase];
		delete parent.questionMandatoryState["process_" + phase];
	}
}

/************************************************************************
* Method: evalMandQuestion
* Description:  Determine current mandatory status of a question.
* 
**************************************************************************/
function evalMandQuestion(obj,stateObj)
{
   	var mandatory = stateObj.state; //New mandatory state
	var currentlyMandatory = obj.mandatory; //Old mandatory state
	var ignoreMandatory = stateObj.ignoreCurrentState; //Whether to ignore old read-only state
	var mandMessage = stateObj.mandMessage; //New mandatory message
	mandatory = fieldIsMandatory(currentlyMandatory, mandatory, ignoreMandatory);
	//Update 'master copy' with latest read-only state.
	obj.mandatory = mandatory;
	obj.mandMessage = stateObj.mandMessage;
	updateMandQuestion(obj);
}

/************************************************************************
* Method: fieldIsMandatory
* Description:  Determine new mandatory state for field.  
* 
**************************************************************************/
function fieldIsMandatory(currentlyMand, newMand, ignoreCurrentMand)
{
	var mandatory;
	if (!newMand && currentlyMand && !ignoreCurrentMand)
		mandatory = false;
	else if (!newMand && !currentlyMand)
	{
		mandatory = false;
	}
	else
		mandatory = true;

	return mandatory;
}

/************************************************************************
* Method: updateMandQuestion
* Description:  Update mandatory status of question.  
* 
**************************************************************************/
function updateMandQuestion(obj)
{
	var colId = "";
	//alert(obj.node.id);
	if (isRowId(obj.node.id))
	{
		//Input is in a table.
		var colId = obj.node.id;
		colId = "p1_" + colId.substring(0,colId.indexOf(ROW_SUFFIX));
	}
	else
	{
		//Input not in a table!
		colId = "p2_" + obj.baseId;
	}
	
	//Get div node inside column header node.
	var colNode = document.getElementById(colId);
	if (colNode)
	{
		var mandNode;
		if (colNode.childNodes.length == 1)
		{
			mandNode = colNode.childNodes[0];
		}
		else
		{
			mandNode = colNode;
		}

		if (isRowId(obj.node.id))
		{
			if (mandNode.hasChildNodes()  && mandNode.lastChild.tagName && mandNode.lastChild.tagName.toUpperCase() == "SPAN")
			{
				mandNode = mandNode.lastChild;
			}
			else
			{
				//Create span node for displaying mandatory character
				var spanNode = document.createElement("SPAN");
				spanNode.setAttribute("class", "textMedium");
				mandNode.appendChild(spanNode);
				mandNode = spanNode;
			}
		}

		//Get outer div of input field
		var fieldNode = document.getElementById(obj.node.id);
		if (! fieldNode)
		{
			//obj.node.id probably references a list item whose value has just been reset.  Try getting the reset element's parent frameset instead.
			fieldNode = document.getElementById(FIELDSET_PREFIX + obj.node.id);
		}
		var outerDiv = getParentNode(fieldNode,"DIV");
			
		if (obj.mandatory)
		{
			//Display mandatory character and mandatory message
			var mandChar = getVariable('', "MANDCHAR");
			if (! mandChar)
			{
				mandChar = "*";
			}
			mandNode.innerHTML = mandChar;
			if	( outerDiv )
			{
				outerDiv.setAttribute('title', obj.mandMessage);
			}
		}
		else
		{
			//Remove any mandatory character and/or mandatory message
			mandNode.innerHTML = "&nbsp;";
			if	( outerDiv )
			{
				outerDiv.setAttribute('title', '');
			}
		}
	}
    else
    {
        var fieldNode = document.getElementById(obj.node.id);
        if (! fieldNode)
        {
            //obj.node.id probably references a list item whose value has just been reset.  Try getting the reset element's parent frameset instead.
            fieldNode = document.getElementById(FIELDSET_PREFIX + obj.node.id);
        }
		if (fieldNode)
		{
			var outerDiv = getParentNode(fieldNode,"DIV");
			if  ( outerDiv )
			{
				if (obj.mandatory)
				{
					outerDiv.setAttribute('title', obj.mandMessage);
				}
				else
				{
					outerDiv.setAttribute('title', '');
				}
			}
		}
    }
}

/************************************************************************
* Method: getOriginalCheckboxValue
* Description:  Gets the original pipe-separated list of values for a single checkbox (as opposed to getElementValue() which returns either the first or second of the pipe-separated values, depending upon whether the checkbox is checked).
* 
**************************************************************************/
function getOriginalCheckboxValue(comp, namespace){
 if (namespace  == null) namespace = "";

 if (comp.type == "checkbox"){
   var v = ""; var selected = 0;
   var p0 = comp.parentNode.parentNode.getElementsByTagName("input");

   //if (p0.length == 2 || p0.length == 3){// a single checkbox with associated hidden input - hidden always returned to server even if checkbox unchecked!
    var str = "";
    str = p0[0].value;
	return str;
   //}
 } 
}

/************************************************************************
* Method: getSingleCheckboxGroupValue
* Description:  Gets pipe-separated list of group values for a single checkbox and returns the appropriate value, depending upon the checkbox option selected.
* 
**************************************************************************/
function getSingleCheckboxGroupValue(comp, namespace){
 if (namespace  == null) namespace = "";

 if (comp.type == "checkbox"){
    var p0 = comp.parentNode.parentNode.getElementsByTagName("input");
   
   if (p0.length == 3){// a single checkbox with associated hidden input
   var allOpts = comp.alt;
	var str = "";
    if (p0[0].checked) str = allOpts.substring(0,allOpts.indexOf("|"));
    else str = allOpts.substring(allOpts.indexOf("|")+1);
    return str;	
   }
 } 
}

/************************************************************************
* Method: findDeepestNode
* Description:  Find the node at the bottom of the tree  
* 
**************************************************************************/

function findDeepestNode(firstNode)
{
	var thisNode = firstNode;
	var i = 0;
	while (thisNode.hasChildNodes() && thisNode.childNodes[0].tagName != null)
	{
		var match = false;
		for (i = 0; i < thisNode.childNodes.length ; i++)
		{
			if ((thisNode.childNodes[i].tagName != null) && (thisNode.childNodes[i].tagName.toLowerCase() != 'legend'))
			{
				match = true;
				break;
			}
		}
		if (match)
		{
			thisNode = thisNode.childNodes[i];
		}
	}
	return thisNode;
}

function resetDynamicListValues(p_dynamicListValues)
{
	var resetList = false;
	for (var i = (p_dynamicListValues.length - 1); i >= 0; i--)
	{
		if (resetList)
		{
			p_dynamicListValues.splice(i,1);
		}
		else
		{
			var listValue = p_dynamicListValues[i];
			if (listValue.resetList)
			{
				resetList = true;
			}
		}
	}
}

function removeListItems(p_listNode)
{
	var child;
	for (var i=(p_listNode.childNodes.length - 1); i >= 0; i--)
	{
		child = p_listNode.childNodes[i];
		p_listNode.removeChild(child);
	}
}

function resetStaticListValues(p_staticListValues, p_listName)
{
	resetList = false;
	for (var i = 0; i < p_staticListValues.length; i++)
	{
		var listValue = p_staticListValues[i];
		if (listValue.resetList)
		{
			resetList = true;
			break;
		}
	}
	if (resetList)
	{
		var listElements = new Array();
		var els = document.all ? document.all : document.getElementsByTagName('*');
		for (var i = 0; i < els.length; i++ )
		{
			if (els[i].listname && els[i].listname.length > 0 && els[i].listname.toUpperCase() == p_listName)
			{
				listElements.push(els[i]);
			}
		}
		for (var i = 0; i < listElements.length; i++ )
		{
			var list = listElements[i];
			var listType = list.type;
			if (! listType)
				listType = list.listtype;
			
			if (listType)
			{
				listType = listType.toUpperCase();

				if (listType == "RADIO" || listType == "CHECKBOX")
				{
					removeListItems(list);
				}
				else if (listType == "SELECT-ONE" || listType == "SELECT-MULTIPLE")
				{
					for (var j=(list.options.length - 1); j >= 0; j--)
					{
						if (list[j].value)
						{
							list.remove(j);
						}						
					}
				}
			}
		}
	}
}

/************************************************************************
* Method: updateDynamicLists
* Description:  This method adds dynamic list values to any lists (drop downs,
*				radios or checkboxes).  
* 
**************************************************************************/

function addElement(div, type, elements){
 var els = div.getElementsByTagName(type);
 for(var i = 0; i < els.length; i++)  elements[elements.length] = els[i];
}

function updateDynamicLists(){
	var listElements = new Array();
	var els = new Array();
	addElement(document, "select", els);
	addElement(document, "fieldset", els);
	for (var i = 0; i < els.length; i++ ){
		if (els[i].listname != null && els[i].listname.length > 0){
			listElements.push(els[i]);
		}
	}

	for (var j = 0; j < listElements.length ;  j++)
	{
		var comp = listElements[j];
		var type = comp.type;
		if (type == null)
		{
			type = comp.listtype;
			if (type == null)
			{
				type = "radio";
			}
			else
			{
				type = type.toLowerCase();
			}
		}
		var totalList = new Array();
		//For a transferable list, we'd only want to add the new list item to the 'un-selected' list, not the 'selected' one.
		if (comp.name && comp.name.indexOf(SELECT_LIST_PREFIX) == 0)
		{
			//do nothing
		}
		else if (comp.name && comp.name.indexOf(UNSELECT_LIST_PREFIX) == 0)
		{//For transferable lists, extract data item name from component name and check in session for any list values associated with it.
			var diName = comp.name.substring(UNSELECT_LIST_PREFIX.length);
			diName = processName(diName);
			var listKey = (comp.listname).toUpperCase();
			var staticListValues = parent.getSessionListValues(listKey);
			//If necessary, reset static options in the list.
			resetStaticListValues(staticListValues, listKey);
			var listValues = parent.getSessionListValues(diName);
			totalList = staticListValues.concat(listValues);
		}		
		else
		{
			var listKey = (comp.listname).toUpperCase();
			var staticListValues = parent.getSessionListValues(listKey);
			//If necessary, reset static options in the list.
			resetStaticListValues(staticListValues, listKey);
			var diName = comp.name;
			if (diName != null && diName.length > 0)
			{
				diName = processName(diName);
				var listValues = parent.getSessionListValues(diName);
				totalList = staticListValues.concat(listValues);
			}
		}
		//If necessary, reset previous dynamic options in the list.
		resetDynamicListValues(totalList);
		var amountToMoveOn = 0;
		if (type.indexOf("select") == 0 && comp.name.indexOf(SELECT_LIST_PREFIX) != 0)
		{
			var numOptions = 0;
			for (var i=0; i < comp.options.length;i++ )
			{
				if (comp.options[i].id != null)
					numOptions++;
			}
			for (var i = 0; i < totalList.length ; i++)
			{
				var listValue = totalList[i];
				var option	= document.createElement("OPTION");
				var text	= document.createTextNode(tokenReplace(listValue.value));
				option.setAttribute("value", tokenReplace(listValue.key));
				var optionID = tokenReplace(listValue.groupValue) + "__" + comp.id + "_" + numOptions;
				option.setAttribute("id", optionID);
				option.appendChild(text);
				comp.appendChild(option);
			}
		}
		else if (type == "radio" || type == "checkbox")
		{
			var numOptions = -1;
			for (var i=0; i < comp.childNodes.length;i++ )
			{
				if (comp.childNodes[i].id != null)
					numOptions++;
			}
			for (var i = 0; i < totalList.length ; i++)
			{
				var listValue = totalList[i];
				var optionID = comp.id + "_" + numOptions;
				var newRadio = document.createElement("<INPUT TYPE='" + type + "' ID='" +optionID +"' NAME='" +comp.name +"' VALUE='" +tokenReplace(listValue.key) + "' ALT='"+tokenReplace(listValue.groupValue)+"'>"); 
				var newLabel = document.createElement("<LABEL FOR='" + optionID + "'>");
				var newText	 = document.createTextNode(tokenReplace(listValue.value));
				var newSpan = document.createElement("<SPAN>");
				newLabel.appendChild(newText);
				newSpan.appendChild(newRadio);
				newSpan.appendChild(newLabel);
				comp.appendChild(newSpan);
				
				if (comp.liststyle == "Vertical")
				{
					comp.appendChild(document.createElement("<br>"));
				}
			}
		}
	}
}

/************************************************************************
* Method: setFieldValue
* Description:  Sets the value of a field (selected item for list or radio,
*               or just text for text types or text areas...
* 
**************************************************************************/
function setFieldValue(cell, val)
{
	var cellName = cell.name;
	if (cellName == null)
	{
		cellName = "";
	}
	else
	{
		cellName = cellName.toUpperCase();
	}

    if (cell.tagName == "textarea" || cell.type == "text" || cell.tagName == "TEXTAREA" || cell.type == "TEXT")
    {
        cell.value = val;
    }
	else if (cell.tagName == "select" || cell.tagName == "SELECT")
    {
        var opts = cell.options;
		var valueArray = val.split("|");
        for (var i = 0; i < opts.length ; i++ )
        {
            opts[i].selected = false;
            for (var j=0; j < valueArray.length; j++ )
            {
            	if	( opts[i].value == valueArray[j] )
            	{
            		opts[i].selected = true;
            		break;
            	}
            }
        }
    }
    else if (isRadio(cell) && cell.name.length > 0)
    {
        var radios = document.getElementsByName(cell.name);
        for (var i = 0; i < radios.length ; i++ )
        {
            if (radios[i].value == val)
            {
                radios[i].checked = true;
                return;
            }
        }
    }
    else if (isCheckBox(cell) && cell.name.length > 0)
    {
       	var checkBoxes = new Array(), checkBoxes2;
		checkBoxes = document.getElementsByName(cell.name);
		var valueArray = val.split("|");
		if (checkBoxes.length == 1)//Handle single checkbox case
		{
			var allOpts = getOriginalCheckboxValue(cell);
			if (val == allOpts.substring(0,allOpts.indexOf("|"))) //If value matches first item in pipe-separated list, check the checkbox
			{
				checkBoxes[0].checked = true;
				return;
			}
		}
		else
		{
			for (var i = 0; i < checkBoxes.length ; i++ )
			{
				checkBoxes[i].checked = false;
				for (var j=0; j < valueArray.length; j++ )
				{
					if	( checkBoxes[i].value == valueArray[j] )
					{
						checkBoxes[i].checked = true;
						break;
					}
				}
			}
		}
	}
}

/************************************************************************
* Method: selectTransferableListValues
* Description:  Highlights the 'selected' values in the 'unselected' transferable list (later these
* will be moved to the 'selected' list.
**************************************************************************/
function selectTransferableListValues(cell, val)
{
	//We have a session value so de-select any default values then select the sessioned values.
	if (val && val.length > 0)
	{		
		var selOptions = val.split("|");
		for (var i=0; i < cell.length; i++)
		{
			cell.options[i].selected = false;
		}
		for (var i=0; i < cell.length; i++)
		{
			for (i2=0; i2 < selOptions.length ; i2++ )
			{
				if (cell.options[i].value == selOptions[i2])
				{
					cell.options[i].selected = true;
					break;
				}
			}	
		}
	}
}


/************************************************************************
* Method: lookupListValue
* Description:  Returns either the label or group value (depending upon p_function) of a given value (p_value) from a given list (p_listName).
* 
**************************************************************************/
function lookupListValue(p_propName, p_listName, p_value, p_function)
{
	p_propName = processName(p_propName);
	if (p_listName && p_listName.length > 0)
	{
		p_listName = p_listName.toUpperCase();
		var pageListValues = parent.getListDictionaryValues(p_listName);
		var staticListValues = parent.getSessionListValues(p_listName);
		var dynamicListValues = parent.getSessionListValues(p_propName);
		var totalList = pageListValues.concat(staticListValues);
		totalList = totalList.concat(dynamicListValues);

		var option; var rtnVal;
		for (var i=0; i < totalList.length; i++)
		{
			option = totalList[i];
			if (option.key == p_value)
			{
				if (p_function == VALUE_FN)
				{
					return option.value;
				}
				else if (p_function == GROUP_VALUE_FN)
				{
					return option.groupValue;
				}
			}
		}
	}
	return p_value;
}

/************************************************************************
* Method: getListValue
* Description:  Returns either the label or group value (depending upon p_function), of a given value (p_value) from a given list (p_listName).
*				If function values are required for a concatenated list of values, the function values returned will contain corresponding concatenated lists. 
* 
**************************************************************************/
function getListValue(p_propName, p_listName, p_value, p_function)
{
	var valueArray = splitstring(p_value, "|", false);
	var listValues = "";
	for (var i=0; i < valueArray.length; i++)
	{
		if (i > 0)
			listValues += "|";

		listValues += lookupListValue(p_propName, p_listName, valueArray[i], p_function);
	}
	return listValues;
}

/************************************************************************
* Method: updateListFunctionValues
* Description:  Writes to session the label and group value of the list item, p_value.
* 
**************************************************************************/
function updateListFunctionValues(p_propName, p_listName, p_value, p_isDefaultValue)
{
	var label = getListValue(p_propName, p_listName, p_value, VALUE_FN);
	if (label && label.length > 0)
	{
		setSessionValueForPresentation(p_propName + VALUE_FN, label, p_isDefaultValue);
	}
	var groupValue = getListValue(p_propName, p_listName, p_value, GROUP_VALUE_FN);
	if (groupValue && groupValue.length > 0)
	{
		setSessionValueForPresentation(p_propName + GROUP_VALUE_FN, groupValue, p_isDefaultValue);
	}
}

/************************************************************************
* Method: updateUserValues
* Description:  This gets called before the postphase rules are run.  It 
                updates the dictionary with the values in the form.
* 
**************************************************************************/
function updateUserValues()
{
	var form = document.getElementById("form1");
    var cells = form.elements;
	var val;
    for (var i=0; i < cells.length ; i++)
    {
		var cellName = cells[i].name;
		if (cellName == null)
		{
			cellName = "";
		}
		else
		{
			cellName = cellName.toUpperCase();
		}

        if ( cells[i].disabled || cells[i].type == "hidden" || cells[i].type == "button" || (cellName.indexOf(UNSELECT_LIST_PREFIX) == 0)){
            continue;
        }
		else if (isHidden(cells[i])) {
			continue;
		}
		else if (cellName.indexOf(SELECT_LIST_PREFIX) == 0)
		{
			var hiddenName = cellName.substring(SELECT_LIST_PREFIX.length);
			var hidden = document.getElementById(hiddenName);
			val = hidden.value;
			
			if (val)
			{
				setSessionValueForPresentation(hiddenName, val);
			}
		}
		else if (cellName.indexOf(SINGLE_CHECKBOX_PREFIX) == 0)
		{
			//Set hidden with checkbox value
			val = getElementValue(cells[i]); 
			var name = cellName.substring(1);				
			if (val != null && name != null)
			{
				setSessionValueForPresentation(name, val);
			}
		}		
		else
		{
			if (cells[i].name != null)
			{
				val = getElementValue(cells[i]);
				var name = cells[i].name;
				if (val != null)
				{
					setSessionValueForPresentation(name, val);
				}
	        }
		}
    }
}

/************************************************************************
* Method: processName
* Description:  This does the same as the server version of the method, 
*               although the uppercasing and space removal is assumed to
*               have been done.  It replaces any [C] instances with the 
*               correct instance.
* 
**************************************************************************/
function processName(name)
{
    name = name.toUpperCase();
    name = trim(name);
    while (name.indexOf(" ") >= 0)
    {
        name = name.substring(0, name.indexOf(" ")) + name.substring(name.indexOf(" ") + 1);
    }
    if (name.indexOf("[C]") >= 0)
    {
        var groupName = name.substring(0, name.indexOf("[C]"));
        var instance = parent.dataGroupInstances[groupName];
        if (instance == null || instance=="undefined" || instance == "0")
        {
            instance = "1";
            parent.dataGroupInstances[groupName] = "1";
			parent.dataGroupInstancesValid[groupName] = false; // indicate that 1 has been set as a default - incrementor does not increment an invalid 1, but
															   // rather sets instance to 1 and makes it valid;
        }
        name = groupName + "[" + instance + "]" + name.substring(name.indexOf("[C]") + 3);
    }
    if (name.indexOf("[C]") >=0)
    {
        name = processName(name);
    }
    return name;
}

/************************************************************************
* Method: getMaxInstances
* Description:  Obtains the max instance for the specified data group. Defaults to 1 if not found.
* Parameters: 
*       p_name   - Processed data group (without ending subscript).
**************************************************************************/
function getMaxInstances(p_name)
{
    var maxInstances = parent.dataGroupMaxInstances[p_name];

    if (maxInstances == null || maxInstances=="undefined" || maxInstances == "0")
    {
        var subsOne = changeSubsToOne(p_name);
        maxInstances = parent.dataGroupMaxInstances[subsOne];
        if (maxInstances == null || maxInstances=="undefined" || maxInstances == "0")
        {
            maxInstances = "1";
        }
        parent.dataGroupMaxInstances[p_name] = maxInstances;
    }
    return(maxInstances);
}

/************************************************************************
* Method: changeSubsToOne
* Description:  Changes all the subscripts to [1] for the specified name
* Parameters: 
*       p_name   - Name to perform substitution
* Return: Processed name
**************************************************************************/
function changeSubsToOne(p_name)
{
    var name = p_name.replace(MATCH_ALL_SUBSCRIPTS, "[1]");   
    return name;
}

/************************************************************************
* Method: processPGName
* Description:  This makes sure there is no [] at the end of the name, and
*               then just calls processname on the result...
* 
**************************************************************************/
function processPGName(name)
{
    if (name.charAt(name.length - 1) == "]")
    {
		var i = name.lastIndexOf("[");
        name = name.substring(0, i)
    }
    return processName(name);
}

function getFormTableElement(p_innerElement)
{
	var table =  getParentNode(p_innerElement, 'table');
	while (table != null)
	{
		if (table.id && table.id.indexOf("TBL_") == 0) {
			break;
		}
		else {
			table =  getParentNode(table, 'table');
		}
	}
	return table
}
/************************************************************************
* Method: checkHiddenOffline
* Description:  This takes a string name, and checks if any $$ values need
*               replacing.  If it does, it looks up the token and replaces 
*               it with the session dictionary value.
* 
**************************************************************************/
function checkHiddenOffline(questions, expr, keepColumnHeadings, saveData, naType, ns, controllerName, triggerComp)
{
	if (doUpdateUserValues)
	{
	    updateUserValues();
	}
	var trigId = "";
	if (triggerComp.id) trigId = triggerComp.id;

	var backup = new Array();
	for (var name in parent.dataGroupInstances)
	{
		backup[name] = parent.dataGroupInstances[name];
	}
	

	var qArray = splitstring(questions, "^", false);
	var exprArray = splitstring(expr, "^", false);
	var keepHeadingArray = splitstring(keepColumnHeadings, "^", false);
	var saveDataArray = splitstring(saveData, "^", false);
	var naTypeArray = splitstring(naType, "^", false);
	for (var i = 0; i < exprArray.length ; i++ )
	{
		//see if there is a row part...
		var rowPart = getRowPart(qArray[i]);
		if(rowPart.length > 0)
		{
			var el = document.getElementById(qArray[i]);
			if (el)
			{
				var table = getFormTableElement(el);
				if (table)
				{
					setDataGroupInstance(attributes[table.id].DataGroupsToIncrement, rowPart);
				}
			}
		}
		var exp = tokenReplace(exprArray[i], true/*quote*/, false/*format*/, false/*formatDate*/, true/*checkDefaultValues*/);
		exp = exp.replace(/ OR /g, " || ");
		exp = exp.replace(/ AND /g, " && ");
		checkHidden(qArray[i], exp, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, "");
	}

	for (var name in backup)
	{
		parent.dataGroupInstances[name] = backup[name];
	}

	//if page is in initialisation, then we may need to hide row again...
	if (!doUpdateUserValues){
		var elem = document.getElementById(questions);
		if (elem != null){
			var table = getParentNode(elem, 'table');
			if (table != null)	{
				updateHiddenRowsInTable(table);
			}
		}
	}



}

/************************************************************************
* Method: tokenReplace
* Description:  This takes a string name, and checks if any $$ values need
*               replacing.  If it does, it looks up the token and replaces 
*               it with the session dictionary value.
*
*               The second paramenter indicates whether the any $$ replacements 
*               should have quotes around them.  
*
*				The third parameter indicates whether presentation-level formatting should be applied to the replaced value (assuming it's a data item).
* 
**************************************************************************/
function tokenReplace(name, quote, formatForPresentation, formatDate,checkDefaultValues)
{
	if (! formatForPresentation)
		formatForPresentation = false;
	if (!formatDate)
		formatDate = false;
	if (!checkDefaultValues)
		checkDefaultValues = false;

	var propType = "";//
	while (true && name)
    {
    	var token = null;
    	var start = name.indexOf("$$!");
    	if (start >= 0)
    	{
    		var end = name.indexOf("$", start+2);
	        if (end >= 4)
	        {
	        	token = name.substring(start+3, end);
				tokVal = tokenReplaceVariable(token);
	        }
	        else
	        {
	            break;
	        }
    	}
    	else
    	{
	        start = name.indexOf("$$");
			var start2 = name.indexOf("$%");
	        if (start >= 0)
	        {
	            var end = name.indexOf("$", start+2);
	            if (end >= 3)
	            {
	                token = name.substring(start+2, end);
					if (formatForPresentation)
					{
						tokVal = getSessionValueForPresentation(token);
					}
					else
					{
						tokVal = getSessionValue(token, false /*format*/, checkDefaultValues);
					}

					var propKey = processName(token);
					propType = getPropertyAttribute(propKey,parent.DATA_TYPE_KEY);
					if (propType == "Date")
					{
						//see what parts are there...
						var parts = trim(name.substring(end + 1)).split(" ");
						if (tokVal && tokVal != "" && parts.length == 3)
						{
							name = rollDate(propKey, tokVal, parts[1], parts[0], parts[2]);
							tokVal = null;
							break;
						}
						else if (formatDate)
						{
							tokVal = getSessionValue(token + ".YEAR()") + getSessionValue(token + ".MONTH()") + getSessionValue(token + ".DAY()");
						}
						
					}

	            }
	            else
	            {
	                break;
	            }
	        }
			else if (start2 > 0)
			{
				name = name.substring(0, start2) + name.substring(name.lastIndexOf("$") + 1);
			}
	        else
	        {
	            break;
	        }
	    }
	    if (token != null && tokVal != null)
	    {
            var doQuote = quote;
            if ( doQuote )
            {
                try
                {
                    tokVal = "" + tokVal;
                    //doQuote = ( tokVal != "" && ( tokVal == "0" || ( tokVal.indexOf("0") != 0 && isDouble(tokVal) ) ) )? false : quote;
                    doQuote = (tokVal != "" && (propType == "Number" || propType == "Decimal")) ? false : quote;
                } 
                catch(ex)
                {
                    doQuote = quote;
                }
            }
            
	        if (doQuote)
	        {
				//check to see if there are quotes already...
				if (name.charAt(start-1) == "\"" || name.charAt(start-1) == "'")
				{
		            name = name.substring(0, start) + tokVal + name.substring(end+1);
				}
				else
				{
		            name = name.substring(0, start) + "'" + tokVal + "'" + name.substring(end+1);
				}
	        }
	        else
	        {
	            name = name.substring(0, start) + tokVal + name.substring(end+1);
	        }

			
	       //alert("Name = " + name);
	    }
    }

    return name;
}

/************************************************************************
* Method: tokenReplaceVariable
* Description:  Looks up the value for the variable name in the session variables. If not found, checks the global variables.
**************************************************************************/
function tokenReplaceVariable(token)
{
	var tokVal = getSessionVariable(token);
	if (tokVal == null || tokVal.length == 0)
	{
		tokVal = getGlobalVariable(token);
	}
	if (tokVal == null || tokVal.length == 0)
	{
		tokVal = "";
	}
	if (tokVal.length > 0)
    {
	    if (tokVal.indexOf("$$") == 0)
		{
			tokVal = tokenReplace(tokVal);
		}
	}
	return tokVal;
}

/************************************************************************
* Method: lookupDateTimeSystemWords
* Description:  Lookup values for date-time system words from session and perform any manipulation required, for example adding 2 days to (SYSDAY + 2).
* 
**************************************************************************/
function lookupDateTimeSystemWords(val)
{
	var returnVal = 0, token, operatorType, numberOfUnits, dateField;
	var strTok = val.split(" ");
	var numberOfTokens = strTok.length;

	if (numberOfTokens == 3 && (val.indexOf(SW_SYSYEAR) > -1 || val.indexOf(SW_SYSMONTH) > -1 || val.indexOf(SW_SYSDAY) > -1 || val.indexOf(SW_SYSHOUR_OF_DAY) > -1 || val.indexOf(SW_SYSHOUR) > -1 || val.indexOf(SW_SYSMINUTE) > -1 || val.indexOf(SW_SYSSECOND) > -1 || val.indexOf(SW_SYSAM_PM) > -1))
	{
		token = strTok[0];
		operatorType = strTok[1];
		numberOfUnits = strTok[2];
		returnVal = parent.sessionDictionary[token];
			
		if (returnVal != null)
		{
			//This is what online does when it adds to/subtracts from SYSAM_PM!
			if (token.indexOf(SW_SYSAM_PM) > -1)
			{
				if ("AM" == returnVal)
					returnVal = "0";
				else
					returnVal = "1";	
			}
										
			returnVal = parseInt(returnVal);
			numberOfUnits = parseInt(numberOfUnits);
				
			if (operatorType == "-")
				returnVal = (returnVal * 1);
				
			returnVal = (returnVal + numberOfUnits);
			returnVal = formatDigits("" + returnVal);
			return returnVal;
		}
	}
	else if (numberOfTokens == 4 && (val.indexOf(SW_SYSDATE) > -1 || val.indexOf(SW_SYSDATETIME) > -1 || val.indexOf(SW_SYSTIME) > -1))
	{
		token = strTok[0];
		operatorType = strTok[1];
		numberOfUnits = strTok[2];
		dateField = strTok[3].toUpperCase();

		if (operatorType == "-")
			operatorType = "Decrement";
		else
			operatorType = "Increment";

		if (dateField.indexOf("DAY") == 0)
			dateField = DAY_FN;
		else if (dateField.indexOf("MONTH") == 0)
			dateField = MONTH_FN;
		else if (dateField.indexOf("YEAR") == 0)
			dateField = YEAR_FN;
		else if (dateField.indexOf("HOUR") == 0)
			dateField = HOUR_FN;
		else if (dateField.indexOf("MINUTE") == 0)
			dateField = MINUTE_FN;
		else if (dateField.indexOf("SECOND") == 0)
			dateField = SECOND_FN;

		var sysdate = parent.sessionDictionary[SW_SYSDATETIME];
		var returnVal = rollDate(token, sysdate, numberOfUnits, operatorType, dateField);		
		return returnVal;
	}
	else
	{
		returnVal = parent.sessionDictionary[val];
		return returnVal;
	}
}

/************************************************************************
* Method: rollDate
* Description:  Gets current value for propName, rolls the date forward or back the number of days specified by 'amount' and returns the result as a formatted string value.
* 
**************************************************************************/
function rollDate(propName, val, amount, direction, dateUnit)
{
	var dateOrder = DEFAULT_DATETIME_ORDER;
	var separators = DEFAULT_SEPARATOR_ORDER;
	if (val.indexOf(":") < 0)
	{
		dateOrder = DEFAULT_DATE_ORDER;
		separators = DEFAULT_DATE_SEP_ORDER;
	}

	var parts = splitDateTimeIntoParts(propName, val, dateOrder, separators);
	
	var year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;
	//Get the date parts

	//NB: Javascript bug occurs when calling parseInt("08")or parseInt("09").  A zero is returned because the leading '0' tells the browser this is a base-8 number so 8 or 9 wouldn't be valid.
	//Workaround is to call parseInt("08", 10) with the second argument indicating that this is a base-10 number - see below.
	if (parseInt(parts[YEAR_FN], 10))
		year = parseInt(parts[YEAR_FN], 10);
	if (parseInt(parts[MONTH_FN], 10))
		month = parseInt(parts[MONTH_FN] - 1, 10);
	if (parseInt(parts[DAY_FN], 10))
		day = parseInt(parts[DAY_FN], 10);
	if (parseInt(parts[HOUR_FN], 10))
		hour = parseInt(parts[HOUR_FN], 10);
	if (parseInt(parts[MINUTE_FN], 10))
		minute = parseInt(parts[MINUTE_FN], 10);
	if (parseInt(parts[SECOND_FN], 10))
		second = parseInt(parts[SECOND_FN], 10);
	
	//Convert date parts into date object
	var dtObj = new Date(year,month,day,hour,minute,second);

	//Get amount by which to increment/decrement value
	var intAmount = parseInt(amount, 10);
	if (direction == "Decrement" || direction == "-")
		intAmount = (intAmount * -1);

	//Increment the appropriate part of the date
	if ((dateUnit == DAY_FN || DAYS_PART.indexOf(dateUnit) >= 0) && (! propName.indexOf(SW_SYSTIME) > -1))
		dtObj.setDate(dtObj.getDate() +  intAmount);
	else if ((dateUnit == MONTH_FN || MONTHS_PART.indexOf(dateUnit) >= 0) && (! propName.indexOf(SW_SYSTIME) > -1))
		dtObj.setMonth(dtObj.getMonth() +  intAmount);
	else if ((dateUnit == YEAR_FN || YEARS_PART.indexOf(dateUnit) >= 0) && (! propName.indexOf(SW_SYSTIME) > -1))
		dtObj.setYear(dtObj.getYear() +  intAmount);
	else if (dateUnit == HOUR_FN || HOURS_PART.indexOf(dateUnit) >= 0)
		dtObj.setHours(dtObj.getHours() +  intAmount);
	else if (dateUnit == MINUTE_FN || MINUTES_PART.indexOf(dateUnit) >= 0)
		dtObj.setMinutes(dtObj.getMinutes() +  intAmount);
	else if (dateUnit == SECOND_FN ||SECONDS_PART.indexOf(dateUnit) >= 0)
		dtObj.setSeconds(dtObj.getSeconds() +  intAmount);
	
	//Put date object back into parts array
	parts[DAY_FN] = formatDigits(dtObj.getDate());
	parts[MONTH_FN] = formatDigits(dtObj.getMonth() + 1);
	parts[YEAR_FN] = dtObj.getYear();
	parts[HOUR_FN] = formatDigits(dtObj.getHours());
	parts[MINUTE_FN] = formatDigits(dtObj.getMinutes());
	parts[SECOND_FN] = formatDigits(dtObj.getSeconds());

	//If a system word has been incremented the result should be formatted to match the original format 
	if (propName.indexOf(SW_SYSDATETIME) > -1)
	{
		dateOrder = DEFAULT_DATETIME_ORDER;
		separators = DEFAULT_SEPARATOR_ORDER;
	}
	else if (propName.indexOf(SW_SYSDATE) > -1)
	{
		dateOrder = DEFAULT_DATE_ORDER;
		separators = DEFAULT_DATE_SEP_ORDER;
	}
	else if (propName.indexOf(SW_SYSTIME) > -1)
	{
		dateOrder = DEFAULT_TIME_ORDER;
		separators = DEFAULT_TIME_SEP_ORDER;
	}

	//Format new parts array into string
	var formattedDate = getFormattedDateTimeString(parts, dateOrder, separators, "00");
	return formattedDate;
}

/************************************************************************
* Method: lookupFunctionValues
* Description:  Look up values for data item functions such as .value() or .instance()
* 
**************************************************************************/
function lookupFunctionValues(token,formatForPresentation)
{
	var tokVal = "";
	if (isDatePartFunctionName(token))
	{
		var i = token.lastIndexOf(".");
		var prop = token.substring(0,i);
		tokVal = parent.sessionDictionary[prop];
		tokVal = formatValue(token,tokVal,formatForPresentation);
	}
	else if (token.indexOf("()") == token.length - 2)
	{
		var funcStart = token.lastIndexOf(".");
		var func = getFunctionName(token, false).toUpperCase();
		token = token.substring(0,funcStart).toUpperCase();
		
		if (func == VALUE_FN || func == GROUP_VALUE_FN)
		{
			var key = processName(token) + func;
			tokVal = parent.sessionDictionary[key];
		}
		else
		{
			var groupName = processPGName(token);
			if (func == INSTANCE_FN)
			{
				tokVal = parent.dataGroupInstances[groupName];
			}
			else if (func == MAX_INSTANCE_FN)
			{
				tokVal = parent.dataGroupMaxInstances[groupName];
			}
			else if (func == LAST_INSTANCE_FN)
			{
				tokVal = getLastInstance(groupName);
			}
		}
	}
	if (tokVal == null)
	{
		tokVal = "";
	}
	return tokVal;
}

function getLastInstance(propertyGroupName)
{
     //var groupName = propertyGroupName.toUpperCase();
	var groupName = processName(propertyGroupName);
	//Need to find highest populated instance of this group in sessionDictionary.
	var maxPopulated = 0;
	var stopInd=-1; var tmp; var tmp2;
	for (var di in parent.sessionDictionary)
	{
		//if session data item name starts with the data group name...
		if (di.toUpperCase().indexOf(groupName) == 0)
		{
			tmp = di.substring(groupName.length);
			if (tmp.indexOf("[") == 0 && tmp.indexOf("]") > 0)
			{
				stopInd = tmp.indexOf("]");
				//get data group instance number in session...
				tmp2 = tmp.substring(1,stopInd);
				//if instance number is higher than current highest instance number...
				if (parseInt(tmp2) > maxPopulated)
				{
					//replace current with new number
					maxPopulated = parseInt(tmp2);
				}
			}
		}
	}
	return maxPopulated;    
}

/************************************************************************
* Method: getFunctionName
* Description:  Returns the function part of the value 'propName', i.e. returns '.value()' for propName 'my_value[1].value()'.
* If removeBrackets is true, returns '.value'. 
* 
**************************************************************************/
function getFunctionName(propName, removeBrackets)
{
	var part = "";
	if (propName.indexOf("()") == propName.length - 2)
	{
		var i = propName.lastIndexOf(".");
		var j;
		if (removeBrackets)
			 j = propName.lastIndexOf("(");
		else
			j = propName.length;

		part = propName.substring(i,j);
	}
	return part;
}

/************************************************************************
* Method: getBasePropertyName
* Description:  Returns the property name part of the value 'propName', i.e. returns 'my_value[1]' for propName 'my_value[1].value()'.
* 
**************************************************************************/
function getBasePropertyName(propName)
{
	var prop;
	if (propName && propName.length > 0)
	{
		if (propName.indexOf("()") == propName.length - 2)
			prop = propName.substring(0,propName.lastIndexOf("."));
		else
			prop = propName;
	}
	else
		prop = "";

	return prop;
}

/************************************************************************
* Method: getSessionValueForPresentation
* Description:  Gets the session value for propName with presentation formatting applied.
* 
**************************************************************************/
function getSessionValueForPresentation(propName)
{
	return getSessionValue(propName,true);
}

/************************************************************************
* Method: getSessionValue
* Description:  This processes the name of the property, and looks up and 
*               returns the value in the session dictionary.  formatForPresentation
*				determines whether presentation formatting is applied to the value.
* 
**************************************************************************/
function getSessionValue(propName,formatForPresentation, checkDefaultValues)
{  
	if (propName)
	{
		if (formatForPresentation == null)
		{
			formatForPresentation = false;
		}	
		
		var val;
		if (propName.indexOf("SYS") > -1)
		{
			val = lookupDateTimeSystemWords(propName);
		}
        else if (propName.indexOf("()") > 0 && propName.indexOf("()") == propName.length - 2)
		{
			propName = processName(propName);
			val = lookupFunctionValues(propName,formatForPresentation);
		}
		else
		{
			propName = processName(propName);
			val = parent.sessionDictionary[propName];
			if (checkDefaultValues && (val == null || val == ""))
			{
				//defaults are stored in put array, but not session dictionary...
				val = get(propName);
			}

		    if (val && val.length > 0)
		    {
			    if (val.indexOf("$$") == 0)
				{
					val = tokenReplace(val);
				}
				else
				{
					val = formatValue(propName,val,formatForPresentation);
				}
			}
			else if (val)
				val = formatValue(propName,val,formatForPresentation);
			else
				val = "";
		}
		return val;
	}
	else
		return "";
}

/************************************************************************
* Method: setSessionValueForPresentation
* Description:  This processes the name of the property, removes any existing 
*				presentation formatting and sets the value in the sessionDictionary.
* 
**************************************************************************/
function setSessionValueForPresentation(propName, value, isDefaultValue)
{
	return setSessionValue(propName, value, true, isDefaultValue);
}


function setDataGroupInstance(group, instance)
{
	var dgName = processPGName(group)
	parent.dataGroupInstances[dgName] = instance;
	parent.dataGroupInstancesValid[dgName] = true;
}

/************************************************************************
* Method: setDefaultSessionValue
* Description: Calls the standard setSessionValue, but sets the default flag.
				This is the only call that should do this.
* 
**************************************************************************/
function setDefaultSessionValue(name, val) {
	setSessionValue(name, val, false, true);
}

/************************************************************************
* Method: setSessionValue
* Description:  This processes the name of the property, and set the value
                in the sessionDictionary.
* 
**************************************************************************/
function setSessionValue(propName, value, removeFormatForPresentation, isDefaultValue)
{
	
    propName = processName(propName);
    var prop;
    //If propName includes a date part, remove date part and store value in session against property name.
    //(splitDateTimeIntoParts() will build individual date parts into a complete value).  Any other properties with functions (e.g. my_value.groupValue()) will be keyed in session using the property and function name.
    if (isDatePartFunctionName(propName))
    {
        prop = getBasePropertyName(propName);
    }
    else
    {
        prop = propName;
    }

    if ( value != null )
	{
		value = "" + value;
	}

	if (value && value.length > 0 && propName && propName.length > 0)
	{
		var type = getPropertyAttribute(prop,parent.DATA_TYPE_KEY);
		
		if (removeFormatForPresentation == null)
		{
			removeFormatForPresentation = false;
		}

		if (removeFormatForPresentation)
		{
			//Remove any presentation-specific formatting before storing values in session.
			
			if (type != null && type == "Decimal")
			{
				value = replaceSymbol(value, prop, "decimalSymbol", ".");
				value = replaceSymbol(value, prop, "digitGroupSymbol", "");
			}
			if (type != null && type == "Number")
			{
				value = replaceSymbol(value, prop, "digitGroupSymbol", "");
			}
			if (type != null && type == "Date")
			{
				var parts = new Array();
				var partOrder = new Array();
				var seps = new Array();

				if (propName.indexOf("()") == -1 || propName.indexOf(DATE_FN) > 0)
				{
					//Put current date time format into arrays
					partOrder = getDateTimePresAttributes(prop, "datePart", 3);
					seps = getDateTimePresAttributes(prop, "dateSeparator", 2);
					
					//Use known format to split value into parts
					parts = splitDateTimeIntoParts(prop, value, partOrder, seps);
					//Re-order parts into default date and time format
					value = getFormattedDateTimeString(parts,DEFAULT_DATETIME_ORDER, DEFAULT_SEPARATOR_ORDER, "00");
					//value = getFormattedDateTimeString(parts,DEFAULT_DATE_ORDER, DEFAULT_DATE_SEP_ORDER);
					propName = prop;
				}
				else if (propName.indexOf(TIME_FN) > 0)
				{
					partOrder = getDateTimePresAttributes(prop, "timePart", 3);
					if (seps && seps.length > 0)
					{
						seps[seps.length] = " "; //add space as separator between date and time parts
					}
					seps = getDateTimePresAttributes(prop, "timeSeparator", 2);

					//Use known format to split value into parts
					parts = splitDateTimeIntoParts(prop, value, partOrder, seps);
					//Re-order parts into default date and time format
					value = getFormattedDateTimeString(parts,DEFAULT_DATETIME_ORDER, DEFAULT_SEPARATOR_ORDER, "00");
				}
				else if (isDatePartFunctionName(propName))
				{
					partOrder[0] = getFunctionName(propName, false); 
					parts = splitDateTimeIntoParts(prop, value, partOrder);
					//Re-order parts into default date and time format
					value = getFormattedDateTimeString(parts,DEFAULT_DATETIME_ORDER, DEFAULT_SEPARATOR_ORDER, "00");
				}
			}
		}
		//server escapes carriage returns, so put them back...
		value = value.replace(/&#013;/g, "\r\n");
		
		if (!isDefaultValue) {
			parent.sessionDictionary[prop] = value;
		}
		put(prop, value);
		
		if (type != null && type == "List" )
		{
			//For list properties, values for the functions .value() and .groupValue() also need to be saved to session.
			var listName = getPropertyAttribute(prop,parent.LIST_NAME_KEY);
			updateListFunctionValues(prop, listName, value, isDefaultValue);
		}
	}
    else
    {
        removeSessionValue(prop);
    }
}

/************************************************************************
* Method: replaceSymbol
* Description:  Looks up the value for the symbol identified with 'oldSymbolName'
*				and replaces any occurances of the symbol in 'value' with 'newSymbol'.
* 
**************************************************************************/
function replaceSymbol(value, prop, oldSymbolName, newSymbol)
{
	var oldSymbol = getPresentationAttribute(prop, oldSymbolName);
	if (value && oldSymbol && (oldSymbol != newSymbol))
	{
		while (value.indexOf(oldSymbol) > -1)
		{
			var re = new RegExp("\\" + oldSymbol);
			value = value.replace(re,newSymbol);
		}
	}
	return value;
}

/************************************************************************
* Method: getGlobalVariable
* Description:  Gets the value for propName from the globalVariables array
* 
**************************************************************************/
function getGlobalVariable(propName)
{
	if (propName != null && propName.length > 0)
	{
		var val = parent.globalVariables[propName];
    	if (val == null)
    	{
        	val = "";
    	}
    	return val;
	}
}

/************************************************************************
* Method: setGlobalVariable
* Description:  Sets the value for propName into the globalVariables array
* 
**************************************************************************/
function setGlobalVariable(propName, value)
{
	if (propName != null && propName.length > 0)
	{
		parent.globalVariables[propName] = value;
	}
}

/************************************************************************
* Method: getSessionVariable
* Description:  Gets the value for propName from the session variables array
* 
**************************************************************************/
function getSessionVariable(propName)
{
	if (propName != null && propName.length > 0)
	{
		var val = parent.sessionVariables[propName];
    	if (val == null)
    	{
        	val = "";
    	}
    	return val;
	}
}

/************************************************************************
* Method: setSessionVariable
* Description:  Sets the value for propName into the session variables array
* 
**************************************************************************/
function setSessionVariable(propName, value)
{
	if (propName != null && propName.length > 0)
	{
		parent.sessionVariables[propName] = value;
	}
}

/************************************************************************
* Method: resetGlobalVariables
* Description:  Resets all global variables in memory and in file
* 
**************************************************************************/
function resetGlobalVariables()
{
	parent.globalVariables = new Array();
}

/************************************************************************
* Method: resetSessionVariables
* Description:  Resets all session variables in memory
* 
**************************************************************************/
function resetSessionVariables()
{
	parent.sessionVariables = new Array();
}

/************************************************************************
* Method: formatValue
* Description:  Formats value for display, depending upon its type.
* 
**************************************************************************/
function formatValue(propName,val,formatForPresentation)
{
	if (val != null && propName != null && propName.length > 0)
	{
		var prop = getBasePropertyName(propName);
		var type = getPropertyAttribute(prop,parent.DATA_TYPE_KEY);
		if (type)
		{
			if (type == "Decimal")
			{
				val = setScale(prop, val);
				
				if (formatForPresentation)
				{
					val = setDecimalPresentation(prop,val);
				}
			}
			else if (type == "Date")
			{
				if (formatForPresentation)
				{
					val = setDateTimePresentation(propName,val);
				}
				else
				{
					val = getDateTimePart(propName,val);
				}
			}
			else if (type == "Number")
			{
				if (formatForPresentation)
				{
					val = setNumberPresentation(propName,val);
				}
			}
		}
	}
	return(val);
}

/************************************************************************
* Method: setScale
* Description:  Sets the decimal value to the required scale, rounding as specified by the 'roundType'.
* 
**************************************************************************/
function setScale(prop,value)
{
	if (value)
	{
		var dp = getPropertyAttribute(prop,parent.DEC_PLACES_KEY);
		var roundType = getPropertyAttribute(prop,parent.ROUNDING_KEY);
		//Determine current number decimal places
		var scale;
		value = "" + value;

		//Remove any leading zeros (nb: 'value = "" + (value * 1)' caused decimal places over 14 to be rounded so had to use the following instead).
		//but "0" is a special case which we allow....
		if (value != "0")
		{
			var firstDigitIndex = 0;
			for (firstDigitIndex=0; firstDigitIndex < value.length; firstDigitIndex++)
			{
				if (value.charAt(firstDigitIndex) != "0")
				{//alert('got ' + value.charAt(firstDigitIndex));
					if (value.charAt(firstDigitIndex) == ".")
						firstDigitIndex--;

					break;
				}
			}
			value = value.substring(firstDigitIndex);
		}

		//If default digit group symbol has been used, remove it
		value = value.replace(/\,/,"");
		if (value.indexOf(".") > -1)
		{
			scale = value.substring(value.indexOf(".")+1).length;
		}

		var val;
		if (dp == scale || parent.ROUND_UNCHANGED_VAL == roundType)
		{
				val = value;
		}
		else if (dp > scale)
		{
			//Pad value out with zeros
			for (var i=scale; i<dp; i++)
				val = val + "0";
		}
		else //dp < scale
		{
			//Replace any occurences of the decimal symbol with the "."
			//Multiply value into a whole number
			val = parseFloat(value) * Math.pow(10,dp);
			//Store decimal part
			var fraction = parseFloat(val - (parseInt(val)));
			if (parent.ROUND_UP_VAL == roundType)
				val = val+1; //add 1
			else if (parent.ROUND_NEAREST_UP_VAL == roundType)
			{
				if (fraction >= 0.5)
					val = val+1; //add 1
			}
			else if (parent.ROUND_NEAREST_DOWN_VAL == roundType)
			{
				if (fraction > 0.5)
					val = val+1; //add 1
			}
			//Remove the fraction part
			val = parseInt(val); 
			//Divide value back down to a float
			val = parseFloat(val) / Math.pow(10,dp);

			//Set number of decimal places on new value to required number by padding with "0"s if necessary.
			val = "" + val; 

			if (dp > 0)
			{
				scale;
				if (val.indexOf(".") > -1)
					scale = value.substring(value.indexOf(".")+1).length;
				else
				{
					scale = 0;
					val += ".";
				}
				
				if (scale < dp)
				{
					//Pad value out with zeros
					for (var i=scale; i<dp; i++)
						val = val + "0";
				}
			}
		}
		return (val);
	}
	else
		return "";
}

/************************************************************************
* Method: setNumberPresentation
* Description:  Formats number 'value' with specified digit group symbol.
* 
**************************************************************************/
function setNumberPresentation(prop, value)
{
	if (value)
	{
		value = "" + value;
		if (value.length > 0)
		{
			var digitGroupSymbol = getPresentationAttribute(prop,"digitGroupSymbol");
			
			//Add the digit group symbol, or replace the default "," symbol with another character, if required
			if (digitGroupSymbol && digitGroupSymbol.length > 0)
			{
				var index = value.indexOf(".");
				if (index == -1)
				{
					index = value.length;
				}
				
				//If default digit group symbol has been used, remove it
				value = value.replace(/\,/,"");
				
				//Add specified digit group symbol into string
				var i = index - 3;
				while (i > 0)
				{
					value = value.substring(0, i) + digitGroupSymbol + value.substring(i);
					i = i - 3;
				}
			}
		}
	}
	if (! value)
	{
		value = "";
	}
	return(value);
}

/************************************************************************
* Method: setDecimalPresentation
* Description:  Formats decimal 'value' with specified digit group symbol and decimal symbol.
* 
**************************************************************************/
function setDecimalPresentation(prop, value)
{
	if (value)
	{
		value = "" + value;
		value = setNumberPresentation(prop, value);
		//Replace the "." decimal symbol, if any, with the user-specified decimal symbol character
		if (value.length > 0 && value.indexOf(".") >= 0)
		{
			var decSymbol = getPresentationAttribute(prop,"decimalSymbol");			
			if (decSymbol && decSymbol.length > 0 && decSymbol != ".")
			{
				value = value.replace(/\./,decSymbol);
			}
		}
	}
	if (! value)
	{
		value = "";
	}
	return(value);
}

/************************************************************************
* Method: getDateTimePart
* Description:  Given a date property name with function (i.e. 'my_value[1].day()'),
*				returns the correct date part for the function from the value 'value'.
*				'value' is assumed to be formatted using the default datetime format and separators, DEFAULT_DATETIME_ORDER and DEFAULT_SEPARATOR_ORDER.
* 
**************************************************************************/
function getDateTimePart(propName,value)
{
	var val = "";
	var partOrder = new Array(); var separators = new Array();
			
	var prop = getBasePropertyName(propName);
	var parts = splitDateTimeIntoParts(prop, value, DEFAULT_DATETIME_ORDER, DEFAULT_SEPARATOR_ORDER);

	if (propName && value)
	{
		if (isDatePartFunctionName(propName))
		{
			var part = getFunctionName(propName, false);

			if (DATE_FN == part)
			{
				partOrder = DEFAULT_DATE_ORDER;
				separators = DEFAULT_DATE_SEP_ORDER;
				val = getFormattedDateTimeString(parts,partOrder,separators);
			}
			else if (TIME_FN == part)
			{
				partOrder = DEFAULT_TIME_ORDER;
				separators = DEFAULT_TIME_SEP_ORDER;
				val = getFormattedDateTimeString(parts,partOrder,separators,"00");
			}
			else
			{
				val = parts[part];
			}
		}
		else
		{
			val = value;
		}
	}
	if (val == null || val.length == 0)
	{
		val = value;
	}
	return val;
}

/************************************************************************
* Method: setDateTimePresentation
* Description:  Orders date and time parts and adds separators, as required
* 
**************************************************************************/
function setDateTimePresentation(propName,value)
{
	var prop = getBasePropertyName(propName);
	var parts = splitDateTimeIntoParts(prop, value, DEFAULT_DATETIME_ORDER, DEFAULT_SEPARATOR_ORDER);

	var showDate = false, showTime = false;
	var val;
	//Check whether a date part has been requested
	if (isDatePartFunctionName(propName))
	{
		var part = getFunctionName(propName, false);
		
		if (DATE_FN == part)
			showDate = true;
		else if (TIME_FN == part)
			showTime = true;
		else
			val = parts[part];
	}
	else
	{
		if (getPresentationAttribute(prop,"showDate") == "true")
			showDate = true;
		if (getPresentationAttribute(prop,"showTime") == "true")
			showTime = true;
	}
	var dts, seps;
	if (showDate)
	{
		//Put order in which parts should be displayed into array
		dts = getDateTimePresAttributes(prop, "datePart", 3);
		//Put separators into array
		seps = getDateTimePresAttributes(prop, "dateSeparator", 2);
		//Check on numParts() is temporary.  It determines whether we currently have formatting info for the data item and if not, calls getDateTimePart() for a default value.
		//When inheritance of presentation attributes is implemented, this check should be removed!
		if (numParts(dts) == 0)
		{
			val = getDateTimePart(propName, value);
		}
		else
		{
			//Re-order parts and add separators
			val = getFormattedDateTimeString(parts,dts,seps);
		}
	}

	if (showTime)
	{
		//Space between date and time
		if (val && val.length > 0)
			val += " ";
			
		dts = new Array(), seps = new Array();
		//Put order in which parts should be displayed into array
		dts = getDateTimePresAttributes(prop, "timePart", 3);
		//Put separators into array
		seps = getDateTimePresAttributes(prop, "timeSeparator", 2);
		//Check on numParts() is temporary.  It determines whether we currently have formatting info for the data item and if not, calls getDateTimePart() for a default value.
		//When inheritance of presentation attributes is implemented, this check should be removed!
		if (numParts(dts) == 0)
		{
			val = getDateTimePart(propName, value);
		}
		else
		{
			val = getFormattedDateTimeString(parts,dts,seps,"00");
		}
	}
	if (! val)
	{
		val = value;
	}
	return val;
}

/************************************************************************
* Method: numParts
* Description:  Temporary method which determines the number of values found in the associative array 'parts'.
*				This will be redundant once default presentation formatting is available. 
* 
**************************************************************************/
function numParts(parts)
{
	num = 0;
	if (parts)
	{
		for (part in parts)
		{
			num++;
		}
	}
	return num;
}

/************************************************************************
* Method: splitDateTimeIntoParts
* Description:  Determines whether a value already exists in session for 'propName' so that this can be passed into parseDateTimeParts().
* 
**************************************************************************/
function splitDateTimeIntoParts(propName, newValue, currentPartOrder, currentSeparators)
{
	var oldParts; var oldValue;
	if (parent.sessionDictionary[propName])
	{
		oldValue = parent.sessionDictionary[propName];
		oldParts = parseDateTimeParts(oldValue, DEFAULT_DATETIME_ORDER, DEFAULT_SEPARATOR_ORDER);
		return parseDateTimeParts(newValue, currentPartOrder, currentSeparators, oldParts);
	}
	else
	{
		return parseDateTimeParts(newValue, currentPartOrder, currentSeparators, DEFAULT_SEPARATOR_ORDER);
	}
}

/************************************************************************
* Method: parseDateTimeParts
* Description:  'currentPartOrder' and 'currentSeparators' identify the current datetime format of 'newValue'.
*				This information is used to split 'newValue' into an associative array of datetime parts.  If an 
*				associative array is passed into 'oldParts', the new parts will be overlaid on this array (allowing
*				us to accumulate a single datetime from a number of fields, .DAY(), .MONTH() etc. which each only update one part of the entire date).
* 
**************************************************************************/
function parseDateTimeParts(newValue, currentPartOrder, currentSeparators, oldParts)
{
	var parts;	
	var startIndex = 0;
	var sepIndex = 0;
	var val;
	var part;
	 
	if (oldParts)
		parts = oldParts;
	else 
		parts = new Array();

	if (currentSeparators)
	{
		for (var i=0; i <= currentSeparators.length && newValue.length > 0; i++)
		{
			if (i == currentSeparators.length)
				sepIndex = newValue.length;
			else
			{
				sepIndex = newValue.indexOf(currentSeparators[i]);
				if (sepIndex == -1)
				{
					sepIndex = newValue.length;
				}
			}
			val = newValue.substring(0,sepIndex);
			part = currentPartOrder[i];
			parts[part] = val;
			newValue = newValue.substring(sepIndex+1);
		}
	}
	else
	{
		part = currentPartOrder[0];
		parts[part] = newValue;
	}
	return parts;
}

/************************************************************************
* Method: getDateTimePresAttributes
* Description:  Returns an array of presentation attribute values for attributes beginning 'fieldPrefix' for the property 'propName'.
* 
**************************************************************************/
function getDateTimePresAttributes(propName, fieldPrefix, numFields)
{
	var partOrder = new Array();
	var presVal = "";
	var fieldName = "";
	for (var i=0; i < numFields ; i++)
	{
		fieldName = fieldPrefix + (i+1);
		if (getPresentationAttribute(propName, fieldName) != null)
		{
			presVal = getPresentationAttribute(propName, fieldName);
			if (fieldName.indexOf("Part") >= 0)
			{
				if (presVal)
					presVal = PART_LOOKUP[presVal];
			}
			
			if (presVal && presVal.length > 0)
			{
				partOrder[i] = presVal;
			}
			
		}
	}
	return partOrder;
}

/************************************************************************
* Method: getFormattedDateTimeString
* Description:  Builds the datetime parts in 'parts' into a string, using the format in 'partOrder' and 'separators'.
*				Optionally a 'defaultValue' will be used if a required part isn't found in 'parts'. 
* 
**************************************************************************/
function getFormattedDateTimeString(parts, partOrder, separators, defaultValue)
{
	var val = "";
	for (var i=0; i < partOrder.length; i++)
	{
		var thisPart = partOrder[i];
		if (thisPart == NOT_REQUIRED)
			break;
		else
		{
			if (i > 0 && separators[i-1])
			{
				val += separators[i-1];
			}
			if (parts[thisPart])
			{
				val += parts[thisPart];
			}
			else
			{
				if (defaultValue)
				{
					val += defaultValue;
				}
			}
		}
	}
	return val;
}

/************************************************************************
* Method: getPropertyAttribute
* Description:  Returns the data dictionary value for attribute 'attrName' for the property 'propName'.
* 
**************************************************************************/
function getPropertyAttribute(propName, attrName)
{
	var val;
	propName = processName(propName);
	var subsOne = changeSubsToOne(propName);
	var attrs = parent.dataDictionary[subsOne];
	if (attrs != null)
	{
		//check type in dd.  If not a standard one, then go to custom types to get attributes...
		var type = attrs[parent.DATA_TYPE_KEY];
		if (type == "Decimal" || type=="Number" || type == "Text" || type == "Date" || type=="List")
			val = attrs[attrName];	
		else
		{
			attrs = parent.customTypes[type];
			val = attrs[attrName];
		}
	}
	if (val == null)
		val = "";
	return val;
}

/************************************************************************
* Method: getPresentationAttribute
* Description:  Returns attribute value for attribute 'attrName' for the property 'propName'.
* 
**************************************************************************/
function getPresentationAttribute(propName, attrName)
{
	var val;
	if (propName && propName.length > 0 && attrName && attrName.length > 0)
	{
		//propName = processName(propName);
		var subsOne = changeSubsToOne(propName);
		var attrs = attributes[subsOne];
		if (attrs != null)
		{
			val = attrs[attrName];	
		}
	}
	if (val == null)
		val = "";
	return val;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function hasPageErrors()
{
	var numOfErrors = Object.size(pageErrors);
	return (numOfErrors > 0);
}

/************************************************************************
* Method: goForwardsOffline
* Description:  This gets called by the continue buttons on the forms. It
*               calls the postphase rules for the phase, and then sets up
*               the next phase by setting the action.
* 
**************************************************************************/
function goForwardsOffline(nameSpace, buttonConfirmMsg)
{
    if (buttonConfirmMsg != null && buttonConfirmMsg != ""){
     if (!confirm(buttonConfirmMsg)){
      return false;
     }
    } 
	if(hasPageErrors()){
		return false;
	}

	var callBackObj = setCallBack("goForwardsOfflineCallBack", arguments);
    
    var oldSessionDictionary = setSessionDictionary(copySessionDictionary());
    var oldSession = setSession(copySession());
        
    //update user values....
    updateUserValues();

    //Re-populate system words in dictionary prior to running rules
    populateSystemWordsIntoDictionary();
    
    callBackObj.m_newSessionDictionary = setSessionDictionary(oldSessionDictionary);
    callBackObj.m_newSession = setSession(oldSession);
        
    act = OFFLINE_CONTROLLER;
    goForwards(nameSpace);    
}

function goForwardsOfflineCallBack(p_callBackObject)
{
    var nameSpace = p_callBackObject.m_args[0];
	var page = parent.CURRENT_PAGE;
    setSessionDictionary(p_callBackObject.m_newSessionDictionary);
    setSession(p_callBackObject.m_newSession);

    //run postphase rules....
    var func = new Function(page + "_postphase()");
    try
	{
		func();
	}
	catch(ex)
	{
		var pageParts = page.split("_");
		if (pageParts.length == 3) //page section number has been appended to page name
		{
			var page = pageParts[0] + "_" + pageParts[1];
			var pageSections = parent.navPageSections[page];
			if (pageSections.sectionIndex == pageSections.numSections - 1) 
			{
				//Current page is last section so reset sectionIndex to 0;
				pageSections.sectionIndex = 0;
				//If current page section is last section, we should have a postphase function to run.
				func = new Function(page + "_postphase()");
				func();
			}
			else
			{
				//increment section index and go forward to next page section
				var thisSec = pageSections.sectionIndex * 1;
				thisSec++;
				pageSections.sectionIndex = thisSec;
				evaluateGoto("Go Forward to a Named Phase", page, nameSpace);
			}
		}
	}

     //get the next phase...
	act = parent.navRoute[parent.navIndex + 1];

	if (act != null)
	{
		parent.navIndex++;
		parent.navInsertIndex = parent.navIndex;
	}
	else
    {
    //check if there is a jumpIndex...
        if (parent.jumpIndex >= 0)
        {   
        	if (parent.remainingRules != null) //Rules remain to be executed for this phase
			{
				//Set flag to indicate that we should traverse rule stack without executing any rule content.
				parent.returnLastResultMode = true;
				remainingRules();
			}
			//Try to get page from navRoute again - remainingRules() may have included an evaluateGoto() which may have set up another page in navRoute
			act = parent.navRoute[parent.navIndex + 1];
			if (act != null)
			{
				parent.navIndex++;
				parent.navInsertIndex = parent.navIndex;
			}
			else
			{
            	act = parent.navRoute[parent.jumpIndex];
            	parent.navRoute = parent.navRoute.slice(0, parent.jumpIndex + 1);
            	parent.navIndex = parent.jumpIndex;
            	parent.jumpIndex = -1;
            }
        }
        else
        {
            act = parent.errorPhase;
        }
    }
   
    var existingUndoRules = parent.undoRulesStack[page];
    if (existingUndoRules == null)
    {
         parent.undoRulesStack[page] = undoRules;
    }
    else
    {
        parent.undoRulesStack[page] = existingUndoRules + "|" + undoRules;
    }

    setMainForm(act);
}

/************************************************************************
* Method: goBackOffline
* Description:  This gets called by the back buttons on the forms. It
*               currently just gets the previous phase from the stack.
* 
**************************************************************************/
function goBackOffline(nameSpace, buttonConfirmMsg)
{
    if (buttonConfirmMsg != null && buttonConfirmMsg != ""){
     if (!confirm(buttonConfirmMsg)){
      return false;
     }
    } 
    var callBackObj = setCallBack("goBackOfflineCallBack", arguments);    
    act = OFFLINE_CONTROLLER;
    goBack(nameSpace);    
}

function goBackOfflineCallBack(p_callBackObject)
{
    var nameSpace = p_callBackObject.m_args[0];
	returnToPage(nameSpace);
}

function returnToPage(nameSpace, newPage)
{
	//If we're going back to the last phase rather than a named phase, set newPage to be the previous page
	if (newPage == null || newPage.length == 0)
	{
		newPage = parent.navRoute[parent.navIndex - 1];
	}
    do
	{
		var page = parent.navRoute[parent.navIndex];
		//If page is a page-section page, set the page's sectionIndex pointer to (current section index - 1).  Current section index is the third part of the page name.
		var pageParts = page.split("_");
		if (pageParts.length == 3)
		{
			var page = pageParts[0] + "_" + pageParts[1];
			var thisSec = pageParts[2];
			if ( thisSec > 0 )
            {
                thisSec--;
		    }
			var pageSections = parent.navPageSections[page];
			pageSections.sectionIndex = thisSec;
		}
		//remove the current phase from the stack...
		parent.navRoute.splice((parent.navIndex), 1);
		act = parent.navRoute[--(parent.navIndex)];
		parent.navInsertIndex--;
		
		var undoStack = parent.undoRulesStack[act];
		if (undoStack != null && undoStack.length > 0)
		{
			var ruleBag = splitstring(undoStack, "|", false);
			//get the last rule set.  These will be the last rules added, so the first to undo...
			var ruleSubSet = ruleBag[ruleBag.length - 1];
			var ruleList = splitstring(ruleSubSet, "^", false);
			//Run undo rule....
			for (var i = 0; i < ruleList.length; i++)
			{
				var f = new Function(ruleList[i]);
				f();
			}
			//Remove the last rule set from the list...
			var lastSetStartPoint = undoStack.lastIndexOf("|");
			if (lastSetStartPoint < 0)
			{
				parent.undoRulesStack[act] = "";
			}
			else
			{
				parent.undoRulesStack[act] = parent.undoRulesStack[act].substring(0, lastSetStartPoint);
			}
		}
		if (act == null)
		{
			act = parent.errorPhase;
		}
	}
    while (newPage != parent.navRoute[parent.navIndex] && parent.navIndex > 0);

    setMainForm(act);
}

/************************************************************************
* Method:       copySessionDictionary
* Description:  Creates a copy of the session dictionary and returns it.
* Parameters:   None
* Return:       Copy of session dictionary
**************************************************************************/
function copySessionDictionary()
{
    var newSessionDictionary = new Array();
    for (var key in parent.sessionDictionary)
    {
        newSessionDictionary[key] = parent.sessionDictionary[key];
    }
    return(newSessionDictionary);
}

/************************************************************************
* Method:       getSessionDictionary
* Description:  Gets current session dictionary
* Parameters:   None
* Return:       Current session dictionary
**************************************************************************/
function getSessionDictionary()
{
    return(parent.sessionDictionary);
}

/************************************************************************
* Method:       setSessionDictionary
* Description:  Sets session dictionary to the one specified and returns the old one.
* Parameters:   p_sessionDictionary - Session dictionary to set
* Return:       Previous session dictionary
**************************************************************************/
function setSessionDictionary(p_sessionDictionary)
{
    var prevDict = parent.sessionDictionary;
    parent.sessionDictionary = p_sessionDictionary;
    return(prevDict);
}

/************************************************************************
* Method:       copySession
* Description:  Creates a copy of the session and returns it.
* Parameters:   None
* Return:       Copy of the session
**************************************************************************/
function copySession()
{
    var newSession = new Array();
    for (var key in session)
    {
        newSession[key] = session[key];
    }
    return(newSession);
}

/************************************************************************
* Method:       getSession
* Description:  Gets current session
* Parameters:   None
* Return:       Current session
**************************************************************************/
function getSession()
{
    return(session);
}

/************************************************************************
* Method:       setSession
* Description:  Sets session to the one specified and returns the old one.
* Parameters:   p_session - Session to set
* Return:       Previous session 
**************************************************************************/
function setSession(p_session)
{
    var oldSession = session;
    session = p_session;
    return(oldSession);
}

/************************************************************************
* Method:       setCallBack
* Description:  Sets the global call back object to the specified function and arguments and returns it 
* Parameters:   p_func  - Name of function to call 
*               p_args  - Arguments array
* Return:       Call back object
**************************************************************************/
function setCallBack(p_func, p_args)
{
    parent.CALLBACK_OBJECT = new Object();
    parent.CALLBACK_OBJECT.m_func = p_func;
    parent.CALLBACK_OBJECT.m_args = p_args;
    return(parent.CALLBACK_OBJECT);
}

/************************************************************************
* Method:       performCallBack
* Description:  Executes the current call back
* Parameters:   None
* Return:       None
**************************************************************************/
function performCallBack()
{
    var funcDef = parent.CALLBACK_OBJECT.m_func + "(parent.CALLBACK_OBJECT)";
    var func = new Function(funcDef);
    func();
}


/************************************************************************
* Method: buttonClickedOffline
* Description:  This gets called by the back buttons on the forms. It
*               currently just gets the previous phase from the stack.
* 
**************************************************************************/
function buttonClickedOffline(actionCommand, validate, rowId, namespace, scrollToButton, id, saveData, validateAllFields, buttonConfirmMsg, inline, idsToValidate)
{
    // Can't see Foward/Back ever being passed in ..
    if (actionCommand == "__Forward"){
        goForwardsOffline("");
    }
    else if (actionCommand == "__Back"){
        goBackOffline("");
    }
    else
    {
        if (buttonConfirmMsg != null && buttonConfirmMsg != ""){
         if (!confirm(buttonConfirmMsg)){
          return false;
         }
        } 

		if(hasPageErrors()){
			return false;
		}

        var callBackObj = setCallBack("buttonClickedOfflineCallBack", arguments);
        
        var oldSessionDictionary = setSessionDictionary(copySessionDictionary());
        var oldSession = setSession(copySession());
        
        if (saveData) {
            updateUserValues();
        }
    
        //update selector...
        if (actionCommand.indexOf("_inst") > 0){
            var instance = actionCommand.substring(actionCommand.indexOf("_inst") + 5);
            var src = document.getElementById(id);//event.srcElement;
			var table = getFormTableElement(src);
            if (table.selector){
            	setSessionValue(table.selector, instance);
            }
        }        

        //Re-populate system words in dictionary prior to running rules
        populateSystemWordsIntoDictionary();

        callBackObj.m_newSessionDictionary = setSessionDictionary(oldSessionDictionary);
        callBackObj.m_newSession = setSession(oldSession);
        
        act = OFFLINE_CONTROLLER;

		buttonClicked(actionCommand, validate, rowId, namespace, scrollToButton, id, saveData, validateAllFields, buttonConfirmMsg, inline, true, idsToValidate);
    }
}

function buttonClickedOfflineCallBack(p_callBackObject)
{
    var actionCommand = p_callBackObject.m_args[0];
    var validate = p_callBackObject.m_args[1];
    var rowId = p_callBackObject.m_args[2];
    var namespace = p_callBackObject.m_args[3];
    var scrollToButton = p_callBackObject.m_args[4];
    var id = p_callBackObject.m_args[5];
    var saveData = p_callBackObject.m_args[6];
    var page = parent.CURRENT_PAGE;
    
    setSessionDictionary(p_callBackObject.m_newSessionDictionary);
    setSession(p_callBackObject.m_newSession);
        
    var phaseCount1 = parent.navRoute.length;

    if  ( actionCommand.indexOf("__") == 0 )
    {
        actionCommand = actionCommand.substring(2);
    }
    if (actionCommand.indexOf("_inst") > 0)
    {
        actionCommand = actionCommand.substring(0, actionCommand.indexOf("_inst"));
    }        
	if (actionCommand.indexOf(" ") > 0)
	{
		actionCommand = actionCommand.replace(/\s+/g, "");
	}

    //run button rules....
    var func = new Function(page + "_" + actionCommand + "()");
    try
    {
        func();
    }
    catch(ex)
    {
        var pageParts = page.split("_");
        if (pageParts.length == 3)
        {
            var pg = pageParts[0] + "_" + pageParts[1];
            func = new Function(pg + "_" + actionCommand + "()");
            func();
        }
    }

    var phaseCount2 = parent.navRoute.length;
    //We are checking to see if any new phases have been added to the stack, or if a phase has been removed from the stack.  If there haven't, we go to the current phase
    if (phaseCount1 == phaseCount2 || phaseCount1 > phaseCount2)
    {
        act = parent.navRoute[parent.navIndex];
    }
    else
    {
        act = parent.navRoute[++(parent.navIndex)];
    }
    parent.navInsertIndex = parent.navIndex;
    setMainForm(act);
}

/****************
*  HELP STUFF
*****************/
function showHelpOffline(p_helpText, p_namespace)
{
	var helpPagePath = unescape(getResourcePath(p_namespace, getVariable(p_namespace, 'helpPagePath')));
	var url = tokenReplace(helpPagePath + "?" + p_helpText);
    window.open(url, "helpwin" ,"toolbar=no,directories=no,status=yes,scrollbars=yes,resizeable=yes,resize=yes,menubar=no,height=300,width=600").focus();
}

/********************************************************

This section handles file loading and saving..

********************************************************/
function loadForm(frm)
{
	var fileName = frm.elements["APPLICATIONS"].options[frm.elements["APPLICATIONS"].selectedIndex].value;
	parent.APP_FORM = fileName;
	loadFile();
	// Prepend any additional parent directory paths if overriden in a presentation , e.g change "..\\" to "..\\..\\"
	setMainForm(parent.navRoute[0]);
}

function setMainForm(p_form)
{
    window.location = "..\\" + p_form + ".html";
}

function loadFile()
{
	var newFilePath, fso, filePath, domDoc;
	if (parent.APP_FORM != null)
	{     
        var filePath = APP_DIRECTORY + '/' + parent.APP_FORM;
        parent.initOfflineSession();
        parent.initOfflineApplication();

            var adodbStream = new ActiveXObject('Adodb.Stream');  
            adodbStream.Open;
            adodbStream.Type = 2;  
            adodbStream.Charset = 'UTF-8';  
            adodbStream.loadFromFile(filePath);
            
            var name="";
            var value="";
            var split=-1;

            var lineCount = 0;
            while (! adodbStream.EOS)
            {       
                line = trim(adodbStream.ReadText(-2));
                lineCount++;
                if (line.length > 0)
                {
                    split = line.indexOf("=");
                    if (split > -1)
                    {
                        name = trim(line.substring(0,split));
                        if (name.indexOf(SELECT_LIST_PREFIX) != 0 && name.indexOf(UNSELECT_LIST_PREFIX) != 0)
						{
                        	value = trim(line.substring(split + 1));
                        	put(name,value);
                        	setSessionValue(name, value);
                        }
                    }
                    else
                    {
                        alert(getMsg("", "FailedLoadAppMessage", "QUESTION_CONSTRAINT=" + lineCount));
                        break;
                    }
                }
            }               
            adodbStream.close();
			alert("Successfully loaded " + parent.APP_FORM);
        }
        return(true);
    }
        
    function saveOfflineForm()
    {
        if (buttonsEnabled())
        {
            updateUserValues(); 
            var formElems = getFormElems();
            if (mandCheckElems(formElems) && formatCheckElems(formElems))
            {
                if (writeFile())
                {
                    return true;
                }
            }
        }
        return(false);
    }

    function writeFile()
    {
        if (parent.APP_FORM == null || parent.APP_FORM == "" )
        {       
            if (!createNewAppFile())
            {
                return false;
            }
        }

        var filePath = APP_DIRECTORY + '/' + parent.APP_FORM;

        var adodbStream = new ActiveXObject('Adodb.Stream');  
        adodbStream.Open;
        adodbStream.Type = 2;  
        adodbStream.Charset = 'UTF-8';  

        for (name in parent.sessionDictionary)
        {
            if (("" + name).length > 0)	{
				var val = "" +  parent.sessionDictionary[name];
				if (val.indexOf("function(") < 0)	{
					val = val.replace(/\r\n/g, "&#013;");
		            adodbStream.WriteText(name + "=" + val, 1);
				}
			}
        }

		/*
		DEV3114 - global variables shouldn't be persisted to file
		for (name in parent.globalVariables)
        {
            if (("" + name).length > 0)
                adodbStream.WriteText("GLO_"+ name + "=" + parent.globalVariables[name], 1);
        }*/
		for (name in parent.sessionVariables)
        {
            if (("" + name).length > 0){
				var val = "" +  parent.sessionVariables[name];
				if (val.indexOf("function(") < 0)	{
					val = val.replace(/\r\n/g, "&#013;");
		            adodbStream.WriteText("SES_" + name + "=" + val, 1);
				}
			}
        }
        adodbStream.SaveToFile(filePath, 2);
        adodbStream.close();
        alert("Data successfully saved to " + filePath);
        return(true);
    }

    function createNewAppFile()
    {
        var file;
        
        setFormName();
        if (parent.APP_FORM == "")
        {
            return false;
        }
        else
        {
            if (parent.APP_FORM.indexOf(".app") == -1)
            {
                parent.APP_FORM = parent.APP_FORM + ".app";
            }

	        var adodbStream = new ActiveXObject('Adodb.Stream');  
            adodbStream.Open;
            adodbStream.Type = 2;  
            adodbStream.Charset = 'UTF-8';  
            adodbStream.SaveToFile(APP_DIRECTORY + '/' + parent.APP_FORM, 2);
            adodbStream.close();
            
            return true;
        }
    }

function setFormName()
{
    parent.APP_FORM = "";

    window.showModalDialog(getOfflineFileNamePagePath,window,"dialogHeight: 200px; dialogWidth: 300px; dialogTop: 250px; dialogLeft: 200px; edge: Raised; center: Yes; help: Yes; resizable: Yes; status: Yes;");
    //window.showModalDialog("html/getOfflineFileName.html",window);
}

function showSavedAppForms(frm)
{
	var folder;
	var files;
	var file;
	var fileEnum;
	var path;
	var appExtension = TXT_EXTENSION;
	var frm;

	var appDir = APP_DIRECTORY;
	
	var str = "";
	//test whether the APPLICATIONS element is being displayed before trying to set its options!
	if (frm.APPLICATIONS != null)
	{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		if (fso.FolderExists(appDir))
		{
			path = appDir;

			if (fso.FolderExists(path))
			{
				folder = fso.GetFolder(path);
				files = folder.Files;

                while ( frm.APPLICATIONS.options.length > 0 )
                {
                    frm.APPLICATIONS.options.remove(0);
                }
				
				var count = 0;
				for (fileEnum = new Enumerator(files); !fileEnum.atEnd(); fileEnum.moveNext())
				{
					count++;
					file = fileEnum.item().name;
					fileExtension = file.substring(file.lastIndexOf("."),file.length);
					if (fileExtension == appExtension)
					{
						frm.APPLICATIONS.options[frm.APPLICATIONS.options.length] = new Option(file,file);
					}					
				}
				if (count > 0)
				{
					frm.APPLICATIONS.style.visibility = "visible";
					top.frames["return"].document.getElementById('AppSelect').style.visibility = "visible";
				}
				else
				{
					alert("There are no saved appliactions");
				}
			}
		}
	}
}
function setFileName(p_fileName) 
{
    if (p_fileName.value == "" ||
		p_fileName.value.indexOf('"') >= 0 ||
		p_fileName.value.indexOf(",") >= 0)
	{
		alert("Please enter a file name");
		p_fileName.focus();
	}
    else
    {
		window.dialogArguments.parent.APP_FORM = "" + p_fileName.value;
		window.close();
    }
}

function checkReturn() {
	var code;
	var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which; 
	if (code == 13)
	{
		 setFileName(document.forms[0].fileTextField)
	}
}

/************************************************************************
* Method: populateSystemWordsIntoDictionary
* Description:  sets values for system words in session dictionary
* 
**************************************************************************/
function populateSystemWordsIntoDictionary()
{
	//Date and time variables
	var dt = new Date();
	var hrs = dt.getHours();
	var amOrPm;
	if (hrs < 12)
	{
		amOrPm = "AM";
	}
	else
	{
		amOrPm = "PM";
	}
	var date = formatDigits(dt.getDate()) + "/" + formatDigits(dt.getMonth() + 1) + "/" + formatDigits(dt.getFullYear());
	var time = formatDigits(dt.getHours()) + ":" + formatDigits(dt.getMinutes()) + ":" + formatDigits(dt.getSeconds());
	setSessionValue(SW_SYSAM_PM,amOrPm);
	setSessionValue(SW_SYSDATE,date);
	setSessionValue(SW_SYSDATETIME,date + " " + time);
	setSessionValue(SW_SYSDAY,formatDigits(dt.getDate()));
	hrs = dt.getHours();
	var twelveHrs;
	
	if (hrs >= 12 && hrs <= 23)
	{
		twelveHrs = (hrs - 12);
	}
	else
	{
		twelveHrs = hrs;
	}

	setSessionValue(SW_SYSHOUR,formatDigits(twelveHrs));
	setSessionValue(SW_SYSHOUR_OF_DAY,formatDigits(dt.getHours())); //24-hour representation
	setSessionValue(SW_SYSMINUTE,formatDigits(dt.getMinutes()));
	setSessionValue(SW_SYSMONTH,formatDigits(dt.getMonth() + 1)); //In Javascript months start at 0.
	setSessionValue(SW_SYSSECOND,formatDigits(dt.getSeconds()));
	setSessionValue(SW_SYSTIME,formatDigits(time));
	setSessionValue(SW_SYSTIMEMILLIS,formatDigits(dt.getTime()));
	setSessionValue(SW_SYSYEAR,dt.getFullYear()); //4-digit year representation.
	
	//Phase and process system words
	var form = document.getElementById("form1");
    var page = form.elements["PAGE"].value;
	var parts = page.split("_");	
	setSessionValue(SW_PROCESS,parts[0]);
	setSessionValue(SW_PHASE,parts[1]);
	
	//Project home
	var projectHome = unescape(getVariable('', 'rootContext'));
	setSessionValue(SW_PROJECTHOME,projectHome);
}

/************************************************************************
* Method: formatDigits
* Description:  adds leading "0" to digit value 
* 
**************************************************************************/
function formatDigits(val)
{
	if (val < 10)
	{
		val = "0" + val;
	}
	return val;
}


/********************************************************
*                                                       *
*               ACTION RULES                            *
*                                                       *
*********************************************************/

/************************************************************************
* Method: evaluateGoto
* Description:  This runs the goto rules....
* 
**************************************************************************/
function evaluateGoto()
{
	var mode = arguments[0];
	var newPage = arguments[1];
	var namespace = arguments[2];
	var runRemainingRulesFlag = arguments[3];
	var ruleSet = arguments[4];
	var ruleName = arguments[5];
	var rule;

	if (runRemainingRulesFlag == 'On Return')
	{ 
		if (!parent.returnLastResultMode)
		{
			//Stop rule execution here but store the ruleSet and ruleName so that we can resume execution from this point later.
			parent.remainingRules = new parent.rule(ruleSet,ruleName);
			suspendExec = true;
		}
		else if (((rule = parent.remainingRules) != null) && (rule.ruleName == ruleName))
		{
			//We're re-running the rule which triggered the rule suspension previously.  Rule content should be executed from here so set returnLastResultMode to false.
			parent.returnLastResultMode = false;
			parent.remainingRules = null;
			suspendExec = false;
			return;	
		}	
	}
	else if (runRemainingRulesFlag == 'Never')
	{
		//Stop running rules.  Don't set up any 'remainingRules' for running later.
		parent.returnLastResultMode = false;
		suspendExec = true;
	}		
		
	if (parent.navPageSections[newPage] != null)
	{
		var pageWithSections = parent.navPageSections[newPage];
		var newSec;
		//If we're jumping-out, we should always go to the first section of a page split into page sections so set sectionIndex pointer to 0.  Otherwise, get page for current section index.
		if (mode == "Jump out to Named Phase")
		{
			newSec = 0;
			pageWithSections.sectionIndex = newSec;
		}
		else
		{
			newSec = pageWithSections.sectionIndex;
		}
		newPage = newPage + "_" + newSec;
	}

    //var debug = 1;
    //we need to insert the next phase 
    if (mode == "Go Forward to a Named Phase")
    {
        parent.navInsertIndex++;
        parent.navRoute = parent.navRoute.slice(0, parent.navInsertIndex).concat(newPage, parent.navRoute.slice(parent.navInsertIndex));
        if (debug)
            alert("GOTO RULE: Going to named phase " + newPage + ". Phase stack looks like: " + parent.navRoute);
    }
    else if (mode == "Go Back to Last Phase")
    {
        if (debug)
            alert("GOTO RULE: Going back to last phase");

		returnToPage(namespace);
    }
    else if (mode == "Jump out to Named Phase")
    {
        if (debug)
            alert("GOTO RULE: Jumping out to phase " + newPage);
        parent.jumpIndex = parent.navIndex;
        parent.navInsertIndex++;
        parent.navRoute = parent.navRoute.slice(0, parent.navInsertIndex).concat(newPage, parent.navRoute.slice(parent.navInsertIndex));
    }
    else if (mode == "Go Back to a Named Phase")
	{
		 if (debug)
            alert("GOTO RULE: Going back to named phase " + newPage);

		 returnToPage(namespace, newPage);
	}
}

/************************************************************************
* Method: remainingRules
* Description:  Executes the rule-block stored in the remainingRules variable.
* 
**************************************************************************/
function remainingRules()
{
	var rule = parent.remainingRules;
	if (rule != null && rule.ruleSet != null && rule.ruleSet.length > 0)
	{
		evalString(rule.ruleSet + "()");
	}
}

/************************************************************************
* Method: evaluateSetDataItem
* Description:  Sets up the value of a data item....
* 
**************************************************************************/
function evaluateSetDataItem()
{
	if (parent.returnLastResultMode){return;}
    var diToSet = arguments[0];
    var fromType = arguments[1];
    var val = arguments[2];

    if (fromType == "Data Item")
        val = getSessionValue(val);
	else if (fromType == "System Word")
		val = "$$" + val + "$";
	else if (fromType == "Data Group Instance")
	{
		var pgName = processPGName(val);
		val = parent.dataGroupInstances[pgName];
        if (val == null || val == "0")
        {
            val = "1";
            parent.dataGroupInstances[pgName] = "1";
			parent.dataGroupInstancesValid[pgName] = false; // indicate that 1 has been set as a default - incrementor does not increment an invalid 1, but
															// rather sets instance to 1 and makes it valid;
        }
	}
	else if (fromType == "Variable")
		val = getSessionVariable(val);
	else if (fromType == "Global Variable")
		val = getGlobalVariable(val);
	
	if ( val != null )
	{
		val = "" + val;	
	    var changeCase = arguments[3];
	    if (changeCase == "Upper case")
	        val = val.toUpperCase();
	    else if (changeCase == "Lower case")
	        val = val.toLowerCase();
	
	    var trim = arguments[4];
	    if (trim == "true")
	        val = val.trim();
	    val = tokenReplace(val);

		


	}
	
    if (debug)
        alert("SET DATA ITEM RULE: Setting " + diToSet + " with value " + val);
    setSessionValue(diToSet, val);
}

/************************************************************************
* Method: evaluateSetVariable
* Description:  Sets up the value of a global or session variable...
* 
**************************************************************************/
function evaluateSetVariable()
{
	var toType = arguments[0];
	var varToSet = arguments[1];
    var fromType = arguments[2];
    var val = arguments[3];

    if (fromType == "Data Item")
        val = getSessionValue(val);
	else if (fromType == "System Word")
		val = "$$" + val + "$";
	else if (fromType == "Data Group Instance")
		val = parent.dataGroupInstances[processPGName(val)];
	else if (fromType == "Variable")
		val = getSessionVariable(val);
	else if (fromType == "Global Variable")
		val = getGlobalVariable(val);

    var changeCase = arguments[4];
    if (changeCase == "Upper case")
        val = val.toUpperCase();
    else if (changeCase == "Lower case")
        val = val.toLowerCase();

	val = tokenReplace(val);
    var trim = arguments[5];
    if (trim == "true")
        val = val.trim();

	if (toType == "Variable")
		setSessionVariable(varToSet, val);
	else if (toType == "Global Variable")
		setGlobalVariable(varToSet, val);

	if (debug)
        alert("SET DATA ITEM RULE: Setting " + varToSet + " with value " + val);
}

/************************************************************************
* Method: copyPropertyGroup
* Description:  Recursively copies property values from one data group to another
* 
**************************************************************************/
function copyPropertyGroup(dgFromName,dgToName,changeCase,trim,recursiveCopy)
{
	var propertyFromName, propertyToName, propertyFromName2, propertyToName2, propArray, fromPGMax, toPGMax, fromInd, toInd;
	dgFromName = processName(dgFromName);
	dgToName = processName(dgToName);
	fromInd = dgFromName.indexOf("[A]");
	toInd = dgToName.indexOf("[A]");
	if (fromInd > 0 || toInd > 0)
	{
		//Get strings before the [A]
		propertyFromName = dgFromName.substring(0,fromInd);
		propertyToName = dgToName.substring(0,toInd);
		//Get strings after the [A] if any
		propertyFromName2 = "", propertyToName2 = "";
		if ((fromInd + 3) < dgFromName.length)
		{
			propertyFromName2 = dgFromName.substring(fromInd + 3);
		}
		if ((toInd + 3) < dgToName.length)
		{
			propertyToName2 = dgToName.substring(toInd + 3);
		}
		//Lookup max number of instances for the data group...
		//If string before [A] contains an instance number that isn't [1], replace it temporarily with [1] in order to lookup the instance number (which is always stored against instance [1]).
		var maxLookupFrom, maxLookupTo, instanceStartInd;
		instanceStartInd = propertyFromName.indexOf("[");
		if (instanceStartInd > 0)
		{
			maxLookupFrom = propertyFromName.replace(/\[[0-9]+]/g, "[1]");
		}
		else
		{
			maxLookupFrom = propertyFromName;
		}
		instanceStartInd = propertyToName.indexOf("[");
		if (instanceStartInd > 0)
		{
			maxLookupTo = propertyToName.replace(/\[[0-9]+]/g, "[1]");
		}
		else
		{
			maxLookupTo = propertyToName;
		}
		fromPGMax = parent.dataGroupMaxInstances[maxLookupFrom];
    	toPGMax = parent.dataGroupMaxInstances[maxLookupTo];
		//Replace the [A] with an actual instance up to the max number allowed
    	for (var i=1; i <= fromPGMax && i <= toPGMax; i++)
    	{
    		try
    		{
    			copyPropertyGroup(propertyFromName + "[" + i + "]" + propertyFromName2, propertyToName + "[" + i + "]" + propertyToName2, changeCase, trim, recursiveCopy);
    		}
    		catch(ex)
    		{
    		}
    	}
	} 
	else
	{
		for (var prop in parent.sessionDictionary)
    	{
    		if (prop.indexOf(dgFromName) == 0)
    		{
				var subParts = prop.substring(dgFromName.length + 1);
    			propArray = subParts.split(".");
    			
				if (propArray.length == 1 || recursiveCopy == "Y")
				{
					propertyToName = dgToName + "." + subParts;
					var val = parent.sessionDictionary[prop];
				    if (changeCase == "Upper case")
				        val = val.toUpperCase();
				    else if (changeCase == "Lower case")
				        val = val.toLowerCase();
				
				    if (trim == "true")
				        val = val.trim();
					try
    				{
    					parent.sessionDictionary[propertyToName] = val;
    				}
    				catch(ex)
    				{
    				}
				}
    		}
		}
	}
}

/************************************************************************
* Method: evaluateSetValue
* Description:  This is the advanced version of set data item rule.
*               Anything can be set!
* 
**************************************************************************/
function evaluateSetValue()
{
	if (parent.returnLastResultMode){return;}
    var type = arguments[0];
    var fromType = arguments[2];

    if (type == "Data Item")
    {
        var diToSet = arguments[1];
        if (fromType == "Data Item")
        {
            evaluateSetDataItem(diToSet, "Data Item", arguments[3], arguments[4], arguments[5]);
        }    
        else if (fromType == "Value")
        {
			evaluateSetDataItem(diToSet, "Value", arguments[3], arguments[4], arguments[5]);
        }
		else if (fromType == "System Word")
        {
			evaluateSetDataItem(diToSet, "System Word", arguments[3], arguments[4], arguments[5]);
        }
        else if (fromType == "Data Group Instance")
        {
			evaluateSetDataItem(diToSet, "Data Group Instance", arguments[3], arguments[4], arguments[5]);
        }
		else if (fromType == "Variable")
        {
			evaluateSetDataItem(diToSet, "Variable", arguments[3], arguments[4], arguments[5]);
        }
		else if (fromType == "Global Variable")
        {
			evaluateSetDataItem(diToSet, "Global Variable", arguments[3], arguments[4], arguments[5]);
        } 
    }
    else if (type == "Data Group Instance")
    {
		var dgInstanceToSet = tokenReplace(arguments[1]);
        dgInstanceToSet = processPGName(dgInstanceToSet);
        var diValue = "" + arguments[3];
        if (fromType == "Data Item" || fromType == "System Word")
        {
            diValue = getSessionValue(arguments[3]);
        }
        else if (fromType == "Data Group Instance")
        {
            diValue = parent.dataGroupInstances[processPGName(arguments[3])];
        }
        else if (fromType == "Variable")
        {
			diValue = getSessionVariable(arguments[3]);
        }
		else if (fromType == "Global Variable")
        {
			diValue = getGlobalVariable(arguments[3]);
        } 
        else
        {
            diValue = tokenReplace(arguments[3]);
        }

		try
		{
    		var trim = arguments[5];
    		if (trim == "true")
        		diValue = diValue.trim();
        		
			diValue = parseInt(diValue);
        	if (debug)
            	alert("SET VALUE RULE: Setting datagroup instance " + dgInstanceToSet + " to " + diValue);

        	parent.dataGroupInstances[dgInstanceToSet] = diValue;
			parent.dataGroupInstancesValid[dgInstanceToSet] = true;
        }
        catch(ex)
        {
        }
    }
	else if (type == "Variable" || type == "Global Variable")
	{
		evaluateSetVariable(type, arguments[1], fromType, arguments[3], arguments[4], arguments[5]);
	}
	else if (type == "Data Group")
	{
		var dgToName = arguments[1];
		var dgFromName = arguments[3];
		var changeCase = arguments[4];
		var trim = arguments[5];
		var recursiveCopy = arguments[6];
		if (dgToName != null && dgToName.length > 0 && dgFromName != null && dgFromName.length > 0)
		{
			copyPropertyGroup(dgFromName,dgToName,changeCase,trim,recursiveCopy);
		}
	}
    else
    {
        alert("SetValue " + type + " not supported");
    }
}

/************************************************************************
* Method: evaluateArithmetic
* Description:  Performs a basic calculation....
* 
**************************************************************************/
function evaluateArithmetic()
{
	if (parent.returnLastResultMode){return;}
    var dataItems = arguments[0];
    var operation = arguments[1];
    var result = arguments[2];

    if (operation == "Add")
    {
        operation = "+";
    }
    else if (operation == "Subtract")
    {
        operation = "-";
    }
    else if (operation == "Multiply")
    {
        operation = "*";
    }
    else if (operation == "Divide")
    {
        operation = "/";
    }
    
    var dataItemList = splitstring(dataItems, ",", false);


    var expr = "";
    for (var i=0; i < dataItemList.length ; i++ )
    {
		var diName = dataItemList[i];
        var di_value;
		if (diName.indexOf("[A]") > 0)
		{
			var startPart = diName.substring(0, diName.indexOf("[A]"));
			var endPart = diName.substring(diName.indexOf("[A]") + 3);
			var maxInst = getLastInstance(startPart);
			if (maxInst == 0)
			{
				expr += "0";
			}
			for (var j = 1; j <= maxInst ; j++)
			{
				diName = startPart + "[" + j + "]" + endPart;
				di_value = getSessionValue(diName);
				if (di_value == "")
				{
					di_value = 0;
				}
				expr += di_value;
				if (j < maxInst)
				{
					expr += operation;
				}
			}
		}
		else
		{
			di_value = getSessionValue(diName);
			if (di_value == "")
			{
				di_value = 0;
			}
			expr += di_value;
		}
		if (i < dataItemList.length - 1)
		{
			expr += operation;
		}
    }

    var answer = jsep.eval(expr);
    if (!answer || ("" + answer).length == 0)
    	answer = 0;
    if (debug)
        alert("ARITHMETIC RULE: Answer = " + answer);
    setSessionValue(result, answer);
}

/************************************************************************
* Method: evaluateSetProcessItemStatus
* Description:  Sets a process, phase or question to be read only (or enabled).
* 
**************************************************************************/
function evaluateSetProcessItemStatus()
{
	if (parent.returnLastResultMode){return;}
    var itemType = arguments[0];
    var itemName = arguments[1];  
    var readOnly = arguments[2];
    var mandatory = arguments[3];
    var changeReadOnly = arguments[4];
    var changeMandatory = arguments[5];
    var ignoreReadOnly = arguments[6];
    var ignoreMandatory = arguments[7];
    var mandMessage = arguments[8];
	       
    if (changeReadOnly == "Y")
    {
	    if (readOnly == "Y")
	        readOnly = true;
	    else if (readOnly = "N")
	        readOnly = false;

		if (ignoreReadOnly == "Y")
			ignoreReadOnly = true;
		else if (ignoreReadOnly == "N")
			ignoreReadOnly = false;
				     
	    if (itemType == "Question")
	    { 
	        parent.questionState[itemName] = readOnly;
	    }
	    else if (itemType == "Phase")
	    {
	    	var readOnlyState = new parent.fieldState(readOnly,ignoreReadOnly);
	    	parent.questionState["phase_" + itemName] = readOnlyState;       
	    }
	    else
	    {
	    	var readOnlyState = new parent.fieldState(readOnly,ignoreReadOnly);
	    	parent.questionState["process_" + itemName] = readOnlyState;	        
	    }

        if (debug)
            alert("SET PROCESS ITEM STATUS: Setting " + itemType + " " + itemName + " to be " + (readOnly?"read only":"editable"));
 	}
 	
 	if (changeMandatory == "Y")
 	{
	    if (mandatory == "Y")
	        mandatory = true;
	    else if (mandatory = "N")
	        mandatory = false; 

		if (ignoreMandatory == "Y")
			ignoreMandatory = true;
		else if (ignoreMandatory == "N")
			ignoreMandatory = false;
			
		var process, phase;

	    if (itemType == "Question")
	    { 
			var mandState = new parent.fieldState(mandatory,null,mandMessage);
			parent.questionMandatoryState[itemName] = mandState; 
	    }
	    else if (itemType == "Phase")
	    {
	    	var mandState = new parent.fieldState(mandatory,ignoreMandatory,mandMessage);
	    	parent.questionMandatoryState["phase_" + itemName] = mandState;   
	    }
	    else
	    {
	    	var mandState = new parent.fieldState(mandatory,ignoreMandatory,mandMessage);
	    	parent.questionMandatoryState["process_" + itemName] = mandState;   
	    }

        if (debug)
            alert("SET PROCESS ITEM STATUS: Setting " + itemType + " " + itemName + " to be " + (mandatory?"mandatory":"non mandatory"));
 	}  
 	
    var undoRequired = arguments[9];
    if (undoRequired == null || undoRequired == "" || undoRequired == "Y")
    {       
        undoRules += "evaluateSetProcessItemStatus('" + itemType + "', '" + itemName + "', '" + (readOnly?"N":"Y") + "', '" + (mandatory?"N":"Y") + "', '" + changeReadOnly + "', '" + changeMandatory + "', '" + ignoreReadOnly + "', '" + ignoreMandatory + "', '" + mandMessage + "', 'N');";
}

}

/************************************************************************
* Method: evaluateTextModifier
* Description:  Takes a substring from a text property....
* 
**************************************************************************/
function evaluateTextModifier()
{
	if (parent.returnLastResultMode){return;}
    var dataItem = arguments[0];
    var start = tokenReplace(arguments[1]);
    var end = tokenReplace(arguments[2]);

    dataItem = processName(dataItem);
    var val = getSessionValue(dataItem);

    if (start == null || start.length == 0)
    {
        start = 0;
    }
    else
    {
        start = start - 1;
    }

    if (end == null || end.length == 0)
    {
        end = val.length;
    }
    else
    {
        end--;
    }

    var newVal = val.substring(start, end);
    if (debug)
        alert("TEXT MODIFIER RULE: Modified dataItem " + dataItem + " from value " + val + " to have a value of " + newVal);

    setSessionValue(dataItem, newVal);
}

/************************************************************************
* Method: evaluateResetData
* Description:  Clears down data item values
* 
**************************************************************************/
function evaluateResetData()
{
	if (parent.returnLastResultMode){return;}
	
    var undoRequired = arguments[10];
	var clearQuestionInError = arguments[11];

    if (undoRequired == null || undoRequired == "") undoRequired = "Y";
	
    //back up exclude values....
    var diToExclude = splitstring(arguments[5], ",", false);

    var diValuesToExclude = new Array();
    for (var x = 0; x < diToExclude.length ; x++ )
    {
        var val = getSessionValue(diToExclude[x]);
        diValuesToExclude[diToExclude[x]] = val;
    }

    //reset dictionary....
    if (arguments[0] == true || arguments[0] == "true" || arguments[0] == "Y")
    {
        if(debug)
            alert("RESET DATA RULE: Resetting session.");
        parent.sessionDictionary = new Array();
    }
    //reset data item....
    if (arguments[1].length > 0)
    {
        if(debug)
            alert("RESET DATA RULE: Resetting dataItem " + arguments[1]);
        resetDataItem(processName(arguments[1]));
    }
    //reset data group instances....
    if (arguments[2].length > 0)
    {
        if(debug)
            alert("RESET DATA RULE: Resetting data group instance " + arguments[2]);
        var pgName = processPGName(arguments[2]);
        var originalValue = parent.dataGroupInstances[pgName];
        parent.dataGroupInstances[pgName] = "1";
		parent.dataGroupInstancesValid[pgName] = true;
        if (undoRequired == "Y")
        {
	        undoRules += "evaluateResetDataUndo('data group instance', '" + pgName + "', '" + originalValue + "');^";
		}
    }
    //reset data group group....
    if (arguments[3].length > 0)
    {
		var pgName = tokenReplace(arguments[3]);
        pgName = processName(pgName);
        resetDataGroup(pgName);
    }

    //reset phase
	if (arguments[4].length > 0)
    {		
		//Process question data items
		var resetPhase = arguments[4];
		var diNames = parent.phaseDataItems[resetPhase];
		if (diNames != null && diNames.length > 0)
		{
			var dataItems = diNames.split(",");
			for (var i=0; i < dataItems.length; i++)
			{
				resetPageDataItem(processName(dataItems[i]),resetPhase);
			}
		}
		//Process table data items 
		diNames = parent.phaseTableDataItems[resetPhase];
		if (diNames != null && diNames.length > 0)
		{
			var dataItems = diNames.split(",");
			for (var i=0; i < dataItems.length; i++)
			{
				resetPageDataItem(dataItems[i],resetPhase);
			}
		}
    }
    
    if (arguments[6].length > 0)
    {
    	resetGlobalVariables();
    }
    
    if (arguments[7].length > 0)
    {
    	resetSessionVariables();
    }
    
    if (arguments[8].length > 0)
    {
    	var key = arguments[8].substring(0, arguments[8].length - 5);
		key = key.toUpperCase();
    	parent.removeSessionListValue(key);
    }
    
    if (arguments[9].length > 0)
    {
    	var key = processName(arguments[9]);
    	parent.removeSessionListValue(key);
    }

	if (arguments[11].length > 0)
	{
		var errId = getVariable('', "CURRENT_FOCUS") + "_ERRORMESSAGE";
		var err = document.getElementById(errId);
		if (err)
		{
			err.style.display = 'none';
			err.innerHTML = "";
			delete pageErrors[errId];
		}

	}

    //restore the excluded data items...
    for (var x in diValuesToExclude)
    {
        setSessionValue(x, diValuesToExclude[x]);
    }
}

/************************************************************************
* Method: removeSessionValue
* Description:  Removes the specified value from the session dictionary
* Parameters: 
*       p_key   - Processed key to remove
**************************************************************************/

function removeSessionValue(p_key)
{
    delete parent.sessionDictionary[p_key];
}

/************************************************************************
* Method: removeSessionValues
* Description:  Removes the specified values from the session dictionary
* Parameters: 
*       p_keys   - Associative array of with the keys are the items to remove
**************************************************************************/

function removeSessionValues(p_keys)
{
    for (var key in p_keys)
    {
        removeSessionValue(key);
    }
}

/************************************************************************
* Method: resetDataItem
* Description:  Removes the specified data item and part functions from the session dictionary
* Parameters: 
*       p_dataItem   - Processed name of the data item to remove
**************************************************************************/

function resetDataItem(p_dataItem)
{
    if(debug)
        alert("resetDataItem: Resetting data item " + p_dataItem);
        
    var zapKeys = new Array();
    zapKeys[p_dataItem] = p_dataItem;
    for (var key in parent.sessionDictionary)
    {
        if (key != p_dataItem && key.indexOf(p_dataItem) == 0)
        {
            var theBitAfter = key.substring(p_dataItem.length);
            if  ( MATCH_PART_FUNCTIONS.exec(theBitAfter))
            {
                zapKeys[key]=key;
            }
        }
    }
    removeSessionValues(zapKeys);
}

/************************************************************************
* Method: resetDataGroup
* Description:  Removes the specified data group from the session dictionary
* Parameters: 
*       p_dataGroup   - Processed group name of the data group to remove - must end with a processed subscript!
**************************************************************************/

function resetDataGroup(p_dataGroup)
{
    if(debug)
        alert("resetDataGroup: Resetting data group " + p_dataGroup);

    var zapKeys = new Array();
    for (var key in parent.sessionDictionary)
    {
        if (key.indexOf(p_dataGroup) == 0)
        {
            zapKeys[key]=key;
        }
    }

    removeSessionValues(zapKeys);
    
    // If p_dataGroup = A[4].B[5] we want parentGroup as A[4].B[ - i.e. including open bracket ..
    var parentGroup = p_dataGroup.substring(0,p_dataGroup.lastIndexOf("[")+1);
    var parentLength = parentGroup.length;
    var deletedInstance = parseInt(p_dataGroup.substring(p_dataGroup.lastIndexOf("[")+1, p_dataGroup.lastIndexOf("]")));

    var newDict=new Array(); 
    zapKeys = new Array();
    for (var key in parent.sessionDictionary)
    {
        if (key.indexOf(parentGroup) == 0)
        {
            var closeBracket=key.indexOf("]", parentLength);
            var instance = parseInt(key.substring(parentLength, closeBracket));
            if (instance < deletedInstance) continue;

            instance--;
            var newKey = parentGroup + instance + key.substring(closeBracket);            
            newDict[newKey] = parent.sessionDictionary[key];
            zapKeys[key]=key;
        }
    }

    removeSessionValues(zapKeys);

    for (var newKey in newDict)
    {
        parent.sessionDictionary[newKey] = newDict[newKey];    
    }
}

function evaluateResetDataUndo(type, name, value)
{
	if (type == 'data group instance')
	{
		parent.dataGroupInstances[name] = value;
		parent.dataGroupInstancesValid[name] = true;
	}
}

/************************************************************************
* Method: resetPageDataItem
* Description:  Resets session data for a given data item if the data item's field isn't read-only.  All instances of data items containing [C] or [A] will be reset (so if you really only want to reset the current instance, call processName() on your data item before calling this method!).
* 
**************************************************************************/
function resetPageDataItem(diName,resetPhase)
{
	try
	{
		var di = diName.replace(/\[[aAc]+]/g, "[C]");
		var instanceInd = di.indexOf("[C]");
		if (instanceInd > 0)
		{
			var di1 = di.substring(0,instanceInd);
			var di2 = di.substring(instanceInd + 3);
			var maxInstances = parent.dataGroupMaxInstances[di1.replace(/\[[0-9]+]/g, "[1]")];
			for (var j=1; j <= maxInstances ; j++)
			{
				di = (di1 + "[" + j + "]" + di2);
				resetPageDataItem(di,resetPhase);
			}
		}
		else
		{			
			//NB: we have to check the read-only status of the field before deciding whether or not to reset the data item.  We cannot use the readOnlyObjects array to check the read-only status because this is only constructed for the current page and we may be dealing with a page section which hasn't yet been loaded and therefore for which readOnlyObjects array hasn't been set up.
			//We therefore need to check the read-only status by going back to the original arrays of static read-only objects (getNodeReadOnly()) and dynamic read-only objects (parent.questionState).
				
			//Split 'diName' into data-item name and field id
			var parts = diName.split("|");
			di = parts[0];
			var id = removeSuffixOrPrefixFromId(parts[1]);
			//Get static read-only status of field using its id
			var readOnly = getNodeReadOnly(id);
			var readOnlyStateObj;
			//Get process name and phase name of phase being reset
			parts = resetPhase.split("_");
			//Get dynamic read-only status of field (if any)
			if ((readOnlyStateObj = parent.questionState["phase_" + resetPhase]) != null)
			{
				readOnly = fieldIsReadOnly(readOnly, readOnlyStateObj.state, readOnlyStateObj.ignoreCurrentState);
			}
			else if ((readOnlyStateObj = parent.questionState["process_" + parts[0]]) != null)
			{
				readOnly = fieldIsReadOnly(readOnly, readOnlyStateObj.state, readOnlyStateObj.ignoreCurrentState);
			}
			else if (parent.questionState[id] != null)
			{
				readOnly = parent.questionState[id];
			}
			//If field isn't going to be read-only, reset the session data value
			if (! readOnly)
			{
				setSessionValue(di,"");
			}
		}
	}catch(ex)
	{
	}
}

function offlineQuestionAction(que, elemId, p_valMand, namespace, controllerName, context, disableInput, event, rowId, id)
{
	//We should only trigger questions on a date if all its parts have values.  
	var elem = document.getElementById(elemId);
	if (elem == null || ! datePartsComplete(elem))
	{
		return;
	}

	namespace = "";
	var oldVal = getVariable(namespace, "focusValue" + elemId);
	if (!oldVal) oldVal = focusValue;
	setVariable(namespace, "focusValue" + elemId, '');
	var newVal = elemId + getElementValue(elem);
	if (newVal != null)
		setVariable(namespace, "focusValue" + elemId, newVal);

	var src;
	if(event)
		src =  event.srcElement;
	else
		src = elem;


	if (src && questionIsValid(namespace, elem) && (oldVal != newVal))
	{
		que = que.replace(' ', '');
        //Store the question's data group instance.
		var name = src.name;
		var openBracket = name.indexOf("[");
		var closeBracket = name.indexOf("]");
		if (openBracket > 0)
		{
			var propGroupName = name.substring(0, openBracket);
			var instance = name.substring(openBracket + 1, closeBracket);
			parent.dataGroupInstances[propGroupName] = instance;
			parent.dataGroupInstancesValid[propGroupName] = true;
			//buttonClickedOffline('__' + que, false, rowId, namespace, false, id, true);

			var page = parent.CURRENT_PAGE;
			var actionCommand = que;
			if (actionCommand.indexOf(" ") > 0)
			{
				actionCommand = actionCommand.replace(/\s+/g, "");
			}
			updateUserValues();
			update(actionCommand);
		}
	}
}

/************************************************************************
* Method: evaluateExpression
* Description:  Evaluates an expression and returns the result to a named data item
* 
**************************************************************************/
function evaluateExpression()
{
	if (parent.returnLastResultMode){return;}
    var exp = arguments[0];
	var diToSet = arguments[1];
    exp = tokenReplace(exp, false);

    var result = eval(exp); // could be used jsep.eval(exp);

    if (debug)
        alert("EVALUATE EXPRESSION RULE: Evaluating expression " + exp + ". Result is " + result);
    setSessionValue(diToSet, result);
}

/********************************************************
*                                                       *
*               EVALUATION RULES                        *
*                                                       *
*********************************************************/



/************************************************************************
* Method: evaluateEvaluate
* Description:  This runs the evaluate rules....
* 
**************************************************************************/
function evaluateEvaluate()
{
	if (parent.returnLastResultMode)
	{
		return parent.lastEvaluateResult;
		parent.lastEvaluateResult = null;
	}
    var val1 = arguments[0];
    val1 = tokenReplace(val1, true, false, true);

	//replace AND's with && and OR's with ||
	var index = val1.indexOf(" AND ");
	while (index >= 0)
	{
		val1 = val1.substring(0, index) + " && " + val1.substring(index + 5);
		index = val1.indexOf(" AND ");
	}

	index = val1.indexOf(" OR ");
	while (index >= 0)
	{
		val1 = val1.substring(0, index) + " || " + val1.substring(index + 4);
		index = val1.indexOf(" OR ");
	}

    if (debug)
       alert("EVALUATE RULE: Evaluating expression " + val1 + ".");
    var result = jsep.eval(val1);
    if (debug)
		alert("Result is " + result);
    repeatState = result;
    parent.lastEvaluateResult = result;  //Store result as may need it later in returnLastResultMode.
    return result;
}

/************************************************************************
* Method: evaluateGroupIncrementor
* Description:  This tries to increment a data group.  If it can be incremented
*               i.e. it was less than its max value, the rule returns true,
*               otherwise the rule returns false.
* 
**************************************************************************/
function evaluateGroupIncrementor()
{
	if (parent.returnLastResultMode)
	{
		return parent.lastGroupIncrementorResult;
		parent.lastGroupIncrementorResult = null;
	}
    var groupName = arguments[0];
    var type = arguments[1];
    var amount = arguments[2];
    var undoRequired = arguments[3];
    if (undoRequired == null || undoRequired == "") undoRequired = "Y";
    var result;

    if (type == null)
    {
        type = "++";
    }
    if (amount == null)
    {
        amount = "1";
    }
    
    groupName = processPGName(groupName);

    var instance = parent.dataGroupInstances[groupName];
    if (instance == null || instance=="undefined" || instance == "0")
    {
        instance = "1";
        parent.dataGroupInstances[groupName] = "1";
		parent.dataGroupInstancesValid[groupName] = false; // indicate that 1 has been set as a default - incrementor does not increment an invalid 1, but
												// rather sets instance to 1 and makes it valid;

    }   
    var intInstance = parseInt(instance);

    if (debug)
    {
        alert("GROUP INCREMENTOR RULE: Current group instance for " + groupName + " is " + intInstance);
    }
    
    //check against max instances....
    var maxInstances = getMaxInstances(groupName);
    var intMaxInstances = parseInt(maxInstances,10);
    var intIncrease = parseInt(amount,10);

    if (type == "++" && (intInstance + intIncrease) > intMaxInstances)
    {
        if (debug)
            alert("GROUP INCREMENTOR RULE: Failed to increment group instance for " + groupName);
        result = false;
    }
    else if (type != "++" && (intInstance - intIncrease) < 1)
    {
        if (debug)
            alert("GROUP INCREMENTOR RULE: Failed to decrement group instance for " + groupName);
        result = false;
    }
    else
    {
		//if instance is invalid, we set to a valid instance of 1...
		if (!parent.dataGroupInstancesValid[groupName])
		{
			intInstance = 1;
		}
        else if (type == "++")
        {
            intInstance = intInstance + intIncrease;
        }
        else
        {
            intInstance = intInstance - intIncrease;
            if (intInstance < 1)
            {
                intInstance = 1;
            }
        }

        parent.dataGroupInstances[groupName] = "" + intInstance;
		parent.dataGroupInstancesValid[groupName] = true;
        if (debug)
        {
            alert("GROUP INCREMENTOR RULE: Incremented group instance for " + groupName + " by " + intIncrease + " to " + intInstance);
        }
		if (undoRequired == "Y")
		{
	        if (debug)
	        {
            alert("GROUP INCREMENTOR RULE: Adding undo rule");
        }
        undoRules += "evaluateGroupIncrementorUndo('" + groupName + "', '" + type + "', '" + amount + "');^";
	    }    
        result = true;
    }
    parent.lastGroupIncrementorResult = result;
    repeatState = result;
    return result;
}

/************************************************************************
* Method: evaluateGroupIncrementorUndo
* Description:  This is called when the user goes back, if the rule previously
*               incremented a group instance value.
* 
**************************************************************************/
function evaluateGroupIncrementorUndo()
{
    var groupName = arguments[0];
    var origType = arguments[1];
    var origAmount = arguments[2];
    if (origAmount == null || origAmount == "") origAmount = "1";
    var intAmount = parseInt(origAmount);

    groupName = processPGName(groupName);

    var instance = parent.dataGroupInstances[groupName];
    var intInstance = parseInt(instance);


    if (origType == "++")
    {
        intInstance = intInstance - intAmount;
        if (intInstance < 1)
        {
            intInstance = 1;
        }
    }
    else
    {
        intInstance = intInstance + intAmount;
    }
    if (debug)
    {
        alert("UNDO GROUP INCREMENTOR RULE: Changing group instance for " + groupName + " to " + intInstance);
    }
    parent.dataGroupInstances[groupName] = "" + intInstance;
	parent.dataGroupInstancesValid[groupName] = true;
}

/************************************************************************
* Method: evaluateIncrementor
* Description:  This is the 'advanced' incrementor, and can inrement anything!
* 
**************************************************************************/
function evaluateIncrementor()
{
	if (parent.returnLastResultMode)
	{
		return parent.lastIncrementorResult;
		parent.lastIncrementorResult = null;
	}
    var type = arguments[0];
    var direction = arguments[1];
    var name = processName(arguments[2]);
    var amount = arguments[3];
    if (amount == null || amount == "") amount = "1";
    var undoRequired = arguments[4];
    if (undoRequired == null || undoRequired == "") undoRequired = "Y";

    var retVal = true;
    if (type == "Data Group Instance")
    {
        if (direction == "Increment")
        {
            //will automatically create undo rule
            retVal = evaluateGroupIncrementor(name, "++", amount, undoRequired);
        }
        else
        {
            retVal = evaluateGroupIncrementor(name, "--", amount, undoRequired);
        }
    }
    else if (type == "Data Item")
    {
		var propType = getPropertyAttribute(name,parent.DATA_TYPE_KEY);
        var currentVal = getSessionValue(name);
        if (currentVal == null || currentVal.length == 0)
        {
            currentVal = 0;
        }

        if (direction == "Increment")
        {
			if (propType == "Date")
			{
				var currentVal = rollDate(name, currentVal, amount, direction, DAY_FN);
			}
			else
			{
                currentVal = parseInt(currentVal) + parseInt(amount);
			}
			if (undoRequired == "Y")
			{
            undoRules += "evaluateIncrementorUndo('" + name + "', '++', '" + amount + "','" + type + "');^";
        }
        }
        else
        {
			if (propType == "Date")
			{
				var currentVal = rollDate(name, currentVal, amount, direction, DAY_FN);
			}
			else
			{
                currentVal = parseInt(currentVal) - parseInt(amount);
			}
			if (undoRequired == "Y")
			{
            undoRules += "evaluateIncrementorUndo('" + name + "', '--', '" + amount + "','" + type + "');^";
        }
        }
        setSessionValue(name, "" + currentVal);
        retVal = true;
    }
    else if (type == "Variable")
    {
        var currentVal = getSessionVariable(name);
        if (currentVal == null || currentVal.length == 0)
        {
            currentVal = 0;
        }

        if (direction == "Increment")
        {
            currentVal = parseInt(currentVal) + parseInt(amount);
			if (undoRequired == "Y")
			{
            undoRules += "evaluateIncrementorUndo('" + name + "', '++', '" + amount + "','" + type + "');^";
        }
        }
        else
        {
            currentVal = parseInt(currentVal) - parseInt(amount);
			if (undoRequired == "Y")
			{
            undoRules += "evaluateIncrementorUndo('" + name + "', '--', '" + amount + "','" + type + "');^";
        }
        }
        setSessionVariable(name, "" + currentVal);
        retVal = true;
    }
    parent.lastIncrementorResult = retVal;
    return retVal;
}

/************************************************************************
* Method: evaluateIncrementorUndo
* Description:  This is called when the user goes back, if the rule previously
*               incremented a group instance value.
* 
**************************************************************************/
function evaluateIncrementorUndo()
{
    var propName = arguments[0];
    var origDir = arguments[1];
    var origAmount = arguments[2];
	var type = arguments[3];

	var propType = getPropertyAttribute(propName,parent.DATA_TYPE_KEY);
	var currentVal;
	if (type == "Data Item")
		currentVal = getSessionValue(propName);   
	else if (type == "Variable")
		currentVal = getSessionVariable(propName);

    if (origDir == "++")
    {
		if (propType == "Date")
			currentVal = rollDate(propName, currentVal, origAmount, "Decrement", DAY_FN);
		else
            currentVal = parseInt(currentVal) - parseInt(origAmount);
    }
    else
    {
		if (propType == "Date")
			currentVal = rollDate(propName, currentVal, origAmount, "Increment", DAY_FN);
		else
            currentVal = parseInt(currentVal) + parseInt(origAmount);
    }

    if (debug)
    {
        alert("UNDO INCREMENTOR RULE: Changing group instance for " + propName + " to " + currentVal);
    }

	if (type == "Data Item")
		setSessionValue(propName, "" + currentVal);
	else if (type == "Variable")
		setSessionVariable(propName, "" + currentVal);
}


/************************************************************************
* Method: evaluateRepeat
* Description:  This rule will repeatably run all of its true rules until 
*               one of them returns false.
*               Upon completion this rule's false rules will be run.
* 
**************************************************************************/
var repeatState = true;

/************************************************************************
* Method: setRepeatState
* Description:  Sets the global repeat state to the specified value
* Parameters: 
*       p_repeatState   - true/false value to set
**************************************************************************/
function setRepeatState(p_repeatState)
{
   repeatState = p_repeatState;
}

function evaluateRepeat()
{
	if (parent.returnLastResultMode)
	{
		return parent.lastRepeatResult;
	}
	var args = arguments;
	var type = args[0];
	if (type == 'RUN_RULES')
	{
		parent.lastRepeatResult = repeatState;
		return repeatState;
	}
	else if (type == 'DATA_GROUP')
	{
		//this handles the if evaluateRepeat, which the xsl still generates...
		if (args.length == 1)
		{
			return true;
		}

		var dg = args[1];
		var start = tokenReplace(args[2]);
		var end = tokenReplace(args[3]);
		var inc = args[4];
		var restore = args[5];
		var callCount = args[6];
		var groupName = processPGName(dg);
		if (callCount == 0)
		{
			if (parseInt(start) > parseInt(end))
				return false;
			else
			{
				parent.dataGroupInstances[groupName] = start;
				parent.dataGroupInstancesValid[groupName] = true;
				return true;
			}
		}
		else
		{
			//no other parameters sent on the if()s for in each child rule of repeat.
			// in this case (ie. repeating over data group) we carry on as normal).
			if (dg == null) return true;
			var currentInstance = parent.dataGroupInstances[groupName];
			//see if we can increment...
			var nextInstance = parseInt(currentInstance) + parseInt(inc);
			if (nextInstance <= parseInt(end))
			{
				parent.dataGroupInstances[groupName] = "" + nextInstance;
				return true;
			}
			else
			{
				if (restore == "Y")
				{
					parent.dataGroupInstances[groupName] = start;
					parent.dataGroupInstancesValid[groupName] = true;
				}
				return false;
			}

		}
	}
	else
	{
		alert("Repeat type unknown: " + type);
	}

}

/************************************************************************
* Method: evaluateContainer
* Description:  This is just a convenient place holder for a set of rules.
*               Note, only true rules will ever get run.
* 
**************************************************************************/
function evaluateContainer()
{
	if (parent.returnLastResultMode)
	{
		return parent.lastContainerResult;
	}
	parent.lastContainerResult = true;
    return true;
}

/************************************************************************
* Method: evaluateSetQuestionInError
* Description:  Sets the question in error.
* 
**************************************************************************/
function evaluateSetQuestionInError()
{
	var message = arguments[0];
	var errId = getVariable('', "CURRENT_FOCUS") + "_ERRORMESSAGE";
	var err = document.getElementById(errId);
	if (err)
	{
		err.innerHTML = message;
		err.style.display = "";
		pageErrors[errId] = "Y";
	}
}

/************************************************************************
* Method: evaluateAddToList
* Description:  Adds a list value (or values if from a csv) to a dataitem.
* 
**************************************************************************/
function evaluateAddToList()
{
	if (parent.returnLastResultMode)
	{
		return parent.lastAddToListResult;
	}
	var result = true;
    var type = arguments[0];
	var reset;
	var resetList = false;

	if (type == "Single")
	{
		var toType = arguments[1];
		reset = arguments[9];
		if (reset && reset == "Y")
		{
			resetList = true;
		}
		
		var toName = "";
		if (toType == "Data Item")
		{
			toName = processName(arguments[2]);
			//parent.removeSessionListValue(toName);
		}
		else if (toType == "List")
		{
			toName = arguments[2];
			if (toName.indexOf(" List") == toName.length - 5)
			{
				toName = toName.substring(0, toName.length - 5);
				
				toName = toName.toUpperCase();
			}
			else
			{
				result = false;
			}
		}
		if (result)
		{
		    var kType = arguments[3];
		    var vType = arguments[4];
		    var gType = arguments[5];
		    var keyArray = splitstring(arguments[6], ",", false);
			var valueArray = new Array();
			if (arguments[7].indexOf("\"") == 0)
			{
				valueArray.push(arguments[7].substring(1, arguments[7].length-1));
			}
			else
			{
				valueArray = splitstring(arguments[7], ",", false);
			}
		    var groups = null;
		    var groupArg = arguments[8];
		    if (groupArg != null && groupArg.length > 0)
		    {
		        groups = splitstring(groupArg, ",", false);
		    }
		    for(var i=0; i < keyArray.length && i < valueArray.length && (groups == null || i < groups.length); i++)
		    {
		        var keyPart   = new ListPart(kType, keyArray[i]);
		        var valuePart = new ListPart(vType, valueArray[i]);
		        var groupPart = null;
		        if (groups != null) groupPart = new ListPart(gType, groups[i]);
		        else groupPart = new ListPart(null, null);
		        if (keyPart.multi && valuePart.multi)
		        {
		            var listKeyToAdd = null; var listValueToAdd = null; var listGroupToAdd = ""; 
		            while(true)
		            {
		                if (keyPart.anyMoreInstances() && valuePart.anyMoreInstances())
                        {
                            if (keyPart.multiInstance)
                            {
                                // dealing with property groups here
								var groupName = processPGName(keyPart.propertyGroupName);
                                parent.dataGroupInstances[groupName] = keyPart.startInstance;
								parent.dataGroupInstancesValid[groupName] = true;
                                listKeyToAdd = keyPart.getValue();
                            }
                            else
                            {
                                listKeyToAdd = "" + keyPart.startInstance;
                            }
                            
                            if (valuePart.multiInstance)
                            {
                                // dealing with property groups here
								var groupName = processPGName(valuePart.propertyGroupName);
                                parent.dataGroupInstances[groupName] = valuePart.startInstance;
								parent.dataGroupInstancesValid[groupName] = true;
                                listValueToAdd = valuePart.getValue();
                            }
                            else
                            {
                                listValueToAdd = "" + valuePart.startInstance;
                            }
                           
                            if (groupPart.type != null)
                            {
                                if (groupPart.multiInstance)
                                {
                                    // dealing with property groups here
									var groupName = processPGName(groupPart.propertyGroupName);
                                    parent.dataGroupInstances[groupName] = groupPart.startInstance;
									parent.dataGroupInstancesValids[groupName] = true;
                                    listGroupToAdd = groupPart.getValue();
                                }
                                else
                                {
                                    listGroupToAdd = "" + groupPart.startInstance;
                                }
                            }
                           
                            if ((listKeyToAdd != null) && (listValueToAdd != null))
                            {
								parent.addSessionListValue(toName, listKeyToAdd, listValueToAdd, listGroupToAdd, resetList);
                            }
                            keyPart.nextInstance();
                            valuePart.nextInstance();
                            groupPart.nextInstance();
                        }
                        else
                        {
                            break;
                        }
		               
		            }
		            if (keyPart.multiInstance)
                    {
						var groupName = processPGName(keyPart.propertyGroupName);
                        parent.dataGroupInstances[groupName] = keyPart.initialPropertyGroupInstance;
						parent.dataGroupInstancesValid[groupName] = true;
                    }
		            if (valuePart.multiInstance)
                    {
						var groupName = processPGName(valuePart.propertyGroupName);
                        parent.dataGroupInstances[groupName] = valuePart.initialPropertyGroupInstance;
						parent.dataGroupInstancesValid[groupName] = true;
                    }
		            if (groupPart.multiInstance)
                    {
						var groupName = processPGName(groupPart.propertyGroupName);
                        parent.dataGroupInstances[groupName] = groupPart.initialPropertyGroupInstance;
						parent.dataGroupInstancesValid[groupName] = true;
                    }
		        }
		        else
		        {
					// single key value 
					parent.addSessionListValue(toName, tokenReplace(keyPart.getValue()), tokenReplace(valuePart.getValue()), tokenReplace(groupPart.getValue()), resetList);
		        }		        
		    }
		}
	}
	else if (type == "Import")
	{
		var toType = arguments[1];
		var filename = arguments[3];
		filename = tokenReplace(filename);
		reset = arguments[4];

		if (reset && reset == "Y")
		{
			resetList = true;
		}
		if (toType == "Data Item")
		{
			toName = processName(arguments[2]);
		}
		else if (toType == "List")
		{
			toName = arguments[2];
			if (toName.indexOf(" List") == toName.length - 5)
			{
				toName = toName.substring(0, toName.length - 5);
			}
		}
		var adodbStream = new ActiveXObject('Adodb.Stream');  
		adodbStream.Open;
		adodbStream.Type = 2;  
		adodbStream.Charset = 'UTF-8';  
		adodbStream.loadFromFile(filename);
		
		var name="";
		var value="";
		var split=-1;

		var lineCount = 0;
		while (! adodbStream.EOS)
		{       
			line = trim(adodbStream.ReadText(-2));
			lineCount++;
			if (line.length > 0)
			{
				split = line.indexOf(",");
				if (split > -1)
				{
					var partsArray = splitstring(line, ",", false);
					if (partsArray.length == 2)
					{
						partsArray.push("");
					}
					//'resetList' argument should only be set on the first of the imported list items.
					if (lineCount == 1)
					{
						parent.addSessionListValue(toName.toUpperCase(), partsArray[0], partsArray[1], partsArray[2], resetList);
					}
					else
					{
						parent.addSessionListValue(toName.toUpperCase(), partsArray[0], partsArray[1], partsArray[2], false);
					}
				}
			}
		}
	}
	parent.lastAddToListResult = result;  //Store result as may need it later in returnLastResultMode.
	repeatState = result;
	return result;
}


/************************************************************************
* Object: ListPart
* Description:  object to store stuff about the key value or group being processed
* 
**************************************************************************/
    function ListPart(type, value)
    {       
       this.getValue = function()
           {
                var value = "";
		        if (this.type != null && this.value != null && this.type == 'Data Item')
			   {
					value = "$$" + processName(this.value) + "$";
			   }
		        else if (this.type != null && this.value != null && this.type == 'Variable') value = "$$!" + this.value + "$";
		        else value = (this.value == null) ?"":this.value;
                return value;
           }

       this.anyMoreInstances = function()
           {
               return ((this.incrementInstance && (this.startInstance <= this.endInstance)) 
                       ||      
                       (!this.incrementInstance && (this.startInstance >= this.endInstance)));
           }
           
       this.nextInstance = function()
           {
               if (this.incrementInstance)
               {
                    this.startInstance++;
               }
               else
               {
                   this.startInstance--;
               }              
           }
       
           this.multi = false;
           this.multiInstance = false;
           this.startInstance = 1;
           this.endInstance = 1;
           this.propertyGroupName = null;
           this.type = type;  
           this.initialPropertyGroupInstance = null; 
           this.incrementInstance = true;    
           this.value = value;
           if (type != null && type == 'Data Item' && value != null && value.indexOf("[A]") > 0)
		   {  
		        var index = value.indexOf("[A]");
		        this.propertyGroupName = value.substring(0, index);
                // now we need to change the property name to [C]
                this.value = value.substring(0, index) + "[C]" + value.substring(index + 3);
                this.endInstance = getLastInstance(this.propertyGroupName);
                this.startInstance = 1;
                this.multiInstance = true; 
                this.multi = true;
		   }
		   else if(type != null && type == 'Data Item' && value != null && value.indexOf("...") > -1)
		   {
		        var index = value.indexOf("...");		        
                var propertyGroupName = value.substring(0, index);
                // now we need to find the property group and the start instance
                var startInstanceIndex = propertyGroupName.lastIndexOf("[");
                var startInstance = propertyGroupName.substring(startInstanceIndex + 1);
                this.startInstance = (startInstance == "") ? 1 :parseInt(startInstance, 10);
                this.propertyGroupName = propertyGroupName.substring(0, startInstanceIndex);               
                var endInstance = value.substring(index);
                var endInstanceIndex = endInstance.indexOf("]");
                endInstance = endInstance.substring(3, endInstanceIndex);
                var maxGroupInstance = getMaxInstances(propertyGroupName);               
                this.endInstance = (endInstance == "") ? maxGroupInstance :parseInt(endInstance, 10);
                // now we need to change the property name to [C], rather than [m...n]
                this.value = value.substring(0, startInstanceIndex) + "[C]" + value.substring(index + endInstanceIndex + 1);
                this.multiInstance = true;
                this.multi = true;		        
		   }
		   else if (value != null && value.indexOf("...") > -1)
		   {
		       var multiIndex = value.indexOf("...");
               if (multiIndex > -1)
               {
                   var startString = value.substring(0, multiIndex).replace(/^\s+|\s+$/g,"");
                   var endString = value.substring(multiIndex + 3).replace(/^\s+|\s+$/g,"");
                   if (type == "Data Item")     this.startInstance = parseInt(getSessionValue(startString), 10);   
	               else if (type == "Variable") this.startInstance = parseInt(getSessionVariable(startString), 10);
				   else this.startInstance = parseInt(tokenReplace(startString), 10);
	               
	               if (type == "Data Item")     this.endInstance = parseInt(getSessionValue(endString), 10);   
	               else if (type == "Variable") this.endInstance = parseInt(getSessionVariable(endString), 10);
	               else this.endInstance = parseInt(tokenReplace(endString), 10);

                   this.multi = true;
               }		       
		   } 
		   
		   if (this.multi)
		   {
		       this.incrementInstance = (this.endInstance >= this.startInstance);
		       
		       this.initialPropertyGroupInstance = 1;
               if (this.multiInstance)
               {
                   this.initialPropertyGroupInstance = parent.dataGroupInstances[processPGName(this.propertyGroupName)];
                   if (this.initialPropertyGroupInstance < 1)
                       this.initialPropertyGroupInstance = 1;
               }		   
		   }
    }


//overridden from connect_ajax, to make sure it never thinks it is doing an ajax call.
function incQ(namespace)
{
    setVariable(namespace, "AJAX_QUEUE", 0);
}


