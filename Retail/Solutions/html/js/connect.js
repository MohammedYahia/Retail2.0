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

/* static variables for the page */
var DHTML = (document.getElementById || document.all || document.layers);
var IE4 = navigator.appName == 'Microsoft Internet Explorer' && !window.opera;
var SAFARI = navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Windows') > -1 && navigator.userAgent.indexOf('Chrome') == -1; // Safari for Windows
var FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var ANDROID = navigator.userAgent.toLowerCase().indexOf("android")  > -1;
var IOS = ( function() {
	   var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	   if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
	  {
	    return true;
	  }
	  return false;
	})();
var daysInMonth = [31,31,29,31,30,31,30,31,31,30,31,30,31];
var debug = false;
var SINGLE_CHECKBOX_PREFIX = "_";
var ENTER_KEYCODE = 13;
var TRIGGERED_REASON=[];
var SELECTALL_NAME = "|";
var SELECTOR_INDICATOR = "_Selector_";

var FORMAT_VALIDATION_TRIGGER="FORMAT_VALIDATION";
var REPLACE_CHILD_TRIGGER="REPLACE_CHILD";
var AJAX_RESPONSE_TRIGGER="AJAX_RESPONSE";
var KEY_PRESSED_TRIGGER="KEY_PRESSED";
var CHANGED_SELECTION_TRIGGER="CHANGED_SELECTION";
var SHOW_TAB_TRIGGER="SHOW_TAB";
var DEFAULT_BUTTON_ACTION_TRIGGER="DEFAULT_BUTTON_ACTION";
var CALENDAR_FOCUS_TRIGGER="CALENDAR_FOCUS_TRIGGER";
var CALENDAR_PICKER_TRIGGER="CALENDAR_PICKER_TRIGGER";

var GROUP_VALUE_FN = ".GROUPVALUE()";
var VALUE_FN = ".VALUE()";
var INSTANCE_FN = ".INSTANCE()";
var MAX_INSTANCE_FN = ".MAXINSTANCE()";
var LAST_INSTANCE_FN = ".LASTINSTANCE()";
var DISABLED_CLASS = "edgeConnectDisabled";

var DATE_TIME_PARTS = ["DATE()", "TIME()", "DAY()", "MONTH()", "YEAR()", "HOUROFDAY()", "MINUTES()", "SECONDS()"];
var DATE_TIME_SUFFIXES = [".YEAR", ".MONTH", ".DAY", ".HOUROFDAY", ".MINUTES", ".SECONDS"];

var COMPONENT_SEPARATOR = "__";
var COMP_ID_REG = new RegExp("^(C[0-9]+" + COMPONENT_SEPARATOR + ")+");
var BACKSLASH_REG = /\\/g;
var DOUBLEQUOTE_REG = /"/g;


//check if browser has speech recognition support and if there is a video on the page to be be controlled by voice
if( (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)  &&
    document.querySelectorAll('video').length > 0){
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
	var noContinuousRecognition = true;
	try {
		recognition.continuous = true;
	} catch (e){
		noContinuousRecognition = false
	};
    recognition.interimResults = false;
	try {
	    recognition.start();
	} catch (e){}

    // Process parsed result
    /*
    “video play” – plays the video
    “video stop” – stops the video
    “video replay” – returns to the start of the video and plays it
    “video volume off” – mutes the video
    “video volume on” – unmutes the video
    “video volume decrease” – decrease the video’s volume by one
    “video volume increase” – increases the video’s volume by one
     */
    recognition.onresult = function(e){

        // Define a threshold above which we are confident(!) that the recognition results are worth looking at
        var confidenceThreshold = 0.5;

        // Simple function that checks existence of s in str
        var userSaid = function(str, s) {
            return str.indexOf(s) > -1;
        }
        // Check each result starting from the last one
        for (var i = e.resultIndex; i < e.results.length; ++i) {
            // If this is a final result
               if (e.results[i].isFinal) {
                   // If the result is equal to or greater than the required threshold
                   if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
                    video = document.querySelector('video');
                       var str = e.results[i][0].transcript;
                       console.log('Recognised: ' + str);
                       // If the user said 'video' then parse it further
                       if (userSaid(str, 'video')) {
                           // Replay the video
                           if (userSaid(str, 'replay')) {
                               video.currentTime = 0;
                               video.play();
                           }
                           // Play the video
                           else if (userSaid(str, 'play')) {
                               video.play();
                           }
                           // Stop the video
                           else if (userSaid(str, 'stop')) {
                               video.pause();
                           }
                           // If the user said 'volume' then parse it even further
                           else if (userSaid(str, 'volume')) {
                               // Check the current volume setting of the video
                               var vol = Math.floor(video.volume * 10) / 10;
                               // Increase the volume
                               if (userSaid(str, 'increase')) {
                                   if (vol >= 0.9) video.volume = 1;
                                   else video.volume += 0.1;
                               }
                               // Decrease the volume
                               else if (userSaid(str, 'decrease')) {
                                   if (vol <= 0.1) video.volume = 0;
                                   else video.volume -= 0.1;
                               }
                               // Turn the volume off (mute)
                               else if (userSaid(str, 'of')) {
                                   video.muted = true;
                               }
                               // Turn the volume on (unmute)
                               else if (userSaid(str, 'on')) {
                                   video.muted = false;
                               }
                           }
                       }
                  }
               }
        }
		if (noContinuousRecognition) {
			recognition.start();
		}
    }

}


/* **** Please declare non-static variables in HtmlUtils.addStandardJavascript and use set/getVariable(ns,"var") **** */


/******************************************************************************************************************
* Functions that can be overriden as required.
* NB: If the before* functions return false then this will veto the standard actions.
******************************************************************************************************************/

function beforeInitForm(ns) { return true ; }
function afterInitForm(ns) { return true; }
function beforeButtonClicked(p_val, p_valMand, p_rowId, ns, p_scrollToButton, p_id, p_saveFormData, p_validateAllFields) { return true ; }
function afterButtonClicked(p_val, p_valMand, p_rowId, ns, p_scrollToButton, p_id, p_submitted, p_saveFormData, p_validateAllFields) {}
function beforeSubmit(ns, p_mode, p_scrollToButton, p_id) { return true ; }
function afterSubmit(ns, p_mode, p_scrollToButton, p_id) { }
function beforeChangeTab( p_tabName, ns, p_selStyle, p_tabStyle ) { return true ; }
function afterChangeTab( p_tabName, ns, p_selStyle, p_tabStyle ) { }
function beforeGoForwards(ns, p_buttonNameAndInstance) { return true ; }
function afterGoForwards(ns, p_submitted, p_buttonNameAndInstance)  { }
function beforeGoBack(ns) { return true ; }
function afterGoBack(ns, p_submitted)  { }
function beforeGoNav(ns, p_navDataItem, p_navCode) { return true ; }
function afterGoNav(ns, p_navDataItem, p_navCode, p_submitted) { }
function beforeGoNavItem(ns, itemName, mode) { return true ; }
function afterGoNavItem(ns, p_submitted, itemName, mode)  { }
function displayProcessingMessage(ns, p_document) {}

function beforeElemShown(ns, el, naType){ return true; }
function afterElemShown(ns, el, naType){}
function beforeElemHidden(ns, el, keepHeading, saveData, naType){ return true; }
function afterElemHidden(ns, el, keepHeading, saveData, naType){}


//hook to change style of element if using disabled for not applicables...
function setElementDisabled(element) {}
function setElementEnabled(element) {}

/******************************************************************************************************************
* Standard Functions
******************************************************************************************************************/
/*
** offers the same functionality as the getContentDocument from LD
** Defining it here eliminates clashes with LD functions and
** LD-connect dependency
*/
function getContentDocumentNonLD() {
	if (frames["ecContent"]) {
		if (frames["ecContent"].contentDocument)
			return frames["ecContent"].contentDocument;
		else
			return frames["ecContent"].document;
	} else {
		return document;
	}
}
function changeLang(lang){
	var form = getForm();
	var inputEl= document.createElement("input");
	form.appendChild(inputEl);
	inputEl.type="text";
	inputEl.name = inputEl.id = "LANGUAGE_MAP_REQUEST_ALIAS";
	inputEl.value = lang;
	ecSubmitForm(null, "CHANGE_LANGUAGE_MODE", null, null);
}

function addWidget(p_widget, ns, id){
	if (id == null) throw new Error("Deprecated call to addWidget parameter definitions changed.");
	if (ns == null) ns = "";
	var widgetList = getVariable(ns, "WIDGET_LIST");
	if (widgetList == null){
		widgetList = new Object();
		setVariable(ns, "WIDGET_LIST", widgetList);
	}
	widgetList[id] = p_widget + id;
}

function removeWidget(id, ns){
	if (ns == null) ns = "";
	var widgetList = getVariable(ns, "WIDGET_LIST");
	if (widgetList != null){
		var index = widgetList.indexOf(id);
		if (index > -1){
			array.splice(index, 1);
		}
	}
}

function runElemShownWidgetHooks(p_hook, ns, p_el, p_naType){
	var widgetList = getVariable(ns, "WIDGET_LIST");
	for (var widget in widgetList){
		if (this[p_hook + "ElemShown" + widgetList[widget]]){
			this[p_hook + "ElemShown" + widgetList[widget]](ns, p_el, p_naType);
		}
	}
}

function runElemHiddenWidgetHooks(p_hook, ns, p_el, p_keepHeading, p_saveData, p_naType){
	var widgetList = getVariable(ns, "WIDGET_LIST");
	for (var widget in widgetList){
		if (this[p_hook + "ElemHidden" + widgetList[widget]]){
			this[p_hook + "ElemHidden" + widgetList[widget]](ns, p_el, p_keepHeading, p_saveData, p_naType);
		}
	}
}

function runShowTabWidgetHooks(p_hook, ns, p_el){
	var widgetList = getVariable(ns, "WIDGET_LIST");
	for (var widget in widgetList){
		if (this[p_hook + "ShowTab" + widgetList[widget]]){
			this[p_hook + "ShowTab" + widgetList[widget]](ns, p_el);
		}
	}
}

function runChangeTabWidgetHooks(p_hook, ns, p_el){
	var widgetList = getVariable(ns, "WIDGET_LIST");
	var ok = true;
	for (var widget in widgetList){
		if (this[p_hook + "ChangeTab" + widgetList[widget]]){
			ok &= this[p_hook + "ChangeTab" + widgetList[widget]](ns, p_el);
		}
	}
	return ok;
}

function runWidgetAjaxHooks(p_hook, ns, p_ajaxCaller, p_result){
    var widgetList = getVariable(ns, "WIDGET_LIST");
    var ok = true;
    for (var widget in widgetList){
        try{
            var f = getObjectByPackageString(widgetList[widget] + "." + p_hook);
            if (typeof f === 'function') {
            	ok &= f(ns, p_ajaxCaller, p_result);
            }
        }
        catch (e){
        }
    }
    return ok;
}

/*
 * * Usage:
 * getObjectByPackageString("window.com.temenos.widgets.social.facebook.postProcessResponses") *
 * return postProcessResponses object or function ..
 */
function getObjectByPackageString(packageName)
{
    var i= 0,currentProp,obj=window;
    while (obj && (currentProp=(packageName.split("."))[i++]) )
    {
        obj=obj[currentProp];
    }
    return obj;
}


function isFormProcessing(ns, p_object, p_function, p_args)
{
    var inQ = getVariable(ns, "AJAX_QUEUE", 0 );
    if  ( inQ > 0 )
    {
        var func = function() { p_function.apply(p_object, p_args); };
        setVariable(ns, "AJAX_QUEUE_FUNCTION", func );
    }
    return ( inQ > 0 );
}

function isTriggeredByConnect()
{
    return(TRIGGERED_REASON.length > 0);
}

function getTriggeredReason()
{
    return(TRIGGERED_REASON.length > 0 ? TRIGGERED_REASON[TRIGGERED_REASON.length-1] : "");
}

function execute(p_elem, p_method, p_reason) {
    var result;
    try {
        TRIGGERED_REASON.push(p_reason);
        return p_elem[p_method]();
    }
    finally {
        TRIGGERED_REASON.pop();
    }
}

function setArray(ns, variableName,index, value){
	  var arr = window[ns + variableName];
	  if (arr!= undefined && arr instanceof Array) arr[index] = value;
}

function setVariable(ns, variableName, value)
{
  window[ns + variableName] = value;
}

function getVariable(ns, variableName, defaultValue)
{
    if ( ns == null ) ns = "";
    var variable = ns + variableName;
        var v=window[variable];
        if (v != undefined) return v;
    return (( defaultValue != null ) ? defaultValue : null);
}

function removeSpaces(stringValue){
    stringValue = "" + stringValue;
    var parts = stringValue.split(" ");
    var newValue = "";
    for (var i = 0; i < parts.length ;  i++)    {
        newValue += parts[i];
    }
    return newValue;
}

function isMaxLength(textArea, length){
if (textArea.getAttribute && textArea.value.length>length)
 textArea.value=textArea.value.substring(0,length);
}

/*
** Usage: getMsg(ns, msg, replace arg ..)
** First arg is the ns, second the message field and subsequent args are replacements for "QUESTION_CONSTRAINT"  ..
*/

function getMsg()
{
    if  ( arguments.length < 2 )
    {
        alert("Internal Error - Invalid call to getMsg, expecting at least 2 args have " + arguments.length);
        return("");
    }

    var ns = arguments[0];
    if  ( ns == null ) ns = "";
    var msg = ( ns == "@GOT_MSG@" ) ? arguments[1] : getVariable(ns, arguments[1]);
    for (var i=2; i < arguments.length; i++)
    {
		msg = substituteVariable(msg, arguments[i]);
    }
    return(msg);
}

function substituteVariable(text, variable)
{
    var equalSign = variable.indexOf("=");
    if (equalSign > -1)
    {
        var tokenName = variable.substring(0, equalSign);
        var tokenValue = variable.substring(equalSign + 1);
        var re =RegExp("\\$\\$" + tokenName + "\\$");
        return text.replace(re, tokenValue);
    }
	return text;
}

function getForm(ns)
{
    if ( ns == null ) ns = "";
    return(document.forms[ns+"form1"]);
}

function getResourcePath(ns, p_path)
{
    var path = p_path;
    if  ( path.substring(0,2) == "./" )
    {
        path = getVariable(ns, 'rootContext') + path.substring(1,path.length);
    }
    return(path);
}

function getArrayElement(ns, ArrayName, index){
 if (ns  == null) ns = "";
 var v = getVariable(ns, ArrayName);
 var retVal = v[index];
 if (retVal == null)
  retVal = "";
 return retVal;
}
function setArrayElement(ns, ArrayName, index, value){
 if (ns  == null) ns = "";
 var v = getVariable(ns, ArrayName);
 v[index] = value;
}

/*****************
* SUBMIT
*****************/

function enableSubmit(ns, enabled)
{
  if (ns  == null) ns = "";
  setVariable(ns, "submitEnabled", enabled);
}

function isSubmitEnabled(ns)
{
    if (ns  == null) ns = "";
    return ( getVariable(ns, "submitEnabled") );
}

function setFormSubmitted(p_submitted, ns )
{
    if (ns == null) ns = "";
    setVariable(ns, "hasSubmitted", p_submitted);
}

function isFormSubmitted(ns)
{
    if (ns == null) ns = "";
    return ( getVariable(ns, "hasSubmitted") );
}

function buttonsEnabled(ns)
{
    return( isSubmitEnabled(ns) && !isFormSubmitted(ns));
}

function ecSubmitValidForm(ns, mode, scrollToButton, id, inlineErrors, valMand)
{
    var formElms = getFormElems(ns);
    if (!doFieldValidation(null, null, valMand, formElms, true, ns, inlineErrors))
    {
        return false;
    }

    return( ecSubmitForm(ns, mode, scrollToButton, id) );
}

function ecSubmitForm(ns, mode, scrollToButton, id){
 if (ns  == null) ns = "";
 if (scrollToButton  == null) scrollToButton = false;
 if (id  == null) id = "";

 if(isSubmitEnabled(ns))
 {
   if ( beforeSubmit(ns, mode, scrollToButton, id) == false )
    return false;

   if (hideECForm(ns, mode, scrollToButton, id) == false)
	   return false;

   return ecDoSubmit(ns, mode, scrollToButton, id);
 }
 return false;
}

function ecDoSubmit(ns, mode, scrollToButton, id)
{
    var f = getForm(ns);

	if (f != null)
	{
    	if (f.MODE != null) f.MODE.value = mode;

    	f.action = getVariable(ns, "act");

    	if (scrollToButton && id != null && id.length > 0)
    	{
    	    if (f.action.indexOf("#") > 0) f.action = f.action.substring(0, f.action.indexOf("#"));
    	    var compID = getCompID(ns, id);
    	    if ( compID == null ) compID = "";
    	    var newId = stripPrefix(ns, id);
    	    f.action = f.action + "#" + ns + compID + "ANCHOR" + newId;
    	}

    	if (!isFormSubmitted(ns))
    	{
    	   setFormSubmitted(true, ns);
    	   f.submit();
    	   suspendDocument(ns, document, f );
    	   afterSubmit(ns, mode, scrollToButton, id);
    	   return true;
    	}
	}
	else
	{
	    log("Could not locate form for namespace '" + ns + "'");
	}
	return false;
}

// Suspends processing. Finds all the inputs that are not disabled, and disables them.
//The inputs are memorized so that they can be enabled later
//Calls the hook displayProcessingMessage if implemented
//param id - if passed, the id of the element that originates the processing, such as the id of the question for QLR
function suspendDocument(ns, p_document, p_form, id)
{
  displayProcessingMessage(ns, p_document);
  storeCallersEnabledControls(ns, p_document, p_form);
  enableControls(ns, false, false, id);
}

function addElement(div, type, elements){
 var els = div.getElementsByTagName(type);
 for(var i = 0; i < els.length; i++)  elements[elements.length] = els[i];
}

function getFormElemsOld(ns, p_startId)
{
 if (ns  == null) ns = "";
 var form = getForm(ns);
 var divs = null;
 if (p_startId != null && p_startId != ""){
	 var startTarget = document.getElementById(p_startId);
	 divs = startTarget.getElementsByTagName("div");
 }
 else
     divs = form.getElementsByTagName("div");

 var formEls = [];

 for (var x = 0; x < divs.length ; x++ ) {
	 //Fix for RTC 899708 - handle divs with no children (which LD adds)...
	 var ignoreDiv = false;
	 if (divs[x].getElementsByTagName("div").length > 0) {
		var subdivs = divs[x].getElementsByTagName("div");
		for (var y = 0; y < subdivs.length; y++) {
			if (subdivs[y].hasChildNodes()){
				ignoreDiv = true;
				break;
			}
		}
	 }
	 if (ignoreDiv){
		 continue;
	 }

	 addElement(divs[x], "input", formEls);
	 addElement(divs[x], "select", formEls);
	 addElement(divs[x], "textarea", formEls);
	 addElement(divs[x], "a", formEls);
	 addElement(divs[x], "button", formEls);
	 addElement(divs[x], "img", formEls);
 }
 return(formEls);
}



function getElementsByTagNames(elem,tags) {
	var elements = [];
	tags = tags.split(",");
	for (var i = 0, n = tags.length; i < n; i++) {
		var arr = elem.getElementsByTagName(tags[i]);
		for (var j = 0, nn = arr.length; j < nn; j++) {
			elements[elements.length] = arr[j];
		}
	}
	//the order of the returned elements must be the same with the elements from the page
	var testNode = elements[0];
	if (!testNode) return [];
	if (testNode.sourceIndex) {//IE
		elements.sort(function (a,b) {
			return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (testNode.compareDocumentPosition) {//others
		elements.sort(function (a,b) {
			return 3 - (a.compareDocumentPosition(b) & 6);
		});
	}
	return elements;
};


function getElementsByTagNamesQueryAll(elem,tags) {
	var elements = [];
	var nl = elem.querySelectorAll(tags);
	for (var i = 0, ref = elements.length = nl.length; i < ref; i++) {
		elements[i] = nl[i];
	}
	return elements;
};


function getFormElems(ns, p_startId) {
	(ns == null) && (ns = "");
	var form = getForm(ns), elem;

	elem = (p_startId != null && p_startId != "") ? document.getElementById(p_startId) : form;

	if (typeof document.querySelectorAll != "undefined") {
		// browsers which support querySelectorAll
		return getElementsByTagNamesQueryAll(elem,"input,a,img,textarea,select,button");
	} else  if (typeof elem.sourceIndex != "undefined" || typeof elem.compareDocumentPosition != "undefined") {
		// browsers which support sourceIndex or compareDocumentPosition
		return getElementsByTagNames(elem,"input,a,img,textarea,select,button");
	}

	//default case
	return getFormElemsOld(ns,p_startId);
}



// Builds a component ID (if there is one) .. first arg ns, last arg should be component prefixed value and middle args are added in
// so we end up with ns + compID + middle args + last arg without component id
function buildCompID()
{
    var ns = arguments[0];
    if  ( ns == null ) ns = "";

    var lastArg = arguments[arguments.length-1];

    if  ( ns.length > 0 && lastArg.indexOf(ns) == 0 )
    {
        lastArg = lastArg.substring(ns.length);
    }

    var compID = getCompID(ns, lastArg);
    if  ( compID == null )
    {
        compID = "";
    }
    else
    {
        lastArg = lastArg.substring(compID.length);
    }

    var result = ns + compID;
    for (var i=1; i < arguments.length-1; i++)
    {
        result += arguments[i];
    }

    result += lastArg;

    return(result);
}

function prefixCompID(ns, p_containsID, p_toPrefixWithID)
{
    var compID = getCompID(ns, p_containsID);
    if   ( compID != null )
    {
        return(compID + p_toPrefixWithID);
    }
    return(p_toPrefixWithID);
}

function getCompID(ns, p_string)
{
    if  ( p_string != null && p_string.indexOf(COMPONENT_SEPARATOR) > 0 )
    {
        var res = p_string;
        if  ( ns != null && ns.length > 0 && p_string.indexOf(ns) == 0 )
        {
            res = res.substring(ns.length);
        }
        var matched = res.match(COMP_ID_REG);
        if  ( matched != null && matched.length > 0 )
        {
            return(matched[0]);
        }
    }

    return(null);
}

function stripPrefix(ns, p_string)
{
    if  ( p_string != null )
    {
        if  ( ns == null ) ns = "";
        var compID = getCompID(ns, p_string);
        if  ( compID == null ) compID = "";
        var nsCompID = ns + compID;
        if ( p_string.indexOf(nsCompID) == 0 && nsCompID.length > 0 ) return(p_string.substring(nsCompID.length));
        if ( p_string.indexOf(compID) == 0 && compID.length > 0 ) return (p_string.substring(compID.length));
    }
    return(p_string);
}

/****************
*  TAB STUFF
****************/
function changeTab(tabName, ns, selStyle, tabStyle){
    if (ns  == null) ns = "";
    if (beforeChangeTab(tabName, ns, selStyle, tabStyle) == false)
        return;

    //if it is NOT a standard tab (does NOT has the class StandardTabUnselected or StandardTabSelected)
    var tab = document.getElementById(ns + tabName);
    if ( tab != null && !((" " + tab.className + " ").replace(/[\n\t]/g, " ").indexOf(" StandardTabUnselected ") > -1 || (" " + tab.className + " ").replace(/[\n\t]/g, " ").indexOf(" StandardTabSelected ") > -1 ))
 {
	 if (runChangeTabWidgetHooks("before", ns, tabName) == false)
	 {
		 return;
	 }
 }

 //if (getVariable(ns, "activeTabName") != tabName)
 {
  //check if tab header is visible....
  var tabHeader = document.getElementById(ns + tabName);
  if (tabHeader != null && tabHeader.style.display == "none") {
      return;
  }
  var tabPaneName = buildCompID(ns, "Pane", tabName);
  var elem = document.getElementById(tabPaneName);
  if (elem != null){

   setActiveTab(ns, tabName);
   var parent = elem.parentNode;
   for (var ci=0;ci<parent.childNodes.length;ci++){
    if (parent.childNodes[ci].tagName && parent.childNodes[ci].tagName.toLowerCase() == "div"){
     if (parent.childNodes[ci] == elem){
      parent.childNodes[ci].style.display="block";
     } else  {
        //check it is a tab pane before hiding..
	    if (parent.childNodes[ci].id.indexOf('Pane') >= 0) {
		  parent.childNodes[ci].style.display="none";
		}
	  }
    }
   }
  }
  elem = document.getElementById(ns + tabName);
  if (elem != null){
   var parent = elem.parentNode;
   for (var ci=0;ci<parent.childNodes.length;ci++){
    if (parent.childNodes[ci].tagName && (parent.childNodes[ci].tagName.toLowerCase() == "td" || parent.childNodes[ci].tagName.toLowerCase() == "div")){
	 //ignore spacers....
	 if (parent.childNodes[ci].id.indexOf("spacer") > 0) continue;
     if (parent.childNodes[ci] == elem){
      parent.childNodes[ci].className = selStyle; //style on TD
      setAriaSelectedTab(parent.childNodes[ci].children, true);
      parent.childNodes[ci].setAttribute('aria-selected','true');
     } else {
    	 // avoid removal of tetris_tab for tab pane
    	if (tabStyle != "" && parent.childNodes[ci].id.indexOf('Pane') < 0) {
    		 parent.childNodes[ci].className = tabStyle; //style on TD
    	}
      setAriaSelectedTab(parent.childNodes[ci].children, false);
      parent.childNodes[ci].setAttribute('aria-selected','false');
     }
    }
   }
  }
 }
 if (getTriggeredReason() != AJAX_RESPONSE_TRIGGER)

	//setFocusToFirst(ns, null, tabPaneName);
 afterChangeTab(tabName, ns, selStyle, tabStyle);
 runChangeTabWidgetHooks("after", ns, tabName);
}

/**
| @tabItemChildren = anchor Element  
| @isSelected = boolean
*/
function setAriaSelectedTab(tabItemChildren, isSelected){
    if (!tabItemChildren) {
        return;
    }
    var tabIndexValue = isSelected ? '0' : '-1';
    for (var i=0; i < tabItemChildren.length; i++) {
        tabItemChildren[i].setAttribute("aria-selected", isSelected);
        tabItemChildren[i].setAttribute("tabindex", tabIndexValue)
    }
}

function getActiveTab(p_startingTab) // WARNING: This is overridden in connect_divs.js ..
{
	return p_startingTab.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("INPUT")[0];
}

function setActiveTab(p_ns, p_tabId)
{
    var tab = document.getElementById(p_ns + p_tabId);
    var input = null;

    //if it is a standard tab (has the class StandardTabUnselected or StandardTabSelected), use getActiveTab
    if ( (" " + tab.className + " ").replace(/[\n\t]/g, " ").indexOf(" StandardTabUnselected ") > -1 || (" " + tab.className + " ").replace(/[\n\t]/g, " ").indexOf(" StandardTabSelected ") > -1 )
    {
    	input = getActiveTab(tab);
    }
    // else use the old behaviour
    else
    {
		if (this["getWidgetActiveTab"])
			input = getWidgetActiveTab(tab);
		if (input == null)
			input = getActiveTab(tab);
	}

	if (input != null && input.name.indexOf("CONNECT_ACTIVE_TAB") >= 0)
		input.value = p_tabId;
    setVariable(p_ns, "activeTabName", p_tabId);
}

function showTab(comp, ns){
	if (comp == null) return;
	if (ns == null) ns = "";
    var c = comp;
	runShowTabWidgetHooks("before", ns, c);
	var tabPane = null;
    do
	{
		if (c != null && c.id != null && c.id.indexOf("Pane") >= 0)
		{
		   /*
			** get the tab element from either the current document or the embedded frame content
			*/
		   var getTabElementFromContentDocument = function(contentDocument, id, alternativeId) {
			   var element = document.getElementById(id);
			   if (!element && contentDocument ) {
				   element = contentDocument.getElementById(alternativeId ? alternativeId : id);
			   }
			   return element;
    	   };
		   var compID = getCompID(ns, c.id );
		   if ( compID == null ) compID = "";
		   var tabName = stripPrefix(ns, c.id);
		   var index = tabName.indexOf("Pane");
		   var contentDocument = getContentDocumentNonLD();
		   if (index == 0)
		   {
		   	   tabPane = getTabElementFromContentDocument(contentDocument, tabName, c.id);
			   tabName = tabName.substring(4);
		   }
	       tabName = ns + compID + tabName;
	       var tabCell = getTabElementFromContentDocument( contentDocument, tabName);
		   if (tabCell.onclick)
		   {
				execute(tabCell, "onclick", SHOW_TAB_TRIGGER);
		   }
		   else if( tabCell.getElementsByTagName('a')[0] )
		   {
			   execute(tabCell.getElementsByTagName('a')[0], "click", SHOW_TAB_TRIGGER);
		   }
		  // break; // Carry on for outer tabs as we maybe a group component within an invokers tab ..
		}
		c = c.parentNode;
	}while (c != null)  ;
	runShowTabWidgetHooks("after", ns, tabPane);
}



/***************
*  NAVIGATION STUFF
****************/
function setFocusToFirst(ns, p_elementID, p_container){
 if ( p_elementID != null && p_elementID != "" )
 {
     try
     {
         var elem = document.getElementById(p_elementID);
         if ( elem != null )
         {
        	 focusOn(ns, p_elementID);
             return;
         }
     }
     catch (e) {};
 }

 //set focus to first in container - if nothing found, return...
 if (p_container != null) {
    var container = document.getElementById(p_container);
    if  ( container != null )
    {
        var allEls = container.getElementsByTagName("*");
        for (var i = 0; i < allEls.length; i++ ) {
            if (allEls[i].tagName == "INPUT" || allEls[i].tagName == "SELECT") {
                var elem = allEls[i];
                var parent = elem.parentNode;
                //see if any parents are hidden or disp none..
                var isHidden = elem.style.visibility == "hidden" || elem.style.display == 'none' ;
                while (!isHidden && parent != null && parent != container) {
                	isHidden = isHidden || (parent.style.visibility == "hidden" || parent.style.display == "none");
                	parent = parent.parentNode;
                }
                if (!isHidden) {
                    try{
                        focusOn(ns, elem.id);
                        return;
                      }
                       catch (e){
                      };
                }
            }
        }
    }
	return;
 }

 var els = getForm(ns).elements;
 for (var i =0; i < els.length; i++) {
  if (els[i].tagName == "INPUT" || els[i].tagName == "SELECT") {
   if (els[i].type && els[i].type != "hidden"  && els[i].type != "button") {
    var cellParent = getCellParent(els[i], ns);
  	if (els[i].style.visibility != "hidden" && els[i].style.display != 'none' && cellParent != null && cellParent.style.visibility != "hidden" && cellParent.style.display != 'none' ) {
	 try{
	  focusOn(ns, els[i].id);
	  break;
	 }
	 catch (e){
	 };
    }
   }
  }
 }
}

function buttonClicked(val, p_valMand, p_rowId, ns, scrollToButton, id, saveFormData, validateAllFields, buttonConfirmMsg, inlineErrors, valMand, idsToValidate)
{
 if ( isFormProcessing(ns, this, buttonClicked, arguments) ) return false;
 if (ns  == null) ns = "";
 if (!buttonsEnabled(ns)) return false;
 if (jscss('check', document.getElementById(id), DISABLED_CLASS)) return false;
 if (beforeButtonClicked(val, p_valMand, p_rowId, ns, scrollToButton, id, saveFormData, validateAllFields) == false)
     return false;

 //call onclick on row if there is one....
 var compID = buildCompID(ns, "p4_", id);
 var obj = document.getElementById(compID);
 if ( obj != null ){
   //call out to row clicks (if there are any) to set selectors...
   var aRow = obj;
   while((aRow = getParentRow(aRow)) != null){
	   if(aRow.onclick){
		   execute(aRow, "onclick", CHANGED_SELECTION_TRIGGER);
	   }
   }
 }


 if (window.getFormElems && saveFormData)
 {
	if (idsToValidate){
        var ids = findIdsToValidate(id, idsToValidate, ns);
		if(!validateDependentItems(ids, id, p_valMand && valMand, p_rowId, ns, inlineErrors)) {
			return false;
		}
	}
	else {
		var formElms = getFormElems(ns);
	    if (!doFieldValidation(val, p_rowId, p_valMand && valMand, formElms, validateAllFields, ns, inlineErrors)){
	     return false;
		}
	 }
 } else if (window.getFormElems) {
 	var elements = getFormElems(ns);
 	var rowSelectors = [];
 	var urlProps = "";
 	for (var i = 0; i < elements.length; i++) {
 		var el = elements[i];
		var name = el.name;
		if (el.id.indexOf(SELECTOR_INDICATOR) > 0 && rowSelectors.indexOf(name) == -1) {
			rowSelectors.push(name);
		}
	}
	if (rowSelectors.length > 0) {
		for (var i = 0; i < rowSelectors.length; i++) {
			urlProps = urlProps + rowSelectors[i] + ";";
		}
		var rowSelHiddenEl = document.createElement("input");
		rowSelHiddenEl.type = "text";
		rowSelHiddenEl.name = "ROW_SELECTORS_LIST";
		rowSelHiddenEl.value = urlProps;
		rowSelHiddenEl.style.display  = "none";
		getForm(ns).appendChild(rowSelHiddenEl);
	}
 }

 if (!displayConfirmMsg(buttonConfirmMsg)){
    return false;
 }
 var submitted = ecSubmitForm(ns, unescape(val), scrollToButton, unescape(ns+id));
 afterButtonClicked(val, p_valMand, p_rowId, ns, scrollToButton, id, submitted, saveFormData, validateAllFields);
 return false;
}

function displayConfirmMsg(buttonConfirmMsg)
{
 if (buttonConfirmMsg && buttonConfirmMsg != ""){
  if (!confirm(buttonConfirmMsg)){
    return false;
  }
 }
 return true;
}

function findIdsToValidate(btnId, validationType, ns)
{
    var questionIds = "";
    if (validationType)
    {
        var vt = validationType;
        var btn = document.getElementById(ns+btnId);
        if (vt == "prevQ")
        {
            var formEls = getFormElems(ns, null);
            for (var i = 0; i < formEls.length; i++){
                if (formEls[i] == btn){
                    if (i > 0){
                        //Work back through preceeding form elements and grab the nearest input element - if there is one
                        for (var j = i-1; j > -1; j--){
                            if (formEls[j].tagName == "INPUT" || formEls[j].tagName == "SELECT" || formEls[j].tagName == "TEXTAREA"){
                            	questionIds = appendId(formEls[j], questionIds, ns);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
        else if (vt == "preInPhase")
        {
            var formEls = getFormElems(ns, null);
            for (var i = 0; i < formEls.length; i++){
                if (formEls[i] == btn){
					break;
				}
				questionIds = appendId(formEls[i], questionIds, ns);
            }
        }
        else if (vt == "preInRow")
        {
            var row = getParentNode(btn, "tr");
            var formEls = getFormElems(ns, row.id);
            for (var i = 0; i < formEls.length; i++){
                if (formEls[i] == btn){
                    if (i > 0){
                        //Work back through preceeding form elements and grab the nearest input element - if there is one
                        for (var j = i-1; j > -1; j--){
                            questionIds = appendId(formEls[j], questionIds, ns);
                        }
                    }
                    break;
                }
            }
        }
        else if (vt.indexOf("preInGrp") == 0)
        {
      	    if (ns  == null) ns = "";
            var grpId = vt.length > 8 ? vt.substring(8) : "";
            var compID = getCompID(ns, grpId);
            if (compID == null) compID = "";
            var idWithoutCompPref = stripPrefix(ns, grpId);
            var elemsName = ns + compID + "p1_" + idWithoutCompPref;
            var formEls = getFormElems(ns, elemsName);
            for (var i = 0; i < formEls.length; i++){
                if (formEls[i] == btn){
                    if (i > 0){
                        //Work back through preceeding form elements and grab the nearest input element - if there is one
                        for (var j = i-1; j > -1; j--){
                            questionIds = appendId(formEls[j], questionIds, ns);
                        }
                    }
                    break;
                }
            }
        }
        else if (vt == "allQs")
        {
            var formEls = getFormElems(ns, null);
            for (var i = 0; i < formEls.length; i++){
                questionIds = appendId(formEls[i], questionIds, ns);
            }
        }
		else
		{
			//validation type is a list of specified questions...
			questionIds = validationType;
		}
    }
    return questionIds;
}

function appendId(field, questions, ns)
{
    if (field.tagName == "INPUT" || field.tagName == "SELECT" || field.tagName == "TEXTAREA"){
        var Qs = questions;
        var id = (ns != "" && field.id.indexOf(ns) == 0)? field.id.substring(ns.length):field.id;
        if (questions == null || questions == ""){
            Qs = id;
        }
        else{
            Qs += "|" + id;
        }
        return Qs;
    }
    return questions;
}

function validateDependentItems(ids, btn, p_valMand, p_rowId, ns, inlineErrors) {
	var compArr = [];
	var idArr = splitstring(ids, "|", false);
	if (idArr.length > 0 && idArr[0] != "")
	{
		for (var i = 0; i < idArr.length; i++)
		{
		    var compID = getCompID(ns, idArr[i]);
		    if (compID == null) compID = "";
            var idWithoutCompPref = stripPrefix(ns, idArr[i]);
			var id = ns + compID + "SEL_" + idWithoutCompPref;
			var subElementsArr = [];
			var comp = findElement(id, "", subElementsArr);
			if (comp == null) {
				id = ns + idArr[i];
                subElementsArr = [];
				comp = findElement(id, "", subElementsArr);
			}
            if (subElementsArr.length == 0)
            {
                //if no sub-elements, then just treat comp
                subElementsArr.push(comp);
            }
            for (var j = 0; j < subElementsArr.length; j++) {
                var elem = subElementsArr[j];
                if (elem != null && !elem.disabled && elem.type != "button" && elem.type != "image") // it may be hidden...
                {
                    compArr.push(elem);
                }
            }
		}
		//validate before sending - if validation.js loaded...
		if (this["formatCheckElems"])
		{
			if (!doFieldValidation(btn, p_rowId, p_valMand, compArr, false, ns, inlineErrors))
			{
				return false;
			}
		}
	}
	return true;
}

function doFieldValidation(btn, p_rowId, p_valMand, compArr, validateAllFields, ns, inlineErrors)
{
  if (p_rowId != null && p_rowId.length > 0 && p_rowId != "undefined")
  {
    if (window.mandCheckRow && (p_valMand == null || p_valMand))
    {
      if (!mandCheckRow(p_rowId, ns, btn, inlineErrors, validateAllFields)) return false;
    }
  }
  else if (window.mandCheckElems && (p_valMand == null || p_valMand))
  {
    if (!mandCheckElems(compArr, ns, btn, inlineErrors, validateAllFields)) return false;
  }

  if (window.formatCheckElems && !formatCheckElems(compArr, ns, inlineErrors)) return false;
  return true;
}


function goForwards(ns, buttonNameAndInstance, comp, buttonConfirmMsg, inlineErrors, valMand){
 if ( isFormProcessing(ns, this, goForwards, arguments) ) return false;
 if (ns  == null) ns = "";
 if (!buttonsEnabled(ns)) return false;
 if (jscss('check', comp, DISABLED_CLASS)) return false;
 if (buttonNameAndInstance  == null) buttonNameAndInstance = "";
 if ( beforeGoForwards(ns, buttonNameAndInstance) == false )
    return false;

 //call onclick on row if there is one....
 var mode="F";
 var buttonId = null;
 if (comp != null){
   buttonId = unescape(comp.id);
   mode = prefixCompID(ns, buttonId, mode);
   var tr = getParentNode(comp, "tr");
   if (tr != null && tr.onclick)
	 execute(tr, "onclick", CHANGED_SELECTION_TRIGGER);
 }

 if ( window.mandCheckElems )
 {
  var formElms = getFormElems(ns);
  if (!doFieldValidation(null, null, valMand, formElms, true, ns, inlineErrors))
     return false;
  //if (!mandCheckElems(formElms, ns, null, inlineErrors, true)) return false;
  //if (!formatCheckElems(formElms, ns, inlineErrors)) return false;
 }
 var confirmMsg = buttonConfirmMsg;
 if (confirmMsg == null || confirmMsg == "")
   confirmMsg = getVariable(ns, "forwardsConfirmMsg");
 if (!displayConfirmMsg(confirmMsg)){
    return false;
 }
 var submitted = ecSubmitForm(ns, mode + buttonNameAndInstance, null, buttonId);
 afterGoForwards(ns, submitted, buttonNameAndInstance);
 return false;
}

function goBack(ns, comp, buttonConfirmMsg){
 if ( isFormProcessing(ns, this, goBack, arguments) ) return false;
 if (ns  == null) ns = "";
 if (!buttonsEnabled(ns)) return false;
 if (jscss('check', comp, DISABLED_CLASS)) return false;
 if ( beforeGoBack(ns) == false )
    return false;
 var confirmMsg = buttonConfirmMsg;
 if (confirmMsg == null || confirmMsg == "")
   confirmMsg = getVariable(ns, "backConfirmMsg");
 if (!displayConfirmMsg(confirmMsg)){
    return false;
 }
 var mode="P";
 var buttonId = null;
 if (comp != null){
   buttonId = unescape(comp.id);
   mode = prefixCompID(ns, buttonId, mode);
 }
 var submitted = ecSubmitForm(ns, mode, null, buttonId);
 afterGoBack(ns, submitted);
 return false;
}

function goNav(ns, navDataItem, navCode, comp){
 if ( isFormProcessing(ns, this, goNav, arguments) ) return false;
 if (ns  == null) ns = "";
 if (!buttonsEnabled(ns)) return false;
 if ( beforeGoNav(ns, navDataItem, navCode) == false )
    return false;
 if (navDataItem != null && navDataItem.length > 0){
   var elem = getForm(ns).elements[navDataItem];
   if (elem != null)
     elem.value = navCode;
 }
 if (window.formatCheckElems){
   if (!formatCheckElems(getFormElems(ns), ns)) return false;
 }
 var mode=prefixCompID(ns, navDataItem, "N");
 var buttonId = null;
 if (comp != null){
   buttonId = unescape(comp.id);
 }
 var submitted = ecSubmitForm(ns, mode, null, buttonId);
 afterGoNav(ns, navDataItem, navCode, submitted);
 return false;
}

function goNavItem(ns, itemName, doSave, doMandValidate, mode, comp, inlineErrors)
{
  if (mode == "NAVMENU_" && this["beforeMenuSubmit"] && !beforeMenuSubmit(null, mode, ns))
  {
      return false;
  }
  if ( isFormProcessing(ns, this, goNavItem, arguments) ) return false;

  if (ns  == null) ns = "";
  if (beforeGoNavItem(ns, itemName) == false)
    return false;
  if (doSave && !doFieldValidation(itemName, null, doMandValidate, getFormElems(ns), true, ns, inlineErrors))
  {
    return false;
  }
  var buttonId = null;
  if (comp != null){
    buttonId = unescape(comp.id);
  }
  var submitted = ecSubmitForm(ns, buildCompID("", mode,itemName), null, buttonId);
  afterGoNavItem(ns, submitted, itemName);
  return false;
}

function popup(ns, windowSize, type, text, p_pageKey, mode)
{
 if (ns  == null) ns = "";
 if(windowSize==null || windowSize.length==0) windowSize = "width=300,height=300";
 if(isSubmitEnabled(ns))
 {
   var f = getForm(ns);
   storeCallersEnabledControls(ns, document, f);
   enableControls(ns, false);
   var pageKey, pageVal;
   if (f.PAGE) {
	   pageKey = "PAGE";
	   pageVal = f.PAGE.value;
   }
   else {
		pageKey = p_pageKey;
		pageVal = f.elements[p_pageKey].value;
   }

   var action = getVariable(ns, "popupAct");
   var sep = (action.indexOf("?")> -1) ? "&" : "?";
   var url = action + sep + "MODE=" + mode + "&" + pageKey + "=" + pageVal + "&namespace="+ ns;
   url = addSubSessionIdToParameters( url, ns );
   if ("window" == type)
   {
	   var windowName = "popup"+getSubSessionId(ns);
       window.open(url,windowName,windowSize + popupParams);
   }
   else
   {
	   text = text.replace(/<\\\//g, "</");
	   var width = windowSize.substring(windowSize.indexOf('h=')+2,windowSize.indexOf(','));
	   var height = windowSize.substring(windowSize.indexOf('t=')+2);
	   var preUrl = text.substring(0,text.indexOf('$$POPUPURL$'));
	   var postUrl = text.substring(text.indexOf('$$POPUPURL$')+11);

	   var greyDiv = createFloatingDiv("greyBackground", document.body);
	   if ((navigator.appName == "Microsoft Internet Explorer") && (!window.XMLHttpRequest)) {
	      greyDiv.style.position = "absolute";
	      greyDiv.style.height = calcBrowserHeight()+"px";
	   }
	   else {
	      greyDiv.style.position = "fixed";
	      greyDiv.style.height = "100%";
	   }
	   // GDM In IE6, select elements hover on top of the floating div bad times
       if (IE4 && msieversion() <= 6) hideSelects();

	   greyDiv.style.width = "100%";
	   greyDiv.style.left = "0";
	   greyDiv.style.top = "0";
	   greyDiv.style.backgroundColor = getBackgroundGrey();
	   setOpacity(greyDiv, getOpacity());
	   greyDiv.style.zIndex = "99";

	   var topFloatDiv = createFloatingDiv("topBody", document.body);
	   topFloatDiv.style.position = "absolute";
	   topFloatDiv.style.top = "0px";
	   topFloatDiv.style.left = "0px";
	   topFloatDiv.style.width = "100%";
	   topFloatDiv.style.height = "100%";
  	   topFloatDiv.style.zIndex = "100";
	   topFloatDiv.innerHTML = preUrl + url + postUrl;

	   var floatDiv = document.getElementById("FloatPopupDiv");
	   floatDiv.style.position = "absolute";
	   floatDiv.style.width = width + "px";
	   floatDiv.style.height = height + "px";
	   var ww = getWindowWidth();
	   var wh = getWindowHeight();
	   var l = (ww > width)?(ww-width)/2 :0 ;
	   var t = (wh > height)?(wh-height)/2 :0 ;
	   floatDiv.style.left = l + "px";
	   floatDiv.style.top  = t + "px";
   }
   enableSubmit(ns, false);
 }
}

// GDM
function hideSelects(visibility){
    selects = document.getElementsByTagName('select');
    for(var i = 0; i < selects.length; i++) {selects[i].style.visibility = 'hidden';};
}

function msieversion(){
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf ( "MSIE " );
      if ( msie > 0 )      // If Internet Explorer, return version number
         return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
      else                 // If another browser, return 0
         return 0;
}

function setOpacity(greyDiv, opacity)
{
	   greyDiv.style.opacity = opacity;
	   greyDiv.style.MozOpacity = opacity;
	   greyDiv.style.filter = "alpha(opacity=" +(parseFloat(opacity) * 100) + ")";
}

function getOpacity()
{
	return "0.75";
}

function getBackgroundGrey()
{
	return "#000000";
}

function getLinks(p_document, p_includeDisabled, ns)
{
    var numLinks = p_document.links.length;
    var linx = [];
    for (var i = 0; i < numLinks; i++)
    {
        var l = p_document.links[i];
        var isOnClickDefined = ( typeof l.onclick != 'undefined' && l.onclick != null ) ;
        var isOnClickAttrDefined = l.getAttribute("onclick") != null;
        var isLinkEnabled = ( isOnClickDefined || isOnClickAttrDefined ) && ( typeof l.disabled == 'undefined' || p_includeDisabled || !l.disabled);
        if ( isLinkEnabled )
        {
             var onclickString = ( isOnClickDefined ) ? l.onclick.toString() : "";
             var onclickAttrib = ( isOnClickAttrDefined ) ? l.getAttribute("onclick") : "";
             if  ( ns == '' || hasNS(onclickString) || hasNS(onclickAttrib))
             {
                linx.push(l) ;
             }
        }
    }
    return(linx);
}

function hasNS(str,ns)
{
    return (str.indexOf("'" + ns + "'") > -1 || str.indexOf("\"" + ns + "\"") > -1);
}

function storeCallersEnabledControls(ns, p_document, p_form)
{
  if (ns  == null) ns = "";
  var e = p_form.elements;
  var j=0;
  for (var i=0; i < e.length; i++)
  {
    if (!e[i].disabled)
    {
      setArrayElement(ns, "enabledControls", j++, e[i]);
    }
  }

  var links = getLinks(p_document, false, ns);
  for (var i = 0; i < links.length; i++)
  {
      setArrayElement(ns, "enabledLinks", i, links[i]);
  }
}
//Marks the controls in the p_enable list as enabled/disabled.
//param p_buttonsAndLinksOnly - whether to enable/disable only buttons and links
//param id - if passed, the id of the element that originates the processing, such as the id of the question for QLR
function enableControls(ns, p_enable, p_buttonsAndLinksOnly, id)
{
  if (ns  == null) ns = "";

  var enabledControls = getVariable(ns, "enabledControls");
  if ( enabledControls ) {
    var disableControl = function (e) {e.disabled = !p_enable;};
    for (var i=0; i < enabledControls.length; i++) {
      var e = enabledControls[i];
      if  ( p_buttonsAndLinksOnly && !( e.type == "button" || e.type == "image" )) continue;
      var waitBeforeDisabling = !p_enable && (e == document.activeElement) && e.type == "button" && id != null && e.id != id;
      if (waitBeforeDisabling)
      {
        //if a QLR was triggered by a click on a button
        // we let the button click go through by delaying the disabling of the button which is done by the QLR
        (function(currElem) {
          //e must be passed as argument, otherwise e changes with the loop
          setTimeout(disableControl(currElem), 150);
        })(e);
      }
      else
      {
        disableControl(e);
      }
    }
  }

  var enabledLinks = getVariable(ns, "enabledLinks");
  if ( enabledLinks ) {
    var disableFunc = function(e) {
      if  ( ! e ) e = window.event;
      if  ( e.stopPropagation )
      {
        e.stopPropagation();
        e.preventDefault();
      }
      else
      {
        e.keyCode = 0;
        e.cancelBubble = true;
      }
      return false;
    };
    var disableLink = function(link) {
      link.disabled = true ;
      link.original_onclick = link.onclick;
      link.onclick = disableFunc;
    };
    for (var i=0; i < enabledLinks.length; i++) {
      var link = enabledLinks[i];
      if  ( p_enable && link.disabled ) {
        link.disabled = false ;
        link.onclick = link.original_onclick;
      }
      else if  ( !p_enable && !link.disabled ) {
        var waitBeforeDisabling = !p_enable && (link == document.activeElement) && id != null && link.id != id;
        if (waitBeforeDisabling)
        {
          //if a QLR was triggered by a click on a link
          // we let the link click go through by delaying the disabling of the link which is done by the QLR
          (function(currLink) {
            //link must be passed as argument, otherwise e changes with the loop
            setTimeout(disableLink(currLink), 150);
          })(link);
        }
        else
        {
          disableLink(link);
        }
      }
    }
  }
}

function unpopup(ns, pageno, pagekey, pageval, mode)
{
 if (ns  == null) ns = "";
 enableControls(ns, true);
 enableSubmit(ns, true);
 var f = getForm(ns);
 if (f != null){
	if (f.PAGE) f.PAGE.value = pageno;
	else f.elements[pagekey].value = pageval;
 }
 ecSubmitForm(ns, mode);
}

function cancelpopup(ns, pageno, pagekey, pageval, mode)
{
 if (ns  == null) ns = "";
 enableControls(ns, true);
 enableSubmit(ns, true);
 var f = getForm(ns);
 if (f != null) {
	 if (f.PAGE) f.PAGE.value = pageno;
	 else f.elements[pagekey].value = pageval;
 }
 ecSubmitForm(ns, mode);
}


function loadProduct(product,  params, presType, ns){
 var url = getUrl(product,  params, presType, "0", ns);
 window.location = url;
}

function getUrl(product,  params, presType, page, ns)
{
 var url;
 if (ns  == null) ns = "";
 if (presType == null) presType = "";
 url = getVariable(ns, "act") + "?MODE=" + getVariable(ns, "controllerMode") + "&PAGE=" + page + "&PRODUCT=" + escape(product) + "&PRESENTATION_TYPE=" + escape(presType);
 if (params != null && params.length >0) {
   url += ("&" + params);
 }
 return url;
}

function preview(product, params, presType){
    var url = unescape(location.href);
    var ndxQueryString = url.indexOf('?');
    var queryString = url.substring(ndxQueryString);
    var ndxParamName = queryString.indexOf('preview' + '=');
    ndxParamValueEnd = queryString.indexOf('=');
    var preview = queryString.substring(ndxParamValueEnd+1, queryString.length);
    if(preview=="y")
    {
        loadProduct(product, params, presType);
    }
}

/****************
*  session STUFF
****************/

function addSubSessionIdToParameters( parameters, ns )
{
	var form = getForm(ns);
	if( form && form.SUBSESSIONID )
	{
		parameters += "&SUBSESSIONID=" + form.SUBSESSIONID.value;
	}
	return parameters;
}

function getSubSessionId( ns )
{
	var form = getForm(ns);
	if( form && form.SUBSESSIONID )
	{
		return form.SUBSESSIONID.value;
	}
	return "";
}

function get(query, ns){
 return getArrayElement(ns, "session", query);
}

/* session */
function put(query,  value, ns){
 setArrayElement(ns, "session", query, value);
}

//checkbox values....
function getUncheckedCheckboxValue(query, ns){
 return getArrayElement(ns, "checkbox", query);
}
function putUncheckedCheckboxValue(query,  value, ns){
 setArrayElement(ns, "checkbox", query, value);
}

function storeValues(ns){
 if (ns  == null) ns = "";
 var els = getForm(ns).elements;
 var prop;
 var comp;
 var index = 0;
 for (index = 0; index < els.length; index++){
  comp = els[index];
  prop = els[index].name;
  var val = getElementValue(comp, ns);
  put(prop, val, ns);
 }
}

function getElementValue(comp, ns, useUncheckedCheckboxValue){
 if (ns  == null) ns = "";
 if (comp == null) return "";
 if (comp.tagName == "FIELDSET")
	 return getElementValue(comp.getElementsByTagName("input")[0], ns, useUncheckedCheckboxValue);

 if (comp.type == "text" || comp.type == "textarea" || comp.type == "password" || comp.type == "file" || comp.type == "hidden" ) return comp.value;
 else if (comp.type == "select-one"){
   for (var i = 0; i < comp.length; i++){
    if (comp[i].selected) return comp[i].value;
   }
   return "";
 }
 else if (comp.type == "select-multiple"){
   var componentId = getCompID(ns, comp.id);
   if (!componentId) {
       componentId = "";
   }
   var v = ""; var selected = 0;
   if (comp.id != null && comp.id.indexOf(ns+componentId+SELECT_LIST_PREFIX) == 0){
    for(var i = 0; i < comp.length; i++){
     if (i > 0)  v += '\|';
     v += comp.options[i].value;
    }
   }
   else{
    for(var i = 0; i < comp.length; i++){
     if (comp.options[i].selected){
      if (selected > 0)  v += '\|';
      v += comp.options[i].value;
      selected++;
     }
    }
   }
   return v;
 }
 else if (comp.type == "checkbox"){
  var v = "";
  var p0;
  if (comp.id.indexOf(SELECTOR_INDICATOR) > 0) // get the selector checkbox items...
   p0 = document.getElementsByName(comp.name);
  else {
		var par = comp.parentNode;
		while (par && !par.id) par = par.parentNode;
		p0 = par.getElementsByTagName("input");
  }
  if (comp.name != null && (comp.name.indexOf(SINGLE_CHECKBOX_PREFIX) == 0)){
   var str = "";
   if (p0[0].checked) str = p0[0].value.substring(0, p0[0].value.indexOf("|"));
   else str = p0[0].value.substring(p0[0].value.indexOf("|") + 1);
   p0[1].value = str;
   return str;
  }
  for (var i = 0; i < p0.length ; i++){
   if ( !p0[i].parentNode.disabled) {
	  if (p0[i].checked ){
	      if (v.length > 0) v += '\|';
		  v += p0[i].value;
	  }
	  else if (useUncheckedCheckboxValue) {
		  var uncheckedVal = getUncheckedCheckboxValue(comp.name, ns);
		  if  ( uncheckedVal != null && uncheckedVal.length > 0 )
		  {
              if (v.length > 0) v += '\|';
              v += uncheckedVal;
		  }
      }
   }
  }
  return v;
 }
 else if (comp.type == "radio"){
   if (comp.name == null || comp.name == ""){
       return "";
   }
   var p0;
   if (comp.id.indexOf(SELECTOR_INDICATOR) > 0) // get the selector radio items...
    p0 = document.getElementsByName(comp.name);
   else {
		var par = comp.parentNode;
		while (par && !par.id) par = par.parentNode;
		p0 = par.getElementsByTagName("input");
   }
   for (var i = 0; i < p0.length ; i++){
       if (p0[i].checked) return p0[i].value;
   }
   return "";
 }
 else if (comp.type == null && comp[0] != null){
   if (comp[0].type == "radio"){
    for (var i = 0; i < comp.length; i++){
     if (comp[i].checked) return comp[i].value;
    }
   }
   return "";
 }
 else if (comp.value) {
   return comp.value;
 }
 return "";
}


function splitstring(strx, sep, is_sep_a_bag, addEmptyStrings){
 //note - is_sep_a_bag is now ignored and always assumed to be false....
 if ( addEmptyStrings == null ) addEmptyStrings = false;
 var ret = [];
 var index;
 var more=true;
 var searchPtr = 0;
 while(more){
  index=strx.indexOf(sep, searchPtr);
  if (index > -1){
   var res= strx.substring(searchPtr,index);
   if(addEmptyStrings || res.length!=0) ret[ret.length]=res;
   searchPtr = index+sep.length;
  }
  else{
	ret[ret.length] = strx.substring(searchPtr);
    break;
  }
 }
 return ret;
}

function endsWith(p_sourceString, p_testString)
{
    var len = p_sourceString.length;
    var position = len - p_testString.length;
    if (position < 0) return false;
    if (p_sourceString.substring(position, len) == p_testString)
        return true;
    return false;
}

function isRadio(p_comp)
{
    return( p_comp && p_comp.type && p_comp.type.toUpperCase() == "RADIO" ) ;
}

function isCheckBox(p_comp)
{
    return( p_comp && p_comp.type && p_comp.type.toUpperCase() == "CHECKBOX" ) ;
}

function isSelectList(p_comp)
{
    return( p_comp && p_comp.type && ( p_comp.type.toUpperCase() == "SELECT-ONE" || p_comp.type.toUpperCase() == "SELECT-MULTIPLE" ) ) ;
}

function isTransferableList(p_comp)
{
    return(p_comp.name && p_comp.name.indexOf(SELECT_LIST_PREFIX) > -1);
}

function isText(p_comp)
{
    return( p_comp && p_comp.type && p_comp.type.toUpperCase() == "TEXT" ) ;
}

function isMultiSelectionList(p_comp)
{
    return( p_comp && p_comp.type && ( p_comp.type.toUpperCase() == "SELECT-MULTIPLE" ) || isCheckBox(p_comp) || isTransferableList(p_comp) ) ;
}

function getGroupComp(p_comp)
{
    return( (isRadio(p_comp) || isCheckBox(p_comp)) ? document.getElementsByName(p_comp.name) : p_comp );
}

function getGroupValue(p_comp, p_compID)
{
 var comp = getGroupComp(p_comp);
 var isTransList = isTransferableList(comp);
 var val = "";
 for (var x = 0; x < comp.length; x++){
   if (isTransList || comp[x].selected || comp[x].checked ){
    if (comp[x].checked){
        val += comp[x].alt;
    }
    else if (isTransList || comp[x].selected){
        var id = comp[x].id;
        if ( p_compID != null && p_compID.length > 0 && id.indexOf(p_compID) == 0 ) id = id.substring(p_compID.length);
        id = id.substring(0, id.indexOf("__"));
        val += id;
    }
    if (!isMultiSelectionList(p_comp)) break;
    else
    {
        if (val.length > 0)
        {
            val+="|";
        }
    }
   }
  }
  if ( val.lastIndexOf("|") == (val.length - 1)) val = val.substring(0, val.length - 1);
  return(val);
}

function buildExpression(expr, ns, compID)
{
  var exprArray = expr.split("\^");
  var exprResultMap = [];

  for (var j = 0; j < exprArray.length; j++){
	  var expr = exprArray[j];
	  var origExpr = exprArray[j];
	  //check to see if in cache..
	  if (exprResultMap[expr] != null)  {
		exprArray[j] = exprResultMap[expr];
	  }
	  else {
		for (var i = 0; i < expr.length; i++){
		  if (expr.length > 3 && expr.charAt(i) == '$' && expr.charAt(i+1) == '$' && expr.indexOf('$', i+2) > -1) {
			var compName = expr.substring(i+2, expr.indexOf('$', i+2));
			var el = document.getElementsByName(compID + compName)[0];
			if (el == null) {
			 if (compName.indexOf(GROUP_VALUE_FN) > 0){
			  compName = compName.substring(0, compName.indexOf(GROUP_VALUE_FN));
			  //try the sel_ version first.
			  var comp = document.getElementsByName(compID + SELECT_LIST_PREFIX + compName)[0];
			  if (comp == null) {
				// TODO Should check if hidden .. and get next one (if any)
				comp = document.getElementsByName(compID + compName)[0];
			  }
			  if (comp != null)
				val = getGroupValue(comp, compID);
			  else
				val = get(compID + compName + GROUP_VALUE_FN, ns);
			 }
			 else{
			  val = get(compID + compName, ns);
			 }
			}
			else{
			  val = getElementValue(el, ns, true); //true to use unchecked value - only done for evaluating hidden conditions....
			}
			//if val is numeric, and there are quotes around it, we need to remove quotes.....
			var quoteOffset = 0;
			if (val != "" && (val.charAt(0) != "0" || val == "0") && !isNaN(val)){  //i.e if a number!
				if (i > 0){
					if (expr.charAt(i-1) == '"'){
						quoteOffset = 1;
						if	( i > 2 && ( expr.substring(i-3,i-1) == "==" || expr.substring(i-3,i-1) == "!=" ) ){
							quoteOffset = 0;
						}
						else{
							var after = expr.indexOf('$', i+2);
							if	( after < (expr.length-3) && ( expr.substring(after+2,after+4) == "==" || expr.substring(after+2,after+4) == "!=" ) ){
								quoteOffset = 0;
							}
						}
					}
				}
			}
			else {
				if (val.indexOf('\\') > -1){
					val = val.replace(BACKSLASH_REG,'\\\\');
				}
				if (val.indexOf('"') > -1){
					val = val.replace(DOUBLEQUOTE_REG,'\\"');
				}
			}
			expr = expr.substring(0, i - quoteOffset) + val +expr.substring(expr.indexOf('$', i+2)+1 + quoteOffset);
		  }
		}
		//store in cache and update array...
		exprResultMap[origExpr] = expr;
		exprArray[j] = expr;
	  }
  }

 return exprArray;
}

function evalMultiSelect(expr, pipeLoc){
  while (pipeLoc >= 0){
    var startQuoteIndex = expr.lastIndexOf("\"", pipeLoc) + 1;
    var endQuoteIndex   = expr.indexOf("\"", pipeLoc);
    var nextChar        = expr.charAt(pipeLoc + 1);
    if (startQuoteIndex >=0 && endQuoteIndex >= 0  && nextChar != "|"){
      var keyVals = expr.substring(startQuoteIndex, endQuoteIndex);
      var vals = splitstring(keyVals, "|", false);
      for (var q = 0;  q < vals.length;  q++){
        if (vals[q].length > 0){
          var newExpr = expr.substring(0, startQuoteIndex) +  vals[q] +  expr.substring(endQuoteIndex);
          var intPipeLoc = checkIfMultiValue(newExpr);
          if (intPipeLoc >= 0){
            if (evalMultiSelect(newExpr, intPipeLoc)) return true;
          }
          else{
            if (jsep.eval(newExpr)) return true;
          }
        }
      }
      pipeLoc = expr.indexOf("|", endQuoteIndex) ;
    }
    else{
      if (endQuoteIndex >= 0) pipeLoc = expr.indexOf("|", endQuoteIndex) ;
      else pipeLoc = -1;
    }
  }
  return false;
}


//checks for _Rx(_x_x...)  haven't used regular expression for performance reasons.
//returns row path if there is one, otherwise a blank string.
function getRowPart(p_id) {
	if (p_id.indexOf("_R") > 0)	{
		var end = p_id.substring(p_id.lastIndexOf("_R") + 2);
		var mustBeNumber = true;
		for (var i = 0; i < end.length; i++){
			var x = end.charAt(i);
			if (mustBeNumber){
				if (isNaN(parseInt(x))) return "";
				mustBeNumber = false;
			}
			else {
				if (isNaN(parseInt(x)) && x != '_') return "";
				if (x == '_') mustBeNumber = true;
			}
		}
		return(end);
	}
	return "";
}


function checkHidden(questions, expr, keepColumnHeadings, saveData, naType, ns, compID)
{
 if (ns  == null) ns = "";
 if (compID  == null) compID = "";
 if (!DHTML || expr == null || expr.length == 0) return true;
 var evalExpr = "";
 var val = "";
 var hasTabsToShow = false;
 var currentTabId = "";
 var nsCompID = ns + compID;
 var curFocus = getVariable(ns, "CURRENT_FOCUS");

 var exprArray = buildExpression(expr, ns, compID);//splitstring(expr, "^", false);
 var qArray = splitstring(questions, "^", false);
 var keepHeadingArray = splitstring(keepColumnHeadings, "^", false);
 var saveDataArray = splitstring(saveData, "^", false);
 var naTypeArray = splitstring(naType, "^", false);
 var resultArray = [];
 var noRowsDisplayed;
 var currentQ = "";
 for (var i = qArray.length -1; i>= 0; i--){
  var q = qArray[i];
  var rowPart = getRowPart(q);
  //Check if the new question is in a table and in the same
  //column as the previous one.
  if (rowPart.length > 0){
    var rind = q.lastIndexOf("_R");
    var cq = q.substring(0, rind);
    if (cq != currentQ){
      currentQ = cq;
      noRowsDisplayed = true;
    }
  }
  else{
    currentQ = q;
    noRowsDisplayed = true;
  }
  var tblSelector;
  var p_layout = []; p_layout[0] = document.getElementById(nsCompID + q);
  if (!p_layout[0]) p_layout[0] = document.getElementById(nsCompID + "FS_" +  q);
  var p_tabPane = [];
  if (document.getElementById(nsCompID + "Pane" + q) != null /*&& (getVariable(ns, "activeTabName") == null || getVariable(ns, "activeTabName") == "")*/ ) {
	  p_tabPane[0] = document.getElementById(nsCompID + "Pane" + q);
	  setFormElementDisabled(p_tabPane[0], false);
  }
  else if(rowPart.length > 0){
	  var pickerId = nsCompID + q.substring(0, q.lastIndexOf("_R")) + "_picker_R" + rowPart;
	  p_layout[1] = document.getElementById(pickerId);
	  //Let's see if this might be a linear table...
	  var tableId = getLinearTableDivId(q, rowPart, nsCompID);
	  if (tableId)
	  {
		  var tableSelId = tableId + "_Selector_R" + rowPart;
		  tblSelector = document.getElementById(tableSelId);
	  }
  }
  else if (document.getElementById(nsCompID +  q  + "_picker") != null){
	   p_layout[1] = document.getElementById(nsCompID +  q  + "_picker");
  }


  var p0 = []; p0[0] = document.getElementById(nsCompID + "p0_" + q);
  var p1 = []; p1[0] = getP1Cell(nsCompID, "p1_" + q);

  addErrorRowToDisplayList(p1, nsCompID + q);

  var p2 = []; p2[0] = document.getElementById(nsCompID + "p2_" + q);
  var p3 = []; p3[0] = document.getElementById(nsCompID + "p3_" + q);
  var p4 = []; p4[0] = document.getElementById(nsCompID + "p4_" + q);
  var p5 = []; p5[0] = document.getElementById(nsCompID + "p5_" + q);
  var p6 = []; p6[0] = document.getElementById(nsCompID + "p6_" + q);
  var p7 = []; p7[0] = document.getElementById(nsCompID + "p7_" + q);
  var result = false;

  try{
      var pipeLoc = checkIfMultiValue(exprArray[i]);
      if (pipeLoc >= 0)
        result = evalMultiSelect(exprArray[i], pipeLoc);
      else
        result = jsep.eval(exprArray[i]);

  }
  catch (e) {
      result = false;
      if (debug)
          alert("Error in expression: " + exprArray[i]);
  }
  resultArray[i] = result;
  var tabHeader = nsCompID + q;
  if(result){
   noRowsDisplayed = false;
   var mainCellIDs = show(p4, naTypeArray[i], ns, true);
   if ( mainCellIDs != null || p4[0] == null ) {
     for (var ii=0; mainCellIDs != null && ii < mainCellIDs.length ; ii++){
	   if (mainCellIDs[ii] != null){
	     p0[ii] = document.getElementById(nsCompID + "p0_" + mainCellIDs[ii]);
         p1[ii] = getP1Cell(nsCompID, "p1_" + mainCellIDs[ii]);
	     p2[ii] = document.getElementById(nsCompID + "p2_" + mainCellIDs[ii]);
	     p3[ii] = document.getElementById(nsCompID + "p3_" + mainCellIDs[ii]);
	     p5[ii] = document.getElementById(nsCompID + "p5_" + mainCellIDs[ii]);
	     p6[ii] = document.getElementById(nsCompID + "p6_" + mainCellIDs[ii]);
	   }
	 }
   }
   //see if item is a child of another one...
   var runAnimation = true;
   if (p_layout[0] != null) {
	   for (var x = i - 1; x >= 0; x--) {
		   var par = p_layout[0].parentNode;
		   var idToMatch = nsCompID + qArray[x];
		   while (par != null) {
			   if (par.id && par.id == idToMatch) {
				   //a child, so don't animate...
				   runAnimation = false;
				   x = -1;
				   break;
			   }
			   par = par.parentNode;
		   }
	   }
   }
   show(p_layout, naTypeArray[i], ns, true, true, runAnimation);
   show(p0, naTypeArray[i], ns, true);
   show(p1, naTypeArray[i], ns, true);
   show(p2, naTypeArray[i], ns, true);
   show(p3, naTypeArray[i], ns, true);
   show(p5, naTypeArray[i], ns, true);
   show(p6, naTypeArray[i], ns, true);
   show(p7, naTypeArray[i], ns, false);
   if (document.getElementById(ns + "Pane" + tabHeader ) != null) {
    currentTabId = checkTab(tabHeader, "show", keepHeadingArray[i], saveDataArray[i], currentTabId, ns);
   }
  }
  else{
   hide(p7, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, false);
   var mainCellIDs = hide(p4, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true);
   if ( mainCellIDs != null || p4[0] == null ) {
     for (var ii=0; mainCellIDs != null && ii < mainCellIDs.length ; ii++){
       if (mainCellIDs[ii] != null){
         p0[ii] = document.getElementById(nsCompID + "p0_" + mainCellIDs[ii]);
         p1[ii] = getP1Cell(nsCompID, "p1_" + mainCellIDs[ii]);
         p2[ii] = document.getElementById(nsCompID + "p2_" + mainCellIDs[ii]);
         p3[ii] = document.getElementById(nsCompID + "p3_" + mainCellIDs[ii]);
         p5[ii] = document.getElementById(nsCompID + "p5_" + mainCellIDs[ii]);
         p6[ii] = document.getElementById(nsCompID + "p6_" + mainCellIDs[ii]);
       }
     }
     hide(p_layout, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true, true);
     if (window.hideErrorMessage && p_layout.length == 1)
     {
           hideErrorMessage(ns, p_layout[0], null);
     }
     hide(p_tabPane, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true, true);
     hide(p0, keepHeadingArray[i], saveDataArray[i], ns, true);
     if (keepHeadingArray[i] != "true" && noRowsDisplayed) {
	   hide(p1, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true);
	   if (p_layout[0] == null && p1[0] != null)
		   {
		   	var inputs = p1[0].getElementsByTagName("input");
		   	for (var j=0; j < inputs.length; j++)
		   		{
		   			hideErrorMessage(ns, inputs[j], null);
		   		}
		   }
     }
     hide(p2, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true);
     hide(p3, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true);
     hide(p5, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true);
     hide(p6, keepHeadingArray[i], saveDataArray[i], naTypeArray[i], ns, true);
   }
   if (document.getElementById(buildCompID(ns, "Pane", tabHeader)) != null) {
    currentTabId = checkTab(tabHeader, "hide", keepHeadingArray[i], saveDataArray[i], currentTabId, ns);
   }
   }
   if (tblSelector)
   {
	 setFormElementDisabled(tblSelector.parentNode, !result);
   }
  }
 if (currentTabId != "")
 {
     setActiveTab(ns, currentTabId );
     showTab(document.getElementById(buildCompID(ns, "Pane", currentTabId)), ns);
 }
 else if (getVariable(ns, "activeTabName") != null)
 {
  var activeTab = getVariable(ns, "activeTabName");
  if ( document.getElementById(buildCompID(ns, "Pane", activeTab)) != null) {
   setVariable(ns, "activeTabName", null);
   showTab(document.getElementById(buildCompID(ns, "Pane", activeTab)).firstChild, ns);
   focusOn(ns, curFocus);
  }
 }
 return resultArray;
}

function getLinearTableDivId(q, rowSuffix, nsCompId)
{
	var rowSuffixRemoved = q.substring(0, q.lastIndexOf("_R"));
  	var qId = rowSuffixRemoved.substring(0, rowSuffixRemoved.length-6);
	var comp = document.getElementById(qId + "_R" + rowSuffix);
	if (comp)
	{
		var ancestor = comp.parentNode;
		while (ancestor != null && ancestor.id.length == 0 && ancestor.parentNode)
		{
			ancestor = ancestor.parentNode;
		}
		if (ancestor != null)
		{
			if (ancestor.nodeName.toUpperCase() == "DIV")
			{
				//Linear table
				return ancestor.id;
			}
		}
	}
	return null;
}

function getMainCellIDFromFS(ns, p_parentFS)
{
  if (p_parentFS != null) {
    return stripPrefix(ns, p_parentFS.id).substring(9);
  }
  return null;
}

function getP1Cell(p_nsCompID, p_p1ID)
{
  var p1Cell = document.getElementById(p_nsCompID + p_p1ID);
  var rowPart = getRowPart(p_p1ID);
  if (p1Cell == null && rowPart.length > 0) {
	p_p1ID = p_p1ID.substring(0, p_p1ID.lastIndexOf("_R"));
    p1Cell = document.getElementById(p_nsCompID + p_p1ID);
	//look for spacer cells
	if (!p1Cell) {
		p1Cell = document.getElementById(p_nsCompID + p_p1ID + "format_R" + rowPart);
		if (!p1Cell) {
			p1Cell = document.getElementById(p_nsCompID + p_p1ID + "column_R" + rowPart);
		}
	}

  }
  return p1Cell;
}

function addErrorRowToDisplayList(array, qId)
{
  var errorRow = document.getElementById(qId + "_ERRORROW");
  if (errorRow != null) {
    var spans = errorRow.getElementsByTagName("span");
    for (var i = 0; spans != null && i < spans.length; i++) {
      var span = spans[i];
      if (span != null && span.id == qId+"_ERRORMESSAGE" && span.innerHTML.length > 0) {
        array[array.length] = errorRow;
		break;
      }
    }
  }
}

function checkIfMultiValue(expr){
 var pipeLoc = -1;
 if (expr.indexOf("|") >= 0){
  for (var j = 0; j < expr.length - 1; j++){
   if (expr.charAt(j) == "|") {
    if (expr.charAt(j+1) != "|"){
     pipeLoc = j;
     break;
    }
    ++j;
   }
  }
 }
 return pipeLoc;
}

function checkTab(tabToCheckId, showInd, keepHeadings, saveData, currentTabId, ns){
 var tmpArray = [];
 var nsTabHeader = ns + tabToCheckId;
 tmpArray[0] = document.getElementById(buildCompID(ns, "Pane", tabToCheckId) );
 var headerEl = document.getElementById(tabToCheckId);
 var activeTabId = getActiveTab(headerEl).value;
 if (showInd == "show") {
  if (activeTabId == tabToCheckId)
  {
      show(tmpArray);
      return tabToCheckId;
  }
  if ( activeTabId != null && activeTabId != "" )  return activeTabId;
  }
 else if (showInd == "hide"){
  hide(tmpArray, keepHeadings, saveData, "Hide", ns);
  if(activeTabId == tabToCheckId ) {
      getActiveTab(headerEl).value = null;
      if ( currentTabId == tabToCheckId ) currentTabId = "";
  }
  else {
	currentTabId = activeTabId;
  }
 }

 if ( currentTabId == null || currentTabId == "" )
 {
     var firstChild = getFirstRealVisibleChild(headerEl.parentNode);
     return( ( firstChild ) ? firstChild.id : "" );
 }

 return currentTabId;
}

function focusOnActiveTab(aTabId, tabName, triggers, selStyle, unselStyle, ns, controllerName, context, isAjax)
{
    var activeTab = getActiveTab(document.getElementById(aTabId)).value;
    if (activeTab != null && activeTab != "" && document.getElementById(activeTab).style.display != "none")
    {
        if (isAjax)
        {
            ajaxTabs(activeTab, tabName, triggers, selStyle, unselStyle, ns, controllerName, context);
        }
        else
        {
            changeTab(activeTab, ns, selStyle, unselStyle);
        }
        return;
    }
    var allTabs = document.getElementById(aTabId).parentNode.childNodes;
    for (var i = 0; i < allTabs.length; i++)
    {
        if (allTabs[i].nodeType == 1 && allTabs[i].style.display != "none")
        {
            if (isAjax)
            {
                ajaxTabs(aTabId, tabName, triggers, selStyle, unselStyle, ns, controllerName, context);
            }
            else
            {
                changeTab(allTabs[i].id, ns, selStyle, unselStyle);
            }
            return;
        }
    }
}

function show(els, naType, ns, checkSiblings){
 var allHidden = true; var mainCellIDs = [];
 if (ns == null) ns = "";
 for (var i=0; i < els.length ; i++){
  if (els[i] == null) return null;
  mainCellIDs[i] = null;
  if (els[i].style != null){
    if (beforeElemShown(ns, els[i], naType)) {
	  runElemShownWidgetHooks("before", ns, els[i], naType);
	  jscss('remove', els[i], DISABLED_CLASS);
      if (els[i].style.visibility == "hidden") els[i].style.visibility = "visible";
      if (els[i].tagName == "DIV" || els[i].tagName == "div") {
        if (els[i].id.indexOf("Pane") == -1) {
          var parentFS = getParentFieldset(els[i]);
          if ( parentFS != null && checkSiblings ) {
        	if ( !areFieldsetSiblingsAllHidden(parentFS) ) {
   			  allHidden = false;
   		    }
 		    if (allHidden){
			  mainCellIDs[i] = getMainCellIDFromFS(ns, parentFS);
 			}
          }
          els[i].style.display = 'inline';
	      var tmpEl = els[i];
	      while(tmpEl != null && tmpEl.nodeType == 1 && tmpEl.tagName.toUpperCase() != "TR"){
		    showElem(tmpEl, true);
		    tmpEl = tmpEl.parentNode;
	      }
	      //the tr...
	      showElem(tmpEl, true);
        }
        else {
	      if (els[i].tagName == "SPAN" || els[i].tagName == "span")
	        els[i].style.display = 'inline';
	      else
		    els[i].style.display = 'block';
	    }
      }
      else{
	    var tmpEl = els[i];
	    while(tmpEl != null && tmpEl.nodeType == 1 && tmpEl.tagName.toUpperCase() != "TR"){
		  showElem(tmpEl, true);
		  tmpEl = tmpEl.parentNode;
	    }
	    showElem(tmpEl, true);
      }
      setFormElementDisabled(els[i], false);
      if (naType == "Disable") setElementEnabled(els[i]);
	  afterElemShown(ns, els[i], naType);
	  runElemShownWidgetHooks("after", ns, els[i], naType);
    }
  }
 }
 if (!allHidden) return null;
 else return mainCellIDs;
}

function showElem(elem, show){
  if (elem != null){
	var id = elem.id;
	if (id && id.indexOf("__REMOVED") > 0) return;
    if (show){
      elem.style.visibility = "visible";
      setOpacity(elem, 1);
	  var nodeName = elem.tagName.toUpperCase();
      if (IE4) {
          if (nodeName == "IMG" || nodeName == "SPAN" || nodeName == "INPUT" || nodeName == "SELECT" || nodeName == "TEXTAREA" || nodeName == "A" || nodeName == "BUTTON" || (nodeName == "DIV" && elem.parentNode.tagName.toUpperCase() == "FIELDSET")) elem.style.display = 'inline';
		  else elem.style.display = '';
	  }
      else{
        var nodeName = elem.tagName.toUpperCase();
        if (nodeName == "TD" || nodeName == "TH") elem.style.display = 'table-cell';
        else if (nodeName == "TR") elem.style.display = 'table-row';
        else if (nodeName == "TBODY") elem.style.display = '';
        else if (nodeName == "TABLE") elem.style.display = 'table';
        else if (nodeName == "SPAN" || nodeName == "INPUT" || nodeName == "SELECT" || nodeName == "TEXTAREA" || nodeName == "A" || nodeName == "BUTTON" || (nodeName == "DIV" && elem.parentNode.tagName.toUpperCase() == "FIELDSET")) elem.style.display = 'inline';
		else if ( nodeName == "IMG" ) elem.style.display = "";
        else elem.style.display = '';
      }
    }
    else elem.style.display = 'none';
  }
}
//RTC 1130224: determine if the field is with NA condition of type "Disable"
function isInDisabled(field) {
	var par = field.parentNode;
	while (par != null) {
		if (jscss('check', par, DISABLED_CLASS)) {
			return true;
		}
		par = par.parentNode;
	}
	return false;
}

function isInHidden(field) {
	var par = field.parentNode;
	while (par != null) {
		if (jscss('check', par, DISABLED_CLASS)) {
			if (par.id) {
				if (par.id.indexOf("p0_") < 0 &&
					par.id.indexOf("p4_") < 0 &&
					par.id.indexOf("row_") < 0){
					return true;
				}
			}
		}
		par = par.parentNode;
	}
	return false;
}
function filterHiddenAndReadOnlyInputs(fields) {
	for (var i = fields.length - 1; i >= 0; i--){
		if ( fields[i].name.indexOf("_READONLY") >= 0 ) {
			fields.splice( i, 1 );
		}
		//RTC 1130224: check if the field is in NA and of type "Disable"
		else if ( isInHidden(fields[i]) && !isInDisabled(fields[i]) ) {
			fields.splice( i, 1 );
		}
	}
	return fields;
}

function getSubElements(start, type) {
 var elements = start.getElementsByTagName(type);
 var inputs = [];
 for (var i = 0; i < elements.length; i++) {
 	inputs.push(elements[i]);
 }
 inputs = filterHiddenAndReadOnlyInputs(inputs);
 return inputs;
}

//look for the form element, and enable/disable it exlicitly
function setFormElementDisabled(field, p_disabled){
 var inputs = getSubElements(field, "input");
 inputs = inputs.concat(getSubElements(field, "button"));
 inputs = inputs.concat(getSubElements(field, "a"));
 inputs = inputs.concat(getSubElements(field, "select"));
 inputs = inputs.concat(getSubElements(field, "textarea"));

 if (inputs.length > 0){
     for (var i = 0; i < inputs.length ; i++ ){
         inputs[i].disabled = p_disabled;
		 if (!p_disabled) {
			 jscss("remove", inputs[i], DISABLED_CLASS);
		 }
		//RTC 1130224: add disabled class for the field
		 else if (p_disabled) {
			 jscss("add", inputs[i], DISABLED_CLASS);
		 }

		 //see if there is a picker...
		 if (document.getElementById(inputs[i].id + "_picker") != null)
			document.getElementById(inputs[i].id + "_picker").style.display = p_disabled ? "none" : "";
     }
 }
}

function hide(els, keepHeading, saveData, naType, ns, checkSiblings){
 var allHidden = true; var mainCellIDs = [];
 if (ns == null) ns = "";
 for (var i=0; i < els.length ; i++){
  if (els[i] == null) return null;
  mainCellIDs[i] = null;
  if (beforeElemHidden(ns, els[i], keepHeading, saveData, naType)){
	runElemHiddenWidgetHooks("before", ns, els[i], keepHeading, saveData, naType);
	jscss('add', els[i], DISABLED_CLASS);
    if (naType == "Hide" || naType == "Remove"){
	  if (keepHeading != null && keepHeading == "true"){
	   if (els[i].style != null){
			if (els[i].parentNode.parentNode.tagName.toUpperCase() == "FIELDSET" || els[i].parentNode.tagName.toUpperCase() == "FIELDSET")
				els[i].style.display = "none";
			else
				els[i].style.visibility = "hidden";
	   }
	  }else{
	   if (els[i].style != null){
		els[i].style.display = 'none';
		if ( checkSiblings ) {
          var parentFS = getParentFieldset(els[i]);
	  	  if ((els[i].tagName.toUpperCase() == "DIV") && (parentFS != null)){
		    var allHidden = areFieldsetSiblingsAllHidden(parentFS);
		    if (allHidden){
			  getParentNode(els[i], "td").style.display = "none";
		      mainCellIDs[i] = getMainCellIDFromFS(ns, parentFS);
		    }
		  }
		}
	   }
	  }
    }
    if (saveData == 'false')
      setFormElementDisabled(els[i], true);// disabling stops the value being sent back to the server.
    if (naType == "Disable")
	  setElementDisabled(els[i]);
    checkIfAllCellsHidden(els[i]);

	afterElemHidden(ns, els[i], keepHeading, saveData, naType);
	runElemHiddenWidgetHooks("after", ns, els[i], keepHeading, saveData, naType);
  }
 }
 if (!allHidden) return null;
 else return mainCellIDs;
}

function isHidden(elem)
{
  var p = elem;
  while (p != null)
  {
    if (p.style != null)
    {
      if (p.style.visibility == "hidden" || p.style.display == 'none')
      {
        if (p.id == null || p.id.indexOf("__REMOVED") < 0) //ignore __REMOVED
	        return true;
      }
    }
    p = p.parentNode;
  }
  return false;
}

function getParentFieldset(p_elem) {
  var parentFS = null;
  if ( p_elem != null && p_elem.parentNode != null ) {
	if ( p_elem.parentNode.tagName.toUpperCase() == "FIELDSET" ) {
	  parentFS = p_elem.parentNode;
	} else if ( p_elem.parentNode.parentNode != null && p_elem.parentNode.parentNode.tagName.toUpperCase() == "FIELDSET" ) {
	  parentFS = p_elem.parentNode.parentNode;
	}
  }
  return parentFS;
}

function areFieldsetSiblingsAllHidden(p_parentFS){
  if ( p_parentFS != null ) {
	//grouped, check if all sibling divs are hidden
	var siblings = p_parentFS.childNodes;
	for (var j=0; j < siblings.length; j++){
	  if (("" + siblings[j].tagName).toUpperCase() == "DIV" && siblings[j].style.display != "none"){
		return false;
	  }
    }
	return true;
  }
  return false;
}

function checkIfAllCellsHidden(p_elementCellToCheck)
{
	var row = getParentNode(p_elementCellToCheck, "tr");
	var childCells = row.childNodes;
	for (var i = 0; i < childCells.length; i++)	{
		var cc = childCells[i];
		var fchild = getFirstRealChild(cc);
		if (cc.nodeType == 1 && cc.style.clear != "both"){
			if (cc.style.display != "none") {
				if (fchild && fchild.nodeType == 1 && fchild.style)
				{
					if (fchild.style.visibility != 'hidden') return;
				}
				else
					return;
			}
		}
	}
	row.style.display = "none";
}

function checkRowHidden(p_questionsToCheck, p_questionsToChange, p_instanceList, ns)
{
 var instList = splitstring(p_instanceList, "|", false);
 for (var instNum = 0; instNum < instList.length; instNum++) {
  var rowNum = instList[instNum];
  var qArray = splitstring(p_questionsToCheck, "^", false);
  var oneVisible = false;
  for (var i = 0; i < qArray.length ; i++ ){
   var cellID = ns + qArray[i] + rowNum;
   var cell = document.getElementById(cellID);
   if (cell != null) {
    if (cell.style.display != "none" && cell.style.visibility != "hidden") {
     var divCell = cell.getElementsByTagName("div")[0];
     if (divCell != null) {
      if (divCell.style.display != "none" && divCell.style.visibility != "hidden")
       oneVisible = true;
     }
     else
      oneVisible = true;
    }
   }
  }
  var qArray = splitstring(p_questionsToChange, "^", false);
  for (var i = 0; i < qArray.length ; i++ ){
   var tr = document.getElementById(ns + qArray[i] + rowNum);
   if (tr != null) {
    if (!oneVisible) {
     tr.style.display = 'none';
    }
    // RTC 972515: display: nonne should be removed if there are rows that should be visible in page
    else if (oneVisible && tr.style.display == 'none') {
    	tr.style.display = '';
    }
    else{
		if (IE4) tr.style.display = 'block';
	}
   }
  }
 }
}

function getParentNode(comp, name){
    var p = comp;
    while (((p = p.parentNode) != null) && p.nodeName != name.toUpperCase()) {};
    return (p);
}


// get a parent row for both tables and linear tables
function getParentRow(comp)
{
	var p = comp;
	if ( p != null ){
		while ((p = p.parentNode) != null && ((p.nodeName != "DIV" && p.nodeName != "TR") || p.id.indexOf("_R") == -1));
	}
	return (p);
}

function getCellParent(node, ns){
 if (ns == null) ns = "";
 if (node == null || node.parentNode == null) return null;
 var p = node.parentNode;
  if (p.nodeName == "div" || p.nodeName == "DIV"){
    var id = stripPrefix(ns, p.id);
    if (id.indexOf("p1_") == 0 || id.indexOf("p2_") == 0 || id.indexOf("p3_") == 0 || id.indexOf("p4_") == 0)   {
        return p;
    }
 }
 if (p.nodeName == "td" || p.nodeName == "TD")
    return p;
 else{
    return getCellParent(p, ns);
 }
}

function getFirstRealChild(node){
  if (node != null){
    var child = node.firstChild;
    while (child != null){
      if (child.nodeType == 1){
        return child;
      }
      child = child.nextSibling;
    }
  }
  return null;
}

function getFirstRealVisibleChild(node){
  if (node != null){
    var child = node.firstChild;
    while (child != null){
      if (child.nodeType == 1 && child.style.visibility != "hidden" && child.style.display != "none"){
        return child;
      }
      child = child.nextSibling;
    }
  }
  return null;
}

function getPreviousRealSibling(node){
  if (node != null){
    var sib = node.previousSibling;
    while (sib != null){
      if (sib.nodeType == 1){
        return sib;
      }
      sib = sib.previousSibling;
    }
  }
  return null;
}

function getNextRealSibling(node){
  if (node != null){
    var sib = node.nextSibling;
    while (sib != null){
      if (sib.nodeType == 1){
        return sib;
      }
      sib = sib.nextSibling;
    }
  }
  return null;
}

function getKeyCode(p_evt)
{
    var keyCode = p_evt ? (p_evt.which ? p_evt.which : p_evt.keyCode) : event.keyCode;
    return(keyCode);
}

function searchList(evt, comp, defaultButton, ns){
    var keyspressed = getVariable(ns, "keyspressed");
    var e = (evt) ?evt :window.event ;
    var keyCode = getKeyCode(evt);
    if (e.altKey || e.ctrlKey || (keyCode != ENTER_KEYCODE && keyCode < 32))
    {
        return(true);
    }
    else if  (keyCode == ENTER_KEYCODE && isMultiSelectionList(comp))
    {
        keyspressed = "";
        setVariable(ns, "keyspressed", keyspressed);
        performDefaultButtonAction(defaultButton, ns);
        return(false);
    }

    keyspressed += String.fromCharCode(keyCode).toUpperCase();
    setVariable(ns, "keyspressed", keyspressed);
    var i=0; var bfound = false;
    for (var j=0; j<2; j++){
        for (i=0; i<comp.length; i++){
            liststring = comp[i].text.substring(0, keyspressed.length).toUpperCase();
            if (keyspressed == liststring){
                bfound=true;
                break;
            }
        }
        if (bfound) break;
        keyspressed = keyspressed.substr(keyspressed.length-1,1);
        setVariable(ns, "keyspressed", keyspressed);
    }
    if (!bfound){
        keyspressed = "" ;
        setVariable(ns, "keyspressed", keyspressed);
        i = -1;
    }
    if (comp.length>0 && bfound) {
		setVariable(ns, "setListComponent", comp);
        setVariable(ns, "setListIndex", i);
        setTimeout("setSelectedList('" + ns + "')", 10);
    }
    if	( window.opera )
    {
    	return( e.charCode ? false : true );
    }
    return (false);
}

function setSelectedList(ns)
{
    var comp=getVariable(ns, "setListComponent");
    var i = getVariable(ns, "setListIndex");
    comp.selectedIndex = i;
    if (comp.onchange) execute(comp, "onchange", KEY_PRESSED_TRIGGER);
}

function validActionKey(e)
{
  var key = getKeyCode(e);
  var isAction =  key != null && (key == 32 || key == 13);
  return isAction;
}

function checkForDefaultButtonAction(p_evt, p_comp, p_defaultButton, ns, p_doEvenWhenHidden)
{
    if  ( getKeyCode(p_evt) == ENTER_KEYCODE )
    {
        if (p_evt.target.type !== 'color' && p_evt.target.type !== 'file') {
          performDefaultButtonAction(p_comp, p_defaultButton, ns, p_doEvenWhenHidden);
          return(false);
        }
    }
    return(true);
}

function performDefaultButtonAction(p_comp, p_defaultButton, ns, p_doEvenWhenHidden)
{
    if  ( p_defaultButton != null && p_defaultButton != "" )
    {
        var form = getForm(ns);
        if  ( !performedDefaultButtonAction(p_comp, p_defaultButton, form.getElementsByTagName("button"), ns, p_doEvenWhenHidden) )
        {
            if  ( !performedDefaultButtonAction(p_comp, p_defaultButton, form.getElementsByTagName("input"), ns, p_doEvenWhenHidden) )
            {
                performedDefaultButtonActionOnLinks(p_comp, p_defaultButton, getLinks(document, true, ns), ns, p_doEvenWhenHidden);
            }
        }
    }
}

function performedDefaultButtonAction(p_comp, p_defaultButton, p_elements, ns, p_doEvenWhenHidden)
{
    for (var i =0; i < p_elements.length; i++)
    {
        if  ( p_elements[i].name && p_elements[i].onclick && p_elements[i].name == p_defaultButton  )
        {
            if (p_doEvenWhenHidden || !isHidden(p_elements[i]))
            {
                if (p_comp.onblur) p_comp.onblur();
                execute(p_elements[i], "onclick", DEFAULT_BUTTON_ACTION_TRIGGER);
            }
            return(true);
        }
    }
    return(false);
}

function performedDefaultButtonActionOnLinks(p_comp, p_defaultButton, p_elements, ns, p_doEvenWhenHidden)
{
    var buttonClickedCheck = "buttonClicked('" + p_defaultButton + "'";
    var buttonClickedOfflineCheck = "buttonClickedOffline('" + removeSpaces(p_defaultButton) + "'";
    var buttonClickedCheckDbl = "buttonClicked(\"" + p_defaultButton + "\"";
    var buttonClickedOfflineCheckDbl = "buttonClickedOffline(\"" + removeSpaces(p_defaultButton) + "\"";

    for (var i =0; i < p_elements.length; i++)
    {
        if  ( p_elements[i].onclick )
        {
            var onclickString = p_elements[i].onclick.toString();
            var onclickAttrib = ( p_elements[i].getAttribute("onclick") ) ? p_elements[i].getAttribute("onclick") : "";
            if  (   onclickString.indexOf(buttonClickedCheck) > -1 || onclickString.indexOf(buttonClickedOfflineCheck) > -1 || onclickString.indexOf(buttonClickedCheckDbl) > -1 || onclickString.indexOf(buttonClickedOfflineCheckDbl) > -1
                ||  onclickAttrib.indexOf(buttonClickedCheck) > -1 || onclickAttrib.indexOf(buttonClickedOfflineCheck) > -1 || onclickAttrib.indexOf(buttonClickedCheckDbl) > -1 || onclickAttrib.indexOf(buttonClickedOfflineCheckDbl) > -1
                )
            {
                if (p_doEvenWhenHidden || !isHidden(p_elements[i]))
                {
                    p_comp.onblur();
                    execute(p_elements[i], "onclick", DEFAULT_BUTTON_ACTION_TRIGGER);
                }
                return(true);
            }
        }
    }
    return(false);
}

function isDatePartFunctionName(p_elemName)
{
	if (p_elemName != null && p_elemName.indexOf(".") > 0)
	{
		var part = p_elemName.substring(p_elemName.lastIndexOf(".") +1);
		for (var i =0 ; i < DATE_TIME_PARTS.length; i++ )
		{
			if ( part == DATE_TIME_PARTS[i] )
			{
				return(true);
			}
		}
	}
	return(false);
}

function getImageDirPath(ns)
{
    return(getResourcePath(ns, getVariable(ns, 'imageDirPath')));
}

function doOnBlur(ns, p_id)
{
	if (getTriggeredReason() != "") return
	ns = ""; // ignore ns - should only every remember one, even for portals.
    setVariable(ns, "CURRENT_FOCUS", null);
    removeHelpContent();
	return(true);
}

function doOnFocus(ns, p_id, help_id)
{
    ns = ""; // ignore ns - should only every remember one, even for portals.
	setVariable(ns, "CURRENT_FOCUS", p_id);
	if (window.clickHelpButton) clickHelpButton(help_id);
	return(true);
}

function focusOnCurrent(ns)
{
    ns = ""; // ignore ns - should only every remember one, even for portals.
    var fieldId=getVariable(ns, "CURRENT_FOCUS");
    focusOn(ns, fieldId);
	try	{
		setUpFocusValue(ns, document.getElementById(fieldId));
	}
	catch (e){}
    return true;
}

function focusOn(ns, fieldId)
{
  if (fieldId != null)
  {
	var field = document.getElementById(fieldId);
    if ( field != null ) {
    	var fieldType  = field.tagName.toLowerCase();
    	if (fieldType != "input" && fieldType != "select" && fieldType != "textarea" && fieldType != "button" && fieldType != "a" && fieldType != "img") {
    		field = getFormElems(ns, fieldId)[0];
    	}
        try{
 		    setTimeout(function() {
 			   try {
 				   //showTab(field, ns);
 				   field.focus();
				   field.focus();
				   if (field.select)
					   field.select();
 			   }
 			   catch (e){
 			   }
		    }, 100);
		}
		catch (e){};
    }
  }
}

function createFloatingDiv(divId, parent)
{
	var floatDiv = document.createElement("div");
	floatDiv.setAttribute("id", divId);
	floatDiv.setAttribute("style", "z-index: 10000");
	parent.appendChild(floatDiv);

	return floatDiv;
}

function getWindowWidth()
{
	  var width = 0;
	  if( typeof( window.innerWidth ) == 'number' )
	  {
	    //Non-IE
	    width = window.innerWidth;
	  }
	  else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
	  {
	    //IE 6+ in 'standards compliant mode'
	    width = document.documentElement.clientWidth;
	  }
	  else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
	  {
	    //IE 4 compatible
	    width = document.body.clientWidth;
	  }
	  return width;
}

function getWindowHeight()
{
	  var height = 0;
	  if( typeof( window.innerWidth ) == 'number' )
	  {
	    //Non-IE
	    height = window.innerHeight;
	  }
	  else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
	  {
	    //IE 6+ in 'standards compliant mode'
	    height = document.documentElement.clientHeight;
	  }
	  else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
	  {
	    //IE 4 compatible
	    height = document.body.clientHeight;
	  }
	  return height;
}

function getScreenOrientation()
{
	var w = getWindowWidth();
	var h = getWindowHeight();
	if (h/w > 1)
		return "P";
	else return "L";
}

function fetchBrowserDeviceInfoAndSubmit()
{
	var p_formName = "form1";
	var now = Date.now();
	var lastExecution = 0;
    if (now - lastExecution < 250) return;
    lastExecution = now;
    var form = document.forms[p_formName];
	if (form != null && form.DEVICE_SIZE_INFO != null)
	{
		fetchBrowserDeviceInfo(p_formName);
		var form = document.forms[p_formName];
		ecSubmitForm(null, "EVENT_DEVICE", null, null);
	}

}

function fetchBrowserDeviceInfo(p_formName)
{
	var deviceSizeInfo = '{';
	deviceSizeInfo += '"screenWidth":"' + window.screen.availWidth + '",';
	deviceSizeInfo += '"screenHeight":"' + window.screen.availHeight + '",';
	deviceSizeInfo += '"documentWidth":"' + document.documentElement.clientWidth + '",';
	deviceSizeInfo += '"documentHeight":"' + document.documentElement.clientHeight + '",';
	deviceSizeInfo += '"bodyWidth":"' + document.body.clientWidth + '",';
	deviceSizeInfo += '"bodyHeight":"' + document.body.clientHeight + '",';
	deviceSizeInfo += '"windowWidth":"' + getWindowWidth() + '",';
	deviceSizeInfo += '"windowHeight":"' + getWindowHeight() + '",';
	deviceSizeInfo += '"screenOrientation":"' + getScreenOrientation() + '"';
	deviceSizeInfo += '}';
	document.forms[p_formName].DEVICE_SIZE_INFO.value = deviceSizeInfo;
}

function jscss(a,o,c1,c2)
{
  if (!o) return;
  switch (a){
    case 'swap':
      o.className=!jscss('check',o,c1)?o.className.replace(c2,c1): o.className.replace(c1,c2);
    break;
    case 'replace':
        if ( jscss('check',o, c1 ) )
            o.className=o.className.replace(c1,c2);
    break;
    case 'add':
      if(!jscss('check',o,c1)){o.className+=o.className?' '+c1:c1;}
    break;
    case 'remove':
      if (!c1 || c1.length == 0) return;
	  var anyMore = jscss('check', o, c1);
	  while (anyMore){
	      var rep=o.className.match(' '+c1)?' '+c1:c1;
		  o.className=o.className.replace(rep,'');
		  anyMore = jscss('check', o, c1);
	  }
    break;
    case 'check':
	  return(c1 && c1.length > 0 && (" " + o.className + " ").indexOf(" " + c1 + " ") >= 0);
      //return new RegExp('\\b'+c1+'\\b').test(o.className)
    break;
  }
}

function hasChanged(ns, c) {
	if ( FORMAT_VALIDATION_TRIGGER == getTriggeredReason() ) return true;
  var curVal = getElementValue(c, ns);
  if ( curVal == null || curVal == "" ) {
    if ( c.validity && !c.validity.valid ) {
    	return true;
    }
  }
  var oldVal = getFocusValue(ns, c.id);
  if ( oldVal != undefined && oldVal != curVal ) {
  	return true;
  }

  return false;
}

function log() {
    var args = Array.prototype.slice.call(arguments);
    if (window.console && typeof console.log !== "undefined") {
        try {
            console.log.apply(this, args);
        }
        catch (e) {
            if (args.length) {
                var message = args[0];
                for (var i = 1; i < args.length; i++) {
                    message += ": " + (args[i] != null ? args[i] : "arg" + i + " is null");
                }
                console.log(message);
            }
        }
    }
    else {
        // TODO Find other log methods for old browsers
        // alert(message);
    }
}

// The following functions were moved from connect_validation.js, to solve IN 8343

function getErrorMessageId(ns, comp) {
	var lookupParts = getLookupId(ns, comp);
	var id = lookupParts[0] +lookupParts[1] + "_ERRORMESSAGE" + lookupParts[2];
	var node = document.getElementById(id);
	if (node == null)	{
		lookupParts = getLookupId(ns, comp, true);
	}
	return lookupParts[0] +lookupParts[1] + "_ERRORMESSAGE" + lookupParts[2];
}

function getWarningMessageId(ns, comp) {
	var lookupParts = getLookupId(ns, comp);
	var id = lookupParts[0] +lookupParts[1] + "_WARNINGMESSAGE" + lookupParts[2];
	var node = document.getElementById(id);
	if (node == null)	{
		lookupParts = getLookupId(ns, comp, true);
	}
	return lookupParts[0] +lookupParts[1] + "_WARNINGMESSAGE" + lookupParts[2];
}

function getInfoMessageId(ns, comp) {
	var lookupParts = getLookupId(ns, comp);
	var id = lookupParts[0] +lookupParts[1] + "_INFOMESSAGE" + lookupParts[2];
	var node = document.getElementById(id);
	if (node == null)	{
		lookupParts = getLookupId(ns, comp, true);
	}
	return lookupParts[0] +lookupParts[1] + "_INFOMESSAGE" + lookupParts[2];
}

function getErrorMessageRowId(ns, comp) {
	var lookupParts = getLookupId(ns, comp);
	var id = lookupParts[0] + lookupParts[1] + "_ERRORROW" + lookupParts[2];
	var node = document.getElementById(id);
	if (node == null)	{
		lookupParts = getLookupId(ns, comp, true);
	}
	return lookupParts[0] + lookupParts[1] + "_ERRORROW" + lookupParts[2];
}

function getLookupId(ns, comp, p_keepRowParts) {
	var lookupId = comp.id;
	var rowPart = getRowPart(lookupId);
	var componentPart = getCompID(ns, lookupId);
	if (componentPart == null) componentPart = "";

	//strip off ns and component part...
	lookupId = lookupId.substring(ns.length + componentPart.length);

    if (lookupId.indexOf("_Selector") > 0) {
       lookupId = lookupId.substring(0, lookupId.lastIndexOf("_Selector"));
	   if (p_keepRowParts === true){
		   rowPart = "_R" + rowPart;
	   } else {
		   rowPart = "";
	   }
    }
	else {
		if (rowPart.length > 0) {
		 //take off _Rx
		 lookupId = lookupId.substring(0, lookupId.length - rowPart.length - 2);
		 rowPart = "_R" + rowPart;
		}
		if (comp.type == "radio" || comp.type == "checkbox"){
		 lookupId = lookupId.substring(0, lookupId.lastIndexOf("_"));
		}
		if (lookupId.indexOf(".") > 0)  {
		 lookupId = lookupId.substring(0, lookupId.lastIndexOf("."));
		}
		if (lookupId.indexOf(ns+"SEL_") == 0)  {
		 lookupId = lookupId.substring(4);
		}
		if (lookupId.indexOf(ns+"FS_") == 0)  {
		 lookupId = lookupId.substring(3);
		}
	}

	return [ns + componentPart, lookupId, rowPart];
}

function hideErrorMessage(ns, comp, styles) {
	if (comp == null) return;
	if (comp.tagName == "FIELDSET"){
		comp = comp.getElementsByTagName("input")[0];
	}
	if (comp == null) return;
	var errorMessageId = getErrorMessageId(ns, comp);
	var errorNode = document.getElementById(errorMessageId);
	if (errorNode){
		//bail out if QLR error
		if (jscss('check', errorNode, 'qlrError')) return;
		hide([errorNode], false, false, "Hide");
		setMandStyle(comp, "", false);
	}
	var errorRowId = getErrorMessageRowId(ns, comp);
	var errorRow = document.getElementById(errorRowId);
	if (errorRow){
		hide([errorRow], false, false, "Hide");
	}
	var styleArray = extractStyleArray(comp);
    if (styleArray)
       updateStyles(ns, comp, styleArray, "remove");
}

function extractStyleArray(tmp) {
	   //try and get the style array..
	   var oc;
	   var styleArray = null;
	   if (tmp.onchange)
	     oc = "" + tmp.onchange;
	   else if (tmp.type=="radio" || tmp.type=="checkbox" && tmp.onclick)
	     oc = "" + tmp.onclick;
	   else if (tmp.type=="radio" || tmp.type=="checkbox")
	     oc = "" + tmp.parentNode.parentNode.onclick;
	   else if (tmp.onblur)
	     oc = "" + tmp.onblur;
	   if(oc){
	        //try to work around reg-exprs if used in validation might have single or double quotes...
	        var styles = ( oc.lastIndexOf(" ['") > 0 && oc.lastIndexOf("']") > 0) ?
	                                oc.substring(oc.lastIndexOf(" ['") + 2, oc.lastIndexOf("']") + 1) :
	                                oc.substring(oc.lastIndexOf(" [\"") + 2, oc.lastIndexOf("\"]") + 1);
	        try{
	           styleArray = styles.replace(/'/g,'').replace(/"/g,'').split(',');
	        }
	        catch (e){}
	   }
	   return styleArray;
}

function setMandStyle(comp, style, error) {
 if (comp.type =="radio" || comp.type == "checkbox"){
  if (!error)  {
	var inputs = comp.parentNode.parentNode.getElementsByTagName("input");
	for (var i = 0; i < inputs.length ; i++ )	{
		setMandStyle (inputs[i].parentNode, style, error);
	}
  }
  else {
	comp = comp.parentNode;
  }
 }
 if(error){
	jscss("add", comp, "errorStyle");
 }
 else{
	jscss("remove", comp, "errorStyle");
 }
}

function updateStyles(ns, comp, styles, addInd, stylesStartIndex) {
	if (!styles) return;
	var index = stylesStartIndex ? stylesStartIndex : 0;
	if (styles[index + 7] == undefined){
		return;
	}
	//don't remove styles if qlr error...
	if (addInd == 'remove'){
		var errorMessageId = getErrorMessageId(ns, comp);
		var errorNode = document.getElementById(errorMessageId);
		if (errorNode){
			if (jscss('check', errorNode, 'qlrError')) return;
		}
	}
	var baseIdArray = getLookupId(ns, comp);
	var nsCompId = baseIdArray[0];
	var baseId = baseIdArray[1] + baseIdArray[2];
	jscss(addInd, document.getElementById(nsCompId + "row_" + baseId), styles[index]);
	jscss(addInd, document.getElementById(nsCompId + "p1_" + baseId),  styles[index + 1]);
	jscss(addInd, document.getElementById(nsCompId + "p2_" + baseId), styles[index + 2]);
	jscss(addInd, document.getElementById(nsCompId + "p3_" + baseId), styles[index + 3]);


	var p4El = document.getElementById(nsCompId + "p4_" + baseId);
	if (p4El){
  	var prevId = ""+ (p4El.previousSibling && p4El.previousSibling.id);
  	var nextId = ""+ (p4El.nextSibling     && p4El.nextSibling.id);

  	//if grouped with previous and first in gwp block, look for grouping fs, and set on parent.
  	if(p4El.previousSibling && p4El.previousSibling.nodeName == "LEGEND")
  		jscss(addInd, p4El.parentNode.parentNode.parentNode, styles[index + 4]);
  	//if part of a group, we don't use answer style....
  	else if (prevId.indexOf("p4_") > -1 || prevId.indexOf("p7_") > -1 || nextId.indexOf("p4_") > -1 || nextId.indexOf("p7_") > -1 )
  		;
  	else
  		jscss(addInd, document.getElementById(nsCompId + "p4_" + baseId), styles[index + 4]);
	}

	if (comp.tagName == "FIELDSET" && addInd == "remove"){
		var inputs = comp.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++){
			if (comp.type == "radio" || comp.type =="checkbox")
				jscss(addInd, comp.parentNode, styles[index + 5]);
			else
				jscss(addInd, comp, styles[index + 5]);
		}
	}
	else {
		if (comp.type == "radio" || comp.type =="checkbox")
			jscss(addInd, comp.parentNode, styles[index + 5]);
		else
			jscss(addInd, comp, styles[index + 5]);
	}
//	jscss(addInd, document.getElementById("postfix_" + baseId), styles[index + 6]);
	jscss(addInd, document.getElementById(nsCompId + "p5_" + baseId), styles[index + 7]);

	//in case of removing the error styles, check if warning or info styles should be applied
	if (addInd == 'remove'){
		var msgOrder = getVariable(ns, "MessagesOrder");
		if(!msgOrder || msgOrder == '') {
			msgOrder = 'Errors, Warnings, Info';
		}
		var order = msgOrder.split(", ");
		for(var i=0; i<= order.length; i++){
			if(order[i] == "Errors"){
				var errorMessage = document.getElementById(getErrorMessageId(ns, comp));
				if(errorMessage && (errorMessage.style.display != "none" && errorMessage.childNodes.length > 0)){
					//add error styles
					updateStyles(ns, comp, styles, "add", 0);
					return;
				}
				continue;
			} else if(order[i] == "Warnings"){
				var warningMessage = document.getElementById(getWarningMessageId(ns, comp));
				if(warningMessage && (warningMessage.style.display != "none" && warningMessage.childNodes.length > 0)){
					// add warning styles
					updateStyles(ns, comp, styles, "add", 9);
					return;
				}
				continue;
			} else if(order[i] == "Info"){
				var infoMessage = document.getElementById(getInfoMessageId(ns, comp));
				if(infoMessage && (infoMessage.style.display != "none" && infoMessage.childNodes.length > 0)){
					// add info styles
					updateStyles(ns, comp, styles, "add", 18);
					return;
				}
				continue;
			}
		}
		// add standard styles -  standard styles are added if NO error/warning/info styles are added
		updateStyles(ns, comp, styles, "add", 27);
	}
}

/*
 * This function moves each element that have the 'moveto' attribute in the element with id specified by the 'moveto' attribute
 * It is used to display the messages with position 'In Specified Id' in the appropriate place.
 * */
var isInitialMoveOfMessages = true;
function moveMessagesToTargetId(ns) {
	var attribute = 'moveto';
	//the messages with position 'In Specified Id' are rendered as div tags: change if rendering is changed
	var matchingElements = document.querySelectorAll('div[' + attribute + '], label[' + attribute + '], span[' + attribute + ']');

	var topOfPage = document.getElementById('EDGE_CONNECT_PROCESS').firstChild;
	var moveToElement;

	var isNewQuestion = true;
	var questionSpan;
	//iterate over messages
	for (var i = 0; i < matchingElements.length; i++)
	{
    var element = matchingElements[i];
		var isLastVisibleMessageOfQuestion = (i == matchingElements.length - 1) || checkLastMessageOfQuestion(element);
		//get all elements with the same id
		var existingElements = document.querySelectorAll(element.tagName +'[id=' + element.id + ']');
		// one item is minimun (the element itself this is the case when the page first loads)
		// more than one (actually is 2) is the case when is made an ajax update
		if(existingElements.length > 1)
		{
			for(var j = 0; j < existingElements.length; j++)
			{
				if(element != existingElements[j])
				{
					//remove the attribute and move the message tag
					element.removeAttribute(attribute);
					existingElements[j].parentElement.replaceChild(element, existingElements[j]);

					if (isLastVisibleMessageOfQuestion) {
						removeMessagesSeparator(ns, element);
					}
					break;
				}
			}
			break;
		}
		else
		{
			if (isInitialMoveOfMessages && isLastVisibleMessageOfQuestion) {
				removeMessagesSeparator(ns, element);
			}

			//get the id of the destination tag
			var moveToId = element.getAttribute(attribute);
			var moveToTopOfPage = moveToId == 'EDGE_CONNECT_PROCESS';

			if(moveToTopOfPage) {
				moveToElement = topOfPage;
			} else {
				//get the destination tag
				var moveToElement = document.getElementById(moveToId);
			}

			//remove the attribute and move the message tag
			element.removeAttribute(attribute);

			questionSpan = getQuestionMessagesSpan(ns, moveToElement, moveToTopOfPage, element);
			questionSpan.appendChild(element);
		}
	}
	isInitialMoveOfMessages = false;
}

// retrieves or creates the right span inside the "moveToElement" container where the message "element" should be added
function getQuestionMessagesSpan(ns, moveToElement, isTopOfPage, element) {
  var questionSpan = moveToElement.lastElementChild;
  var childLabel = element.querySelectorAll('label')[0];
  var forAttrValue = childLabel &&  childLabel.attributes["for"] && childLabel.attributes["for"].value || '';
  if(!forAttrValue)
  {
      forAttrValue = element &&  element.attributes["for"] && element.attributes["for"].value || '';
  }

  var questionSpanId = moveToElement.id + forAttrValue + "_MESSAGES";

	if ((questionSpan === null) || !(questionSpan.id === questionSpanId)) {
		var questionSpan = document.createElement("span");
		questionSpan.id = questionSpanId;
		if (isTopOfPage) {
			var messagesClasses = getVariable(ns, "MessagesContainerStyle");
			if (messagesClasses != null && messagesClasses != '') {
				questionSpan.className += messagesClasses;
			}
			questionSpan.style.width="100%";
			questionSpan.style.display="block";
		}
		moveToElement.appendChild(questionSpan);
	}
	return questionSpan;
}

//check if the current message is the last message VISIBLE for its question; if there are other messages for its question but they are not displayed, the function will return false
function checkLastMessageOfQuestion(element) {
	var currentElement = element;
	while (currentElement.nextSibling != null && currentElement.nextSibling.attributes["for"].value == currentElement.attributes["for"].value) {
		//if the next message is still for the same question check if it's visible
		currentElement = currentElement.nextSibling;
		if (currentElement.style.display != "none") {
			break;
		}
	}
	return (currentElement == element) || (currentElement.style.display == "none");
}

function removeMessagesSeparator(ns, element) {
	msElement = document.createElement("label");
	msElement.style.display  = "none";
	msElement.innerHTML = getVariable(ns, "MessagesSeparator");

	element.innerHTML = element.innerHTML.replace(new RegExp(msElement.innerHTML.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '$'), '');
}

/* Method that iterates over the Modernizr library and builds it up into a format
that the server then stores for use server side
*/
function fetchBrowserFeatures( p_formName )
{
	var form = document.forms[p_formName];
	if (form != null && form.BROWSER_FEATURES != null) {
		var m = Modernizr;
		if ( m != null ) {
			var c = "";
			for ( var f in m ) {
				if ( f[0] == '_' ) {
					continue;
				}
				var t = typeof m[f];
				if ( t == 'function' ) {
					continue;
				}
				c += (c ? '|' : '') + f + ':';
				if ( t == 'object' ) {
					for (var s in m[f]) {
						c += '/' + s + ':' + (m[f][s]?'1':'0');
					}
				} else {
					c += m[f] ? '1' : '0';
				}
			}c += ';';
			document.forms[p_formName].BROWSER_FEATURES.value = c;
		}
	}
}

function fetchBrowserFeaturesAndSubmit( p_formName )
{
    var form = document.forms[p_formName];
	if (form != null && form.BROWSER_FEATURES != null)
	{
		fetchBrowserFeatures( p_formName );
		ecSubmitForm(null, "REFRESH", null, null);
	}
}

window.widgetApi = (function () {

    var widgetApi = {};
    widgetApi.object_of_functions = {};
    widgetApi.widgets_list = [];

    function Widget(id) {
        this.id = id;
        this.controller = undefined;
        this.model_data = undefined;

        this.setId = function (id) {
            this.id = id;
        }
        this.getId = function () {
            return this.id;
        }
        this.setModel = function (model) {
            this.model_data = model;
        }
        this.getModel = function () {
            return this.model_data;
        }
        this.getModelFromDOM = function () {
            return JSON.parse(document.getElementById(this.id + "_model").innerHTML);
        }


        this.getController = function () {
            return this.controller;
        }

        this.setController = function (func) {
            this.controller = func;
            ;
        }
    }

    widgetApi.add = function (widgetId) {
        for (var i = 0; i < this.widgets_list.length; i++) {
            if (this.widgets_list[i].getId() == widgetId) return false;
        }

        var widget = new Widget(widgetId);
        this.widgets_list.push(widget);
        return true;
    }
//create = true ; if widgetID doesn't exist in list will be created;
    widgetApi.get = function (widgetId,create) {
        for (var i = 0; i < this.widgets_list.length; i++) {
            if (this.widgets_list[i].getId() == widgetId) return this.widgets_list[i];
        }
		if (create){
		widgetApi.add(widgetId);
		return this.widgets_list[i];
		}
        return false;
    }

    widgetApi.execute = function (widget) {

        if (!widget) return false;

        var model = widget.getModelFromDOM();
        if (JSON.stringify(widget.getModel()) == JSON.stringify(model)) return false;
        else widget.setModel(model);

        var fn = widget.getController();

        if (typeof fn !== "function" && model.controller) {
            fn = getObjectByPackageString(model.controller);
            (typeof fn === "function") && widget.setController(fn);
        }
        if (fn) {
            if (model == null) {
                //this mean is an older version of the edge  and we have to se  new Function(string) same thing as eval;
                // var newFunct = string function body  received from server this.AddOrReplaceFunction(widgetId,new Function(newFunct))
            }
            fn.call(model);

        }
    }

    widgetApi.runWidgetsScripts = function(text){
	    while (text.indexOf('<script type="application/json" ') > -1) {
	        var pos = text.indexOf('<script type="application/json"');
	        var id_pos_beg = text.indexOf('id="', pos) + 4;
	        var id_pos_end = text.indexOf('"', id_pos_beg);
	        var widgetID = text.substr(id_pos_beg, id_pos_end - id_pos_beg - 6);
	        if (widgetID != undefined && widgetID != "") {
	            if (document.getElementById(widgetID).style.display != "none") {
	                widgetApi.execute(widgetApi.get(widgetID, true));
	            }
	        }
	        text = text.substr(text.indexOf("</script", pos) + 9);
	    }
	}

    // usage widgetApi.namespace("com.temenos.tst");  create an empty namespace com.temenos.tst
    // or widgetApi.namespace("com.temenos.tst",window.com.temenos.widgets.edge.notifications) -- this create  com.temenos.tst namespace which will contain all window.com.temenos.widgets.edge.notifications properties
    widgetApi.namespace = function (identifier) {
        var Namespace = {};
        Namespace.separator = '.';
        var klasses = arguments[1] || false;
        var ns = window;

        if (identifier !== '') {
            var parts = identifier.split(Namespace.separator);
            for (var i = 0; i < parts.length; i++) {
                if (!ns[parts[i]]) {
                    ns[parts[i]] = {};
                }
                ns = ns[parts[i]];
            }
        }

        if (klasses) {
            for (var klass in klasses) {
                if (klasses.hasOwnProperty(klass)) {
                    ns[klass] = klasses[klass];
                }
            }
        }

        return ns;
    };
    widgetApi.triggerEvent = function (eventName) {
        if (document.createEvent) {
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            document.dispatchEvent(event);
        } else {
            document.documentElement[eventName]++;
        }
    }

    widgetApi.addEvent = function (eventName, callback) {
        if (document.addEventListener) {
            document.addEventListener(eventName, callback, false);
        } else {
            document.documentElement.attachEvent('onpropertychange', function (e) {
                if (e.propertyName == eventName) {
                    callback();
                }
            });
        }
    }

    widgetApi.removeEvent = function (eventName, callback) {
        if (document.removeEventListener) {
            document.removeEventListener(eventName, callback, false);
        } else {
            document.documentElement.detachEvent('onpropertychange', callback);
        }
    }

    widgetApi.getScript = function (url, success) {
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0], done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function () {

            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                // callback function provided as param
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
            ;
        };
        head.appendChild(script);
    };

    (function (funcName) {
        funcName = funcName || "docReady";
        var readyList = [];
        var readyFired = false;
        var readyEventHandlersInstalled = false;

        function ready() {
            if (!readyFired) {
                readyFired = true;
                for (var i = 0; i < readyList.length; i++) {
                    readyList[i].fn.call(window, readyList[i].ctx);
                }
                readyList = [];
            }
        }

        function readyStateChange() {
            if (document.readyState === "complete") {
                ready();
            }
        }

        widgetApi[funcName] = function (callback, context) {
            if (readyFired) {
                setTimeout(function () {
                    callback(context);
                }, 1);
                return;
            } else {
                readyList.push({fn: callback, ctx: context});
            }
            if (document.readyState === "complete") {
                setTimeout(ready, 1);
            } else if (!readyEventHandlersInstalled) {
                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", ready, false);
                    window.addEventListener("load", ready, false);
                } else {
                    document.attachEvent("onreadystatechange", readyStateChange);
                    window.attachEvent("onload", ready);
                }
                readyEventHandlersInstalled = true;
            }
        }
    })("docReady");

    widgetApi.onDocumentReady = function () {
        for (var i = 0; i < widgetApi.widgets_list.length; i++) {
            widgetApi.execute(widgetApi.widgets_list[i]);
        }

    };
    widgetApi.docReady(widgetApi.onDocumentReady);

    return widgetApi;

})();

/**
 * This method checks if there is a non-empty variable "itemsInError". If it finds it, then the variable will be displayed in a popup.
*/

function showServerSideValidationMessagesPopup(ns){
   var popupMessage = getVariable(ns,"itemsInError");
   if(popupMessage !== "" && popupMessage !== null && popupMessage.length>0)
   {
		alert(popupMessage);
   }
}

/**
 * This method decodes an HTML-encoded string. Useful for processing in JavaScript RTE generated texts.
 */
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

/**
* If page content flicker, please define variable "antiFlickeringMode" in template file, before tag "$$HEADCONTENT$" and set it to true.
* This will turn on functionality provided by below functions "hideHtmlElem()" and "showHtmlElem()", which will hide page content until it will be fully loaded.
*/
function ec_hideHtmlElem(ns) {
	var antiFlickeringMode = getVariable(ns, "antiFlickeringMode")
	if (antiFlickeringMode) {
    	document.getElementsByTagName('html')[0].style.visibility = "hidden";
	}
}

function ec_showHtmlElem(ns) {
	var antiFlickeringMode = getVariable(ns, "antiFlickeringMode")
	if (antiFlickeringMode) {
		document.getElementsByTagName('html')[0].style.visibility = "visible";
	}
}

function openExternalLink(url, tabName) {
    var a = document.createElement("a"), ev;
    a.href = url;
    a.target = tabName || "_blank";
    a.rel = (tabName == "_blank") ? "noopener noreferrer" : "";

    //IE doesn't allow to open an anchor that is not attached to the DOM
    document.body.appendChild(a);

    if (document.createEvent) {
        ev = document.createEvent('MouseEvents');
        ev.initEvent("click", true, true);
        a.dispatchEvent(ev);
    } else {
        ev = document.createEventObject();
        a.fireEvent('onclick', ev);
    }

    document.body.removeChild(a);
}

function showCmsDraftBanner(ns)
{
    showDraftBanner = getVariable(ns, "showDraftBanner")
	if(showDraftBanner && window.parent === window)
	{
		var theDiv = document.createElement("div");
		theDiv.setAttribute("style", "color: red;  background-color: lightgreen; text-align: center; border: 2px solid limegreen; font-weight: bold; font-family: sans-serif; padding-top: 2px;");
		theDiv.appendChild(document.createTextNode("This is DRAFT version"));	
		var body = document.getElementsByTagName("body")[0];
		body.insertBefore(theDiv, body.firstChild);
	}
}

/**
| Polyfill for IE regarding Element.matches
*/
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}

/**
| Basic keyboard navigation add-on for UXP standard tabs module;
| Works together with changeTab(tabName, ns, selStyle, tabStyle) from connect.js
| @param: node element from tab navigation
| @example: var tab_name = new StandardTabNavigator (document.getElementById('TAB_0011223344AABBCC'));
                tab_name.init();
*/
var StandardTabNavigator =  function(element) {
    // instantiate tab from tab navigation
    this.element = element;

    //helper for keycodes
    this.keyCode = Object.freeze({
        'TAB': 9,
        'RETURN': 13,
        'ESC': 27,
        'SPACE': 32,
        'PAGEUP': 33,
        'PAGEDOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40,
        'SHIFT': 'shiftKey'
    });
}

StandardTabNavigator.prototype = {
    init: function(){
        //bind add-on actions based on keycodes
        this.element.firstElementChild.addEventListener('keydown', this.handleKeydown.bind(this));
    },

    setFocusToNextItem: function(){
        this.validSibling(this.element, 'next').firstElementChild.focus();
    },
    setFocusToPreviousItem: function(){
        this.validSibling(this.element, 'prev').firstElementChild.focus();
    },

    //because we have <script> tags between the nav elements, we need to retrieve valid siblings
    validSibling: function(element, direction){

        if (direction === 'next' &&  element.nextElementSibling.nextElementSibling !== null){

            do{
                element = element.nextElementSibling;
            } while ( element.matches('script') );
        } else if( direction === 'prev' && element.previousElementSibling ) {

            do{
                element = element.previousElementSibling;
            } while ( element.matches('script') );

        }

        return element;
    },
    /* If focus is on active Tab Element, move focus to pane */
    handleTabKey: function(event){
        event.preventDefault();
        var elId = this.element.id,
            correspondingPane = document.getElementById('Pane' + elId),
            focusOnPane = function(){//move focus on Pane, on first element
                //get a list of focusable elements inside active Pane
                var focusables = correspondingPane.querySelectorAll('button, [href], input, select, textarea');
                //focus on first focusable in the list
                if(focusables[0]){
                    setTimeout(function(){
                        focusables[0].focus();
                    }, 0);
                }
            }
        ;
        //check if correspondent Pane of this Tab Element is open;
        if( window.getComputedStyle(correspondingPane).display !== 'none' ){
            focusOnPane();
        } else {
            return false;
        }
    },
    //keydown action manager
    handleKeydown: function( event ){
        var t = this;
        switch( event.keyCode ){
            case this.keyCode.TAB:
                if(!event.shiftKey){ //make sure is not Shift + Tab
                    this.handleTabKey(event);
                }
                break;
            case this.keyCode.LEFT:
                this.setFocusToPreviousItem();
                break;
            case this.keyCode.RIGHT:
                this.setFocusToNextItem();
                break;
            case this.keyCode.SPACE:
            case this.keyCode.RETURN:
                this.element.click();
                setTimeout(function(){
                    t.element.firstElementChild.focus();
                }, 10);
                break;
        }
    }
}
