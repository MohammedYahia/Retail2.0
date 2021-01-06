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

//Data attribute keys
var DATA_TYPE_KEY = "Type";
var DEC_PLACES_KEY = "DP";
var ROUNDING_KEY = "Rounding";
var DECIMAL_SYMBOL_KEY = "DecimalSymbol";
var LIST_NAME_KEY = "ListName";

//Data attribute values
var ROUND_UP_VAL = "Round Up";
var ROUND_DOWN_VAL = "Round Down";
var ROUND_NEAREST_UP_VAL = "Round Nearest (Up)";
var ROUND_NEAREST_DOWN_VAL = "Round Nearest (Down)";
var ROUND_UNCHANGED_VAL = "Leave Unchanged";

var GLOBAL_VARS_FILE = "html/js/connect_offline_global_variables.dat";

var APP_FORM = null;
var CALLBACK_OBJECT = null;
var CURRENT_PAGE = null;
var globalVariables = new Array();
var tempSessionVariables = new Array();

var pageStates = null;
var navRoute = null;
var navIndex = 0;
var navInsertIndex = 1;
var navPageSections = null;
var resetPageSections = null;
var jumpIndex = -1;
var sessionDictionary = null;
var dataDictionary = null;
var customTypes = null;
var listDictionary = null;
var sessionVariables = null;
var dataGroupInstances = null;
var dataGroupInstancesValid = null;
var dataGroupMaxInstances = null;
var questionState = null;
var undoRulesStack = null;
var processReadOnly = false;
var sessionListValues = null;
var questionMandatoryState = null;
var processMandatory = false;
var currentProcess = null;
var currentPhase = null;
var phaseDataItems = null;
var phaseTableDataItems = null;
var returnLastResultMode = false;  //Flag indicating whether to run rule contents or simply to return the previous true/false result.
var remainingRules = null;

//Store for results returned by evaluate rules
var lastEvaluateResult = null;
var lastGroupIncrementorResult = null;
var lastIncrementorResult = null;
var lastRepeatResult = null;
var lastContainerResult = null;
var lastAddToListResult = null;

function initOfflineSession()
{
	pageStates = new Object();
    navRoute = new Array();
    navIndex = 0;
    navInsertIndex = 1;
    navPageSections = new Array();
    resetPageSections = new Array();
    jumpIndex = -1; 
    sessionDictionary = new Array();
    dataDictionary = new Array();
	customTypes = new Array();
    listDictionary = new Array();
//    globalVariables = new Array();
    sessionVariables = new Array();
    dataGroupInstances = new Array();
	dataGroupInstancesValid = new Array();
    dataGroupMaxInstances = new Array();
    questionState = new Array();
    undoRulesStack = new Array();
    processReadOnly = false;
//  APP_FORM = null;
    sessionListValues = new Array();
    questionMandatoryState = new Array();
    processMandatory = false;
    currentProcess = ''; 
    currentPhase = ''; 
    phaseDataItems = new Array();
    phaseTableDataItems = new Array();
    returnLastResultMode = false;
    remainingRules = null;
    lastEvaluateResult = null;
    lastGroupIncrementorResult = null;
    lastIncrementorResult = null;
    lastRepeatResult = null;
    lastContainerResult = null;
    lastAddToListResult = null;
}

/************************************************************************
* Object: fieldState
* Description:  Stores the field read only / mandatory state and whether or not to ignore the existing field state.
* 
**************************************************************************/
function fieldState(state, ignoreCurrentState,mandMessage)
{
	this.state = state;
	this.ignoreCurrentState = ignoreCurrentState;
	this.mandMessage = mandMessage;
}

/************************************************************************
* Object: pageWithSections
* Description:  For a page split into sections with page breaks, stores the total number of sections and an index denoting the current section.
* 
**************************************************************************/
function pageWithSections(numSections,sectionIndex)
{
	this.numSections = numSections;
	this.sectionIndex = sectionIndex;
}

function rule(ruleSet, ruleName)
{
	this.ruleSet = ruleSet;
	this.ruleName = ruleName;
}

function getSessionListValues(p_di)
{
	var currentValues = sessionListValues[p_di];
	if (currentValues == null)
	{
		currentValues = new Array();
		sessionListValues[p_di] = currentValues;
	}
	return currentValues;
}


function addSessionListValue(p_di, p_key, p_value, p_groupValue, p_resetList)
{
	var currentValues = sessionListValues[p_di];
	if (currentValues == null)
	{
		currentValues = new Array();
		sessionListValues[p_di] = currentValues;
	}

	for (var i = 0;  i < currentValues.length;  i++)
	{
		var listValue = currentValues[i];
		if (listValue.key == p_key)
		{
			//key already exists, so do nothing...
			return;
		}
	}
	var listValue = new ListValue(p_key, p_value, p_groupValue, p_resetList);
	currentValues.push(listValue);
}

function removeSessionListValue(p_di)
{
	delete sessionListValues[p_di];
}

function getListDictionaryValues(p_di)
{
	var currentValues = listDictionary[p_di];
	if (currentValues == null)
	{
		currentValues = new Array();
		listDictionary[p_di] = currentValues;
	}
	return currentValues;
}

function addListDictionaryValue(p_di, p_key, p_value, p_groupValue)
{
	var currentValues = listDictionary[p_di];
	if (currentValues == null)
	{
		currentValues = new Array();
		listDictionary[p_di] = currentValues;
	}

	for (var i = 0;  i < currentValues.length;  i++)
	{
		var alistValue = currentValues[i];
		if (alistValue.key == p_key)
		{
			//key already exists, so do nothing...
			return;
		}
	}
	var listValue = new ListValue(p_key, p_value, p_groupValue);
	currentValues.push(listValue);
}

function removeListDictionaryValue(p_di)
{
	delete listDictionary[p_di];
}

function ListValue(p_key, p_value, p_groupValue, p_resetList)
{
	this.key = p_key;
	this.value = p_value;
	this.groupValue = p_groupValue;
	this.resetList = p_resetList;
}

function setCurrentProcess(p_name)
{
	currentProcess = p_name;
}

function setCurrentPhase(p_name)
{
	currentPhase = p_name;
}

function getCurrentProcess()
{
	return currentProcess;
}

function getCurrentPhase()
{
	return currentPhase;
}

function getCurrentProcessAndPhase()
{
	return currentProcess + '_' + currentPhase;
}

function addPageState(pageName, pageState)
{
	pageStates[pageName] = pageState;
}

function getPageState(pageName)
{
	if (pageStates[pageName])
	{
		return pageStates[pageName];
	}
	else
		return null;
}

/************************************************************************
* Method: loadGlobalVarsFile
* Description:  Read global variables from file to globalVariables array
* 
**************************************************************************/
function loadGlobalVarsFile()
{
	var adodbStream = new ActiveXObject('Adodb.Stream');  
    adodbStream.Open;
    adodbStream.Type = 2;  
    adodbStream.Charset = 'UTF-8';  
    adodbStream.loadFromFile(GLOBAL_VARS_FILE);
    var name="";
    var value="";
    var split=-1;

    var lineCount = 0;
    while ((adodbStream != null) && (! adodbStream.EOS))
    {
        var line = adodbStream.ReadText(-2);
        lineCount++;
        if (line.length > 0)
        {
            split = line.indexOf("=");
            if (split > -1)
            {
                name = line.substring(0,split);
                value = line.substring(split + 1);
                //put(name,value);
				globalVariables[name] = value;
            }
            else
            {
                //alert(getMsg("", "FailedLoadGlobVarsMessage", "QUESTION_CONSTRAINT=" + lineCount));
                break;
            }
        }
    }               
    adodbStream.close();
	return(true);
}

/************************************************************************
* Method: writeGlobalVarsFile
* Description:  Write global variables stored in globalVariables array to file
* 
**************************************************************************/
function writeGlobalVarsFile()
{
    var adodbStream = new ActiveXObject('Adodb.Stream');  
    adodbStream.Open;
    adodbStream.Type = 2;  
    adodbStream.Charset = 'UTF-8';  

    for (var name in parent.globalVariables)
    {
        if (("" + name).length > 0)
            adodbStream.WriteText(name + "=" + parent.globalVariables[name], 1);
    }

    adodbStream.SaveToFile(GLOBAL_VARS_FILE, 2);
    adodbStream.close();
    return(true);
}

/************************************************************************
* Method: isIE7
* Description:  Checks whether user's browser is IE v.7.
* 
**************************************************************************/
function isIE7(userAgent)
{
	var detect = navigator.userAgent.toLowerCase();
	var isIE7Browser = false;
	var i = detect.indexOf('msie');
	if (i >= 0)
	{
		if (detect.charAt(i + 5) == '7')
		{
			isIE7Browser = true;
		}
	}
	return(isIE7Browser);
}