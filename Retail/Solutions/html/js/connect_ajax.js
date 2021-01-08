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

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());

var AJAX_DEBUG=0;
var RESPONSE_ARRAY = new Array();

/* ***************************
** From http://worldtimzone.com/res/encode/?fld=dd%E5%80%8B%E7%AB%99mm%E5%80%8B%E7%AB%99yyyy
** 
** Most of this code was kindly 
** provided to me by
** Andrew Clover (and at doxdesk dot com)
** http://and.doxdesk.com/ 
** in response to my plea in my blog at 
** http://worldtimzone.com/blog/date/2002/09/24
** It was unclear whether he created it.
*/

var HEXCHARS = "0123456789ABCDEF";
var OK_URI_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

function utf8(wide) {
  var c, s;
  var enc = "";
  var i = 0;
  while(i<wide.length) {
    c= wide.charCodeAt(i++);
    // handle UTF-16 surrogates
    if (c>=0xDC00 && c<0xE000) continue;
    if (c>=0xD800 && c<0xDC00) {
      if (i>=wide.length) continue;
      s= wide.charCodeAt(i++);
      if (s<0xDC00 || c>=0xDE00) continue;
      c= ((c-0xD800)<<10)+(s-0xDC00)+0x10000;
    }
    // output value
    if (c<0x80) enc += String.fromCharCode(c);
    else if (c<0x800) enc += String.fromCharCode(0xC0+(c>>6),0x80+(c&0x3F));
    else if (c<0x10000) enc += String.fromCharCode(0xE0+(c>>12),0x80+(c>>6&0x3F),0x80+(c&0x3F));
    else enc += String.fromCharCode(0xF0+(c>>18),0x80+(c>>12&0x3F),0x80+(c>>6&0x3F),0x80+(c&0x3F));
  }
  return enc;
}


function toHex(n) {
  return HEXCHARS.charAt(n>>4)+HEXCHARS.charAt(n & 0xF);
}


function encodeURIComponentNew(p_param) {
  var s = utf8(p_param);
  var enc = "";
  for (var i= 0; i<s.length; i++) {
    if (OK_URI_CHARS.indexOf(s.charAt(i))==-1)
      enc += "%"+toHex(s.charCodeAt(i));
    else
      enc += s.charAt(i);
  }
  return enc;
}

function encodeParam(p_param)
{
	var encodedField;
	if (typeof encodeURIComponent == "function")
	{
		// Use JavaScript built-in function
		// IE 5.5+ and Netscape 6+ and Mozilla
		encodedField = encodeURIComponent(p_param);
	}
	else 
	{
		// Need to mimic the JavaScript version
		// Netscape 4 and IE 4 and IE 5.0
		encodedField = encodeURIComponentNew(p_param);
	}
	return(encodedField);
}

function getElementIdFromEvent(p_event)
{
	var elemId = "";
	var elem;
	if (p_event.srcElement) 
		elem = p_event.srcElement;
	else 
		elem = p_event.target;

	if (elem.tagName.toLowerCase() == "label" && elem.htmlFor != null)
		elemId = elem.htmlFor;
	else
		elemId = elem.id;
	return elemId;
}
	
function ajaxGetChartMap(p_controllerName, ns, p_context, p_chartId)
{
	//create chartmaps div if not already in template
	if(!document.getElementById("chartmaps")) {
		var div = document.createElement("div");
		div.setAttribute("id", "chartmaps");
		document.body.appendChild(div);
	}

	var url = "ajaxservletcontroller?MODE=" + prefixCompID(ns, p_chartId, "AJXChartMap") + "&CHARTID=" + p_chartId + "&namespace=" + ns + "&controllername=" + p_controllerName;
	//delay for chrome...
	setTimeout(function() { 
							send(p_context + url, true, "ajaxGetChartMap", ns);
			   }, 500);
}

function ajaxValidate(p_controllerName, ns, p_context, event, p_field, p_hasQuestionRules, p_inTable, targetId) 
{
	if (!this["beforeAjaxValidationService"] || beforeAjaxValidationService(p_controllerName, ns, p_context, event, p_field, p_hasQuestionRules, p_inTable, targetId))
	{
	  if (p_field == null) return; 
	    
	  var id = p_field.id;
		if (id == null || id == ""  || p_field.tagName.toLowerCase() == "fieldset"){
				id = getElementIdFromEvent(event);
				p_field = document.getElementById(id);
		}
	
	  if (p_field == null) return; 

	  id = p_field.id;
		if (id == null || id == ""  || p_field.tagName.toLowerCase() == "fieldset"){
				if (event.srcElement) p_field = event.srcElement;
				else p_field = event.target;
				id = p_field.id;
		}
	
		//bail out if no id...
		//We should only trigger validation on a date if all its parts have values.  
		if (id == null || id == "" || ! datePartsComplete(p_field, ns)) {
			return;
		}

		//store where errors are shown...
		var isValidTargetId = targetId != null && targetId.length > 0;
		if (isValidTargetId) {
			setVariable(ns, 'currentErrorTarget', targetId);
		}
	
		//Only trigger validation if field value has changed.
		var oldVal = getFocusValue(ns, p_field.id);//p_field.focusValue;//getVariable(ns, "focusValue");
		if (p_field.id != null) id = p_field.id;
		var newVal = getElementValue(p_field, ns);
		var proceed = true;
		
		if (p_hasQuestionRules && (oldVal != null && oldVal == newVal))
		{
			proceed = false;
		}
		
		if (proceed) {
			var param		= "";
			var rowPart	= "";
		
			if (id == null || id == ""  || p_field.tagName.toLowerCase() == "fieldset") {
				if (event.srcElement) p_field = event.srcElement;
				else p_field = event.target;
				id = p_field.id;
			}
			if (getRowPart(id).length > 0 && p_inTable)	{
				rowPart = id.substring(id.lastIndexOf("_R"));
			    id = id.substring(0, id.lastIndexOf("_R"));
			}
			//strip off any SEL_
			id = getFieldName(ns, id);
			if (p_field.type == "radio" && id.lastIndexOf("_") > 0){ // e.g a radio value
				id = id.substring(0, id.lastIndexOf("_"));
			}
			
			if (id.lastIndexOf(".") >= 0) {
			    id = id.substring(0, id.lastIndexOf("."));
			}
		
      var VAL_URL = "ajaxservletcontroller?MODE=" + prefixCompID(ns, id, "AJXValidate") + "&";

			var errorMsgRow = document.getElementById(id + "_ERRORROW");
			var errorMsgElemName = id + "_ERRORMESSAGE" + rowPart;
			if (errorMsgRow != null) errorMsgElemName = id + "_ERRORROW";
			
			var val = getElementValue(p_field, ns);
			if (val == null || val.length == 0)	{
        if ( p_field.validity && !p_field.validity.valid ) {
          val = "EC^INVAL^VAL"; // no value for an HTML5 invalid input so send something back to indicate it is wrong
        } else {
        	val = ""; //If we return when we don't have a value, de-selecting a checkbox will never execute question rules.
        }
      }
			
			var fieldName = "" + p_field.name;
			//strip off any SEL_
			fieldName = getFieldName(ns, fieldName);
			hideSuggestList("ec_suggest_" + id + rowPart, 250);
			var hiddenField = null;
			if (fieldName.length == 0) {
				hiddenField = document.getElementById(id + "_X" + rowPart);
				if (hiddenField != null) {
                    // check we are not a fake onchange from page submit as we don't want to reset the hidden; normal
                    // onchange will do that
                    var triggerReason = getTriggeredReason();
                    if (FORMAT_VALIDATION_TRIGGER != triggerReason && !IsValueASuggestion("ec_suggest_" + id + rowPart, val)) {
                      resetHiddenElement(p_field);
					}
					fieldName = hiddenField.name;
					if(val.length > 0 && hiddenField.value != null && hiddenField.value.length > 0) {
						val = hiddenField.value;
					}
					if (val.length == 0) {
						hiddenField.value = "";
					}
				}
			}
			param = fieldName + "=" + encodeParam(val);
			
		    // Start at 9 to skip first 9 fields, date parts are added to the end of the list ...
		    for (var i=9; i < arguments.length; i++ ) {
		        var elemID = prefixCompID(ns, id, arguments[i] + rowPart);
				var elem = document.getElementById(elemID);
				val = getElementValue(elem, ns);
				if (val == null || val.length == 0) {
			        updatePageWithObjectResponse(ns, "ajaxValidate", true 
			        							 [{"service": "AjaxValidationService",
												  "id":  id + "_ERRORMESSAGE" + rowPart,
												  "innerOrOuter": "INNER",
												  "text": "",
												  "actionFlag": "HIDE",
												  "actionData": errorMsgElemName}], 0);
			        return;
				}
				param += "&" + elem.name + "=" + encodeParam(val);
			}
			// make sure the form can support file upload
			if (p_field.type == "file")
			{
				document.getElementById("form1").setAttribute("enctype", "multipart/form-data");
			}
			
		    var fieldToUse = hiddenField != null ? hiddenField : p_field;		    
		    //callback method that ensures that also for async calls the result of the validation is interpreted correctly: collection invalidQuestions is updated
		    //the response from the ajax validation cannot be interpreted in this function as it will not be available at this moment of execution
		    var invalidateQuestionCallback = function(retVal)
		    {
		    	ns = ns || "";
				if (!retVal)
				{
					//add question to list of invalid questions
					var v = getVariable(ns, "invalidQuestions") || new Array();
					v[fieldToUse.id] = fieldToUse;
					setVariable(ns, "invalidQuestions", v);
				}
				else
				{
					//remove question from invalid questions
					var v = getVariable(ns, "invalidQuestions");
					if (v != null) 
					{
						delete v[fieldToUse.id];
					}
				}
		    }
			
			var url = VAL_URL + param   + "&namespace=" + ns + "&controllername=" + p_controllerName;
			var retVal;
			
			if (p_hasQuestionRules)
			{
		        incQ(ns);				
				retVal = send(p_context + url, false, "ajaxValidate", ns, invalidateQuestionCallback); //Synchronous call so that we can pass a result flag back.
				decQ(ns, "ajaxValidate", true);
		    }
		    else 
		    {
                incQ(ns);
                //there is no value returned by send (undefined) since the call is async and the result is not processed at this time. in this case the value returned by this function (retVal) is also undefined
				send(p_context + url, true, "ajaxValidate", ns, invalidateQuestionCallback);
				decQ(ns, "ajaxValidate", true);
		    }
					
		    return retVal;
		}
	}
}

function ajaxSubList(field, event, async, ns, controllerName, context, p_dependents)
{
	if ( getTriggeredReason() == FORMAT_VALIDATION_TRIGGER )
  {
  	return;
	}
  
	if (!this["beforeAjaxSubListService"] || beforeAjaxSubListService(field, event, ns, controllerName, context))
	{
		var comp = field;
		if (comp.id == null || comp.id == ""  || comp.tagName.toLowerCase() == "fieldset"){
			var compId = getElementIdFromEvent(event);
			comp = document.getElementById(compId);
		}
		else comp = document.getElementById(comp.id);
		
	    if (!comp.id) return; // ignore this event

		var name = comp.name;
		if (name.lastIndexOf("UNSEL_") == 0) {
			return; //don't send any requests if UNSEL changes.
		}

		var id = comp.id;
        //check that the value really has changed...
		var oldVal = getFocusValue(ns, id);//comp.focusValue;//getVariable(ns, "focusValue");
		var value = getElementValue(comp, ns);
		if (document.getElementById(id + "_X") != null)
		{
			if (value.length > 0)
				value = document.getElementById(id + "_X").value;
			name  = document.getElementById(id + "_X").name;
		}
		
		var newVal = value;

		//strip off any SEL_
		if (name.lastIndexOf("SEL_") == 0)	{
				name = name.substring(4);
		}
		if (id.lastIndexOf(ns+"SEL_") == 0)	{
				id = id.substring(4);
		}

		if (oldVal != newVal)
		{
			var url = "ajaxservletcontroller?MODE=" + prefixCompID(ns, id, "AJXList") + "&" + name + "=" + encodeParam(value) + "&id=" + id + "&namespace=" + ns + "&controllername=" + controllerName + "&key=" + name; 
			var dependents = p_dependents.split(",");
			for (var i = 0; i < dependents.length ;  i++)    {
		        var depID = dependents[i];
		        var depElem = document.getElementById(depID);
		        if  ( depElem != null ) // Need to allow for filtered radio button which may not be generated yet ..
		        {
    		        var depName = depElem.name;
    				if ( depName == null || depName.indexOf("UNSEL_") == 0) continue;
    				
    				if	( getRowPart(depID).length > 0 )
    				{
    					var tableID = depID.substring(0, depID.lastIndexOf("_R")+2);
    					var allElems = getForm(ns).elements;
    					var processed = new Array();
    					for (var x = 0; x < allElems.length; x++)
    					{
    						var tableElem = allElems[x];
    						if	( tableElem.id && tableElem.name && processed[tableElem.name] == null )
    						{
    						    processed[tableElem.name] = tableElem;
    							if (tableElem.id.length > tableID.length && tableElem.id.substring(0, tableID.length) == tableID)
                                {
                                    url = addToURL(url, tableElem, ns);
                                }
    						}
    					}
    				}
    				else
    				{
                        url = addToURL(url, depElem, ns);
    				}
		        }
		    }
			//Send request to ajaxservletcontroller.  Note that request is executed synchronously because the subsequent call to ajaxValidate() was stopping the update from ajaxSubList() when executed asynchronously (DEV3279). 
			//this is no longer the case, and can be asych.
			send(context + url, async, "ajaxSublist", ns);
		}
    }
}

function addToURL(p_url, p_elem, ns)
{
    var result = p_url;
    var name = p_elem.name;
    if (name.indexOf("UNSEL_") != 0)
    {
        if (name.indexOf("SEL_") == 0)  name = name.substring(4);
        var value = getElementValue(p_elem, ns);
        result += "&" + name + "=" + encodeParam(value);
    }
    return(result);
}

function ajaxButtonAction(ids, btn, buttonId, p_valMand, p_rowId, ns, controllerName, context, disableInput, inlineErrors, buttonConfirmMsg)
{
	//bail out if button is disabled...
	if (jscss('check',document.getElementById(buttonId),DISABLED_CLASS))
	{
		return false;
	}

	var compID = getCompID(ns, btn);
	if ( compID != null )
	{
	    btn = compID + btn.substring(compID.length+2);
	}
	else
	{
	    btn = btn.substring(2);
	}

	ids = findIdsToValidate(buttonId, ids, ns);
	if (!validateDependentItems(ids, btn, p_valMand, p_rowId, ns, inlineErrors)){
		return false;
	}

	if (!this["beforeAjaxButtonActionService"] || beforeAjaxButtonActionService(controllerName, ns, context, btn, disableInput, buttonId))
	{
		if (!displayConfirmMsg(buttonConfirmMsg)){
		    return false;
		}
		
		//call out to row clicks (if there are any) to set selectors...
		var obj = document.getElementById(buttonId);
		var aRow = obj;
		while((aRow = getParentRow(aRow)) != null){
			if(aRow.onclick){
				 execute(aRow, "onclick", CHANGED_SELECTION_TRIGGER);
			}				
		}
		
		urlProps = buildFormUrlParameters(ns, false, inlineErrors, false, true).value;
		incQ(ns);
		return postAjaxRunRulesRequest(context, ns, disableInput, 'AJXButtonAction', btn, buttonId, controllerName, urlProps);
	}
}

//Intercepts the call to ajaxButtonAction and passes in a modified "context" arg 
function wrapCallToAjaxButtonAction(overridenContext) 
{
	var originalAjaxButtonAction = ajaxButtonAction;
	ajaxButtonAction = function () 
	{
		arguments[7] = overridenContext;
		originalAjaxButtonAction.apply(this, arguments);
	};
}

function ajaxHelp(elId, qName, ns, controllerName, contextPath)
{
	var params = "MODE=" + prefixCompID(ns, qName, "AJXHelp") + "&id=" + elId + "&namespace=" + ns + "&controllername=" + controllerName;
	var url = (contextPath)?contextPath + "ajaxservletcontroller":"ajaxservletcontroller";
	makePOSTRequest(url, true, params, ns, "ajaxHelp");
}

function setQlrNok(ns){
	setVariable(ns,'qlrOk', 'N');
}

function setQlrOk(ns){
	setVariable(ns,'qlrOk', 'Y');
}


function ajaxQuestionAction(que, elemId, p_valMand, ns, controllerName, context, disableInput, event, inline, cmpWithFocus, ignoreErrors)
{
    if  ( getTriggeredReason() == FORMAT_VALIDATION_TRIGGER )
    {
        return;
    }
    
	//We should only trigger questions on a date if all its parts have values.  
	var elem = document.getElementById(elemId);

	if (elem.tagName.toLowerCase() == "fieldset"){
		elemId = getElementIdFromEvent(event);
		//ie8 and below don't like empty strings in doc.getElById()...
		if (elemId.length == 0) 
			return;
		elem = document.getElementById(elemId);
	}

	if (elem == null || ! datePartsComplete(elem, ns))
	{
		return;
	}

	var timeout = getTimeoutForAjaxQuestionAction( elem );
	if (elem.nodeName == 'SELECT')
	{
		// for select make the timeout longer to capture whether the user is just pressing the down cursor key to cycle through
		// the list
		if (getVariable(ns,'qlrOk') == 'N')
		{
			return;
		}
		timeout = getTimeoutForAjaxQuestionActionForSelect( elem );
	}
	
	if (this["beforeAjaxQuestionAction"])
	{
		beforeAjaxQuestionAction(controllerName, ns, context, elem, elemId, disableInput, ignoreErrors);
	}
	
	incQ(ns);
	setTimeout(function(){ajaxQuestionAction1(que, elemId, p_valMand, ns, controllerName, context, disableInput, inline, cmpWithFocus, ignoreErrors);}, timeout);
}

function getTimeoutForAjaxQuestionAction( elem )
{
	return 10;
}

function getTimeoutForAjaxQuestionActionForSelect( elem )
{
	return 500;
}
//  RTC 950992: update url properties with latest value for a question. It is called on onBlur event 
function replaceQuestionValueForName(urlProps,questionName,questionValue) {
    var re = new RegExp("([?|&])" + escapeRegExp(questionName) + "=.*?(&|$)","i");
    if (urlProps.match(re))
        return urlProps.replace(re,'$1' + questionName + "=" + questionValue + '$2');
    else
        return urlProps + '&' + questionName + "=" + questionValue;
}

function escapeRegExp(str) {
    return str.replace(/[.^$*+?()[{\\|\]-]/g, '\\$&');
}

function ajaxQuestionAction1(que, elemId, p_valMand, ns, controllerName, context, disableInput, inline, cmpWithFocus, ignoreErrors)
{
	var elem = document.getElementById(elemId);

	if (elem == null || ! datePartsComplete(elem, ns))
	{
		// dec queue item since one is always put on for QLR
		decQ(ns, "ajaxQLR", true);
		return;
	}

	setQlrNok(ns);
	setTimeout("setQlrOk('" + ns + "');", 400);
	
	if (!this["beforeAjaxQuestionActionService"] || beforeAjaxQuestionActionService(controllerName, ns, context, elem, disableInput, ignoreErrors))
	{
		var oldVal = getFocusValue(ns, elemId);
		var newVal = getElementValue(elem, ns);
		//If triggering question's value has changed, and any client-side field validation was successful, construct a string of name value pairs from the form and post them back to the server.
		var name = elem.name;
		var compPref = getCompID(ns, name);
		if (!compPref) compPref = "";
		
        if ( !cmpWithFocus || oldVal != newVal || (elem.nodeName == "SELECT" && name.indexOf(compPref+"SEL_") != 0) || ( newVal != null && elem.type == 'file' ) )
		{
			var urlParams = buildFormUrlParameters(ns, true, inline, false, false);
			var urlProps = urlParams.value;
			var sendRequest = urlProps.length > 0 && (urlParams.allValid || ignoreErrors);
			
			if ( this["afterAjaxQuestionActionValidation"] )
			{
				afterAjaxQuestionActionValidation(controllerName, ns, context, elem, elemId, disableInput, ignoreErrors, urlParams, sendRequest);
			}

			// test the props again incase hook added to it
			urlProps = urlParams.value;
			if ( urlProps.length > 0 && (urlParams.allValid || ignoreErrors) )
			{
				//add focused element: the focus should remain on the control that triggers the new fields to be revealed
				urlProps += ("&QLR_FOCUS_ELEMENT=" + elem.id);		
				urlProps =  replaceQuestionValueForName(urlProps, name, encodeParam(newVal));
				return postAjaxRunRulesRequest(context, ns, disableInput, 'AJXQuestionAction', que, elem.id, controllerName, urlProps);
			}
		}
		else if ( this["afterAjaxQuestionActionValidation"] )
		{
			afterAjaxQuestionActionValidation(controllerName, ns, context, elem, elemId, disableInput, ignoreErrors, new Object(), false);
		}
		
		// dec queue item since one is always put on for QLR
		decQ(ns, "ajaxQLR", true);
	}
}

function buildFormUrlParameters(ns, validateForm, inline, sendOnlyValid, includeFileInput)
{
	var urlProps = new Object();
	var rowSelectors = new Array();
	urlProps.allValid = true;
	urlProps.value = "";
	ns = ns || "";
	var idArr = getForm(ns).elements;
	var compArr = new Array();
	for (var i = 0; i < idArr.length; i++)
	{
		var el = idArr[i];
		var name = el.name;
		if (name != null && name.length > 0 && el.nodeName != "FIELDSET")
		{
			var compPref = getCompID(ns, name);
			if (!compPref) compPref = "";
			if (name.indexOf(compPref+"SEL_") == 0)	name = compPref + name.substring(compPref.length+4);
			if (name.indexOf(compPref+"UNSEL_") == 0) continue;

			if (el != null && !el.disabled && el.type != "button" && el.type != "hidden" && el.type != "image" && (includeFileInput || el.type != "file") && compArr[compPref+name] == null) // it may be hidden...
			{
				// send the value of the field to the server only if it's valid. otherwise, an Access Violation Error is thrown in the IDE. 
				if (sendOnlyValid == true && questionIsValid(ns, el, inline, false))
				{
					urlProps.value += "&" + name + "=" + encodeParam(getElementValue(el, ns));
				}
				else if (sendOnlyValid == false)
				{
					urlProps.value += "&" + name + "=" + encodeParam(getElementValue(el, ns));
				}
				if (el.id.indexOf(SELECTOR_INDICATOR) > 0) {
					rowSelectors.push(name);
				}
				
				//IN:006324 need to send back all active tabs, so don't store in comp array...
				if (name != "CONNECT_ACTIVE_TAB")
					compArr[compPref+name] = el;
				if (validateForm && !questionIsValid(ns, el, inline, false))
				{
					urlProps.allValid = false;
				}
			}
		}
	}
	if (rowSelectors.length > 0) {
		urlProps.value += "&ROW_SELECTORS_LIST=";
		for (var i = 0; i < rowSelectors.length; i++) {
			urlProps.value += rowSelectors[i] + ";";
		}
	}
	return urlProps;
}

function getFieldName(ns, name)
{
	if ( name && name != "" ){
      var compPref = getCompID(ns, name);
      if (!compPref) compPref = "";
      if (name.indexOf(compPref+"SEL_") == 0) {
    	name = compPref + name.substring(compPref.length+4);
      }
	}  
    return name;
}

//Checks whether all the date time parts been completed for a date field.
function datePartsComplete(elem, ns)
{
	if ((elem.name != null && elem.name.length > 0) && isDatePartFunctionName(elem.name))
	{
		var baseId = elem.id.substring(0, elem.id.indexOf("."));
		var rowIndex = "";
		if (getRowPart(elem.id).length > 0)		
		{
			rowIndex = elem.id.substring(elem.id.lastIndexOf("_R"));
		}
		var part = "";
		var newName = "";
		for (var i =0 ; i < DATE_TIME_PARTS.length; i++ )
		{
			part = DATE_TIME_PARTS[i];
			newName = baseId + "." + part.substring(0, part.length - 2) + rowIndex;
			var el = document.getElementById(newName);
			if (el && (getElementValue(el, ns).length == 0))
			{
				//Element exists but doesn't yet have a value.
				return false;
			}
		}
	}
	return true;
}

function questionIsValid(ns, elem, inline, wholeForm)
{
	if (ns == null) ns = "";
	var v = getVariable(ns, "invalidQuestions");
	if ( (v[elem.id] == null || wholeForm) && window.formatCheckElems ) {
		// need to make sure all elements are valid for client side validation otherwise security error		
		var formElms = wholeForm ? getFormElems(ns) : new Array( elem );
		if (doFieldValidation(null, null, false, formElms, false, ns, inline)) {
			return true;
		}
	} else if (v[elem.id] == null) {
		return true;
	}
	return false;
}

function getFocusValue(ns, id) {
	var arr = window[ns + "focusValue"];
	return arr[id];
}
function setUpFocusValue(ns, elem)
{
	var qS = getQSize(ns);
	if (elem != null && getTriggeredReason() == "")//&& qS == 0)
	{
		var val = getElementValue(elem, ns);
		if (val == null) val = "";
		var id = "";

		if (elem.id != null)
		{
			id = elem.id;
		}
		var x =  getVariable(ns, "focusValue");
		if (x == null || "string" == (typeof x)) {
			setVariable(ns, "focusValue", new Array());	
		}
		setArray(ns,"focusValue",id, getElementValue(elem, ns));
	}	 
}

function postAjaxRunRulesRequest(context, ns, disableInput, mode, key, id, controllerName, urlProps)
{
	var origTitle = document.title;
	if (disableInput)
	{
		//Disable other fields to prevent input until the question rules have finished running.
		var f = getForm(ns);
		suspendDocument(ns, document, f, id);
	}
	var params = "MODE=" + prefixCompID(ns,id, mode) + "&key=" + key + urlProps + "&id=" + id + "&namespace=" + ns + "&controllername=" + controllerName + "&disable=" + disableInput + "&title=" + encodeParam(origTitle);
	//this was incQ'ed at the start of QLR - since there is a timeout, we needed to keep something in the queue, to that it thought it was still processing...
	makePOSTRequest(context + "ajaxservletcontroller", true, params, ns, "ajaxQLR");	
	decQ(ns, "ajaxQLR", true);
}

function setDocumentTitle(title)
{
	document.title = title;
}

function postAjaxCMSalternativeRequest(alternativeID, cmsId, ns, controllerName, context)
{	
	var ns = ns ||"",
		controllerName = controllerName||"servletcontroller",
		context = context||"";
	//incQ(ns);
	var params = "MODE=" + prefixCompID(ns, cmsId, "AjaxCmsAlternative") + "&controllername="  + controllerName + "&namespace=" + ns + "&alternativeID="+alternativeID + "&id="+cmsId;
	//this was incQ'ed at the start of QLR - since there is a timeout, we needed to keep something in the queue, to that it thought it was still processing...
	makePOSTRequest(context + "ajaxservletcontroller", true, params, ns, "ajaxCmsRefreshCaller");	
	//decQ(ns, "ajaxCmsRefreshCaller", true);
	
}


function ajaxCmsListPaging(cmsListId, cmsListPage, ns, controllerName, context, cmsListAlternativeId)
{
	var params = "MODE=" + prefixCompID(ns, cmsListId, "AJXCmsListPaging") + "&cmsListId=" + encodeParam(ns + stripPrefix(ns, cmsListId)) + "&cmsListAlternativeId=" + encodeParam(cmsListAlternativeId) + "&cmsListPage=" + encodeParam(cmsListPage) + "&namespace=" + ns + "&controllername=" + controllerName;
	makePOSTRequest(context + "ajaxservletcontroller", true, params, ns, "ajaxCmsListPaging");
}


function ajaxTabs(tabId, tabName, triggers, selStyle, unselStyle, ns, controllerName, context)
{
	var tabPaneDiv = document.getElementById(buildCompID(ns, "Pane", tabId));
	if (tabPaneDiv != null && getFirstRealChild(tabPaneDiv) == null){
		var url = context + "ajaxservletcontroller?MODE=" + prefixCompID(ns, tabName, "AJXTabs") + "&tab=" + tabName;
		if (triggers.length > 0)
		{
			var triggerArr = splitstring(triggers, "|", false);
			for (var i = 0; i < triggerArr.length; i++){
				var trigger = triggerArr[i];
				var possTriggers = document.getElementsByName(trigger);
				for (var j = 0;  j < possTriggers.length; j++)
				{
					var trig = possTriggers[j];
					var value = getElementValue(trig, ns);
					url += "&" + trigger + "=" + value;
				}
			}
		}
		url += ("&namespace=" + ns + "&controllername=" + controllerName);
		url = addSubSessionIdToParameters( url, ns );
		url = addPageEIDToParameters( url );
	    sendForTabs(url, true, tabId, selStyle, unselStyle, ns);
	}
	else
	{
		//just change the tab as normal if the tab pane contents are already there
		changeTab(tabId, ns, selStyle, unselStyle);
	}
}

function sendForTabs(url, async, tabId, selStyle, unselStyle, ns){
   try{ url += getVariable(ns, "pageCode"); } catch(e){}
   var tabReq = createRequestObject();
   tabReq.type = "TAB";
   tabReq.open("GET", url, async);
   if (async)
   {
   	  tabReq.onreadystatechange = function()
   	  {
   	    callbackForTabs(true, tabReq, tabId, selStyle, unselStyle, ns);
   	  };
   	tabReq.send(null);
   }
   else
     {
   	tabReq.send(null);
    return callbackForTabs(false, tabReq, tabId, selStyle, unselStyle, ns);
   }
}

function callbackForTabs(async, tabReq, tabId, selStyle, unselStyle, ns) {
    var proceed = false;
	if (async)
	{
		if (tabReq.readyState == 4 && tabReq.status == 200)
			proceed = true;
	}
	else
	{
		proceed = true;
	}
	if (proceed)
	{
		var returnArray = [];

		try {
			if (this["beforeProcessResponse"]){
				beforeProcessResponse(ns, "Tabs", tabReq);
			}
			returnArray =JSON.parse(tabReq.responseText);

			for (var i = 0; i < returnArray.length ; i++)
			{
				updatePageWithObjectResponse(ns, "ajaxTabs", true, returnArray, i);
				changeTab(tabId, ns, selStyle, unselStyle);
			}
	    	if (this["postProcessResponse"]) {
	    		postProcessResponse(ns, "Tabs", true, tabReq);
			}

		}
		catch (e){
			log(tabReq.responseText);
		}
	}
}

function ajaxCheckHidden(questions, expr, keepColHeadings, saveData, naType, ns, controllerName, hasQLR, context, triggerComp)
{
    if  ( ns == null ) ns = "";
	setVariable(ns, 'CURRENT_FOCUS', triggerComp.id);
    var compID = triggerComp != null ? getCompID(ns, triggerComp.id) : null;
    if  ( compID == null ) compID = "";
    var nsCompID = ns + compID;
	var displayResultArr = checkHidden(questions, expr, keepColHeadings, saveData, naType, ns, compID);
	var qArr = splitstring(questions, "^", false);
	var keepColHeadingArr = splitstring(keepColHeadings, "^", false);
	var urlProps = "";
	
	for (var i = 0; i < qArr.length; i++) {
		if (displayResultArr[i]) {
			var theId = nsCompID+"p4_"+qArr[i];
			var qElem = document.getElementById(theId);
			if (qElem == null) {
				theId = nsCompID+"row_"+qArr[i];
				qElem = document.getElementById(theId);
			}
			if (qElem == null) {
				theId = nsCompID+"row_ansRow"+qArr[i];
				qElem = document.getElementById(theId);
			}
			if (qElem == null) {
				//Find one that starts with p1_, e.g. tables or headings
				theId = nsCompID+"p1_"+qArr[i];
				qElem = document.getElementById(theId);
				if (qElem == null) {
					theId = nsCompID+"p0_"+qArr[i];
					qElem = document.getElementById(theId);
					if (qElem == null) {
						theId = nsCompID+qArr[i];
						qElem = document.getElementById(theId);
						if (qElem == null)
						{
							var inTable = theId.lastIndexOf("_R") > -1;
							if (inTable)
							{
								var rowSuffix = theId.substring(theId.lastIndexOf("_R"));
								var rowSuffixRemoved = theId.substring(0, theId.lastIndexOf("_R"));
								if (rowSuffixRemoved.length > 6)
								{
									var sectionId = rowSuffixRemoved.substring(0, rowSuffixRemoved.length-6);
									var comp = document.getElementById(sectionId + rowSuffix);
									if (comp)
									{
										var ancestor = comp.parentNode;
										while (ancestor && ancestor.id.length == 0 && ancestor.parentNode)
										{
											ancestor = ancestor.parentNode;
										}
										if (ancestor && ancestor.id.length > 0 && ancestor.nodeName.toUpperCase() == "DIV")
										{
											//Linear table
											urlProps += (ancestor.id+"_Selector"+rowSuffix+"^");
										}
									}
								}
							}
						}
						else {
							var a = document.getElementById(nsCompID+"Pane" + qArr[i]);
							var b = qElem.getElementsByTagName("div");
							var c = b.length;
							if (a == null && (c == 0 || b[0].childNodes.length == 0)) {
								//spacing or...
								urlProps += (theId+"^");
							}
						}
					}
					else
					{
                        if (qElem.childNodes.length == 0)
                        {
                            urlProps += (qArr[i]+"^");
                        }
                    }
				}
				else
				{
					if (qElem.childNodes.length == 0 || jscss("check", qElem.childNodes[0], "ui-icon" ) )                    
					{
					    urlProps += (qArr[i]+"^");
                    }
				}
			}
			else {
				//TODO: find out whether a question is inside a table or not
				//Check for R1, etc.
				if (qArr[i].indexOf("_R") > -1 && keepColHeadingArr[i] == "true"){
					if(qElem.getElementsByTagName("div").length > 0) {
						qElem = qElem.getElementsByTagName("div").item(0);
					}
				}
				if (qElem.tagName == "TD") {
					if (qElem.getElementsByTagName("div").length == 0) {
						urlProps += (qArr[i]+"^");
					}
				}
				else if (qElem.tagName == "DIV") {
					var noChildren = true;
					for (var j = 0; j < qElem.childNodes.length; j++) {
						var childElem = qElem.childNodes[j];
						if (childElem.nodeType == 1) {
							noChildren = false;
							break;
						}
					}
					if (noChildren) {
						urlProps += (qArr[i]+"^");
					}
				}
			}
		}
	}
	
	if (urlProps.length > 0) {
		var url = context + "ajaxservletcontroller?MODE=" + compID + "AJXHiddens&questions=" + urlProps + "&namespace="+ns+"&controllername="+controllerName;
	    var formData = buildFormUrlParameters(ns, false, true, true, true).value;
		if (formData.length > 0) url += ("&" + formData);
		send(url, !hasQLR, "ajaxHiddens", ns);
	}
}

function ajaxAutoComplete(field, ns, controllerName, context)
{
	if (!this["beforeAjaxAutoCompleteService"] || beforeAjaxAutoCompleteService(field, ns, controllerName, context))
	{
        if (field != null && field.value != null && field.value != undefined)
	    {
		    var url = "ajaxservletcontroller?MODE=" + prefixCompID(ns, field.id, "AJXComplete") + "&id=" + field.id + "&value=" + encodeParam(field.value) + "&namespace=" + ns + "&controllername=" + controllerName;
        	send(context + url, true, "ajaxAutoComplete", ns);
	    }
    }
}


function ajaxTablePaging(tblid, tablename, tblpage, ns, controllerName, context)
{
	if (!this["beforeAjaxTablePagingService"] || beforeAjaxTablePagingService(tblid, tablename, tblpage, ns, controllerName, context))
	{
	    if ( this["clientSideValidation"] && this["formatCheckElems"] )
	    {
            if (!formatCheckElems(getFormElems(ns), ns)) return;
	    }
	    
	    var formData = buildFormUrlParameters(ns, false, true, false, true).value;
	    var params = "MODE=" + prefixCompID(ns, tblid, "AJXTablePaging") + "&t2=" + encodeParam(ns + stripPrefix(ns, tblid)) +"&t3=" + encodeParam(tablename) + "&t4=" + encodeParam(tblpage) + formData + "&namespace=" + ns + "&controllername=" + controllerName;
	    makePOSTRequest(context + "ajaxservletcontroller", true, params, ns, "ajaxTablePaging");
    }
}



function ajaxTableSorting(tblid, tablename, tablecol, direction, ns, controllerName, context)
{
	if (!this["beforeAjaxTableSortingService"] || beforeAjaxTableSortingService(tblid, tablename, tablecol, direction, ns, controllerName, context))
	{
        if ( this["clientSideValidation"] && this["formatCheckElems"] )
        {
            if (!formatCheckElems(getFormElems(ns), ns)) return;
        }
        var formData = buildFormUrlParameters(ns, false, true, false, true).value;
	    var params = "MODE=" + prefixCompID(ns, tblid, "AJXTableSorting") + "&t2=" + encodeParam(ns + stripPrefix(ns, tblid)) +"&t3=" + encodeParam(tablename) + "&t4=" + encodeParam(tablecol) + "&t5=" + encodeParam(direction) + formData + "&namespace=" + ns + "&controllername=" + controllerName;
	    makePOSTRequest(context + "ajaxservletcontroller", true, params, ns, "ajaxTableSorting");
    }
}

function getTableFormData(ns, tblid)
{
    var top = document.getElementById(ns + tblid);
    e = top.getElementsByTagName("input");
    
    var formData = "";
	var selector;
    for (var i=0; i < e.length; i++)
    {
      if (!e[i].disabled && e[i].type != "button" && e[i].type != "image" )
      {
          if (e[i].id != null && e[i].id.indexOf("_Selector_") > -1)
          {
		      if (selector == null)
			      selector = e[i];
		  }
		  else if (e[i].type != "checkbox" || e[i].checked)
			    formData += "&" + e[i].name + "=" + encodeParam(getElementValue(e[i], ns));
      }
    }
	if (selector != null)
		 formData += "&" + selector.name + "=" + encodeParam(getElementValue(selector, ns));
		 
	return formData;
}

function processBrowserNavigationButton() 
{
    if ( navigator.userAgent.toLowerCase().indexOf('opera') == -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1 )
    {
        history.go(-1);
    }
}

function ajaxBrowserNavigationCheck(p_pageParams, ns, p_controllerName, p_context)
{
    var params = "MODE=AjaxBrowserNavigationCheck" + p_pageParams + "&namespace=" + ns + "&controllername=" + p_controllerName;
    makePOSTRequest(p_context + "ajaxservletcontroller", false, params, ns, "AjaxBrowserNavigationCheck");
    var hasBrowserNavOccured = getVariable(ns, "AjaxBrowserNavigationCheck", "N");
    setVariable(ns, "AjaxBrowserNavigationCheck", null);
    return "Y" == hasBrowserNavOccured;
}

function createRequestObject(){
   var req;
   if (window.XMLHttpRequest) {
       req = new XMLHttpRequest();
	 }
   else if (window.ActiveXObject) {
		try {
		    	req = new ActiveXObject("Msxml2.XMLHTTP");
			}
		catch(e)
		{
		    try
				{
			    	req = new ActiveXObject("Microsoft.XMLHTTP");
				}
			catch(e) {
				alert("ActiveX must be installed and enabled to run the request - please check your browser settings.");
          		req = false;
        	}
		}
   }
   return req;
}

function incQ(ns)
{
    var inQ = getVariable(ns, "AJAX_QUEUE", 0 )+1;
    setVariable(ns, "AJAX_QUEUE", inQ);
}

function getQSize(ns)
{
  return getVariable(ns, "AJAX_QUEUE", 0 );
}

function decQ(ns, ajaxCaller, run)
{
    var inQ = getVariable(ns, "AJAX_QUEUE", 0);
    if  ( inQ > 0 )    {
        inQ--;
        setVariable(ns, "AJAX_QUEUE", inQ);
		if ( inQ == 0){
			//boolean returned to indicate if validation failed...
			var result = processResponses(ns, ajaxCaller, true);
			if (run)
			{
	    	    var func = getVariable(ns, "AJAX_QUEUE_FUNCTION");
	    	    setVariable(ns, "AJAX_QUEUE_FUNCTION", null );
	    	    resetReqId(ns);
	    	    if ( result && !isFormSubmitted(ns) ) {
		    	    if (func != null)  {
		    	        try {
	                        func();
	                    }
					    catch (e) {
	                    }
	           	    }
			    }
			}
            return result;
		}
		else {
			//RTC 899697: a sublist should be processed and displayed before the QLR is performed; otherwise we get a validation error
			// RTC 972515: a response received in case of NA should be processed and displayed before other JS calls based on it
			if (ajaxCaller == "ajaxSublist" || ajaxCaller == "ajaxHiddens"){
				return processResponses(ns, ajaxCaller, true);
    		}
		   // just get the result without doing the update
		   return processResponses(ns, ajaxCaller, false);
		}
    }
    return true;
}



function getReqId(ns)
{
  var reqId = getVariable(ns, "AJAX_REQ_ID", 0 );
  setVariable(ns, "AJAX_REQ_ID", reqId + 1);
  return reqId;
}

function resetReqId(ns)
{
	setVariable(ns, "AJAX_REQ_ID", 0);
}

function send(url, async, ajaxCaller, ns, customCallback){
	var dest = url.substring(0, url.indexOf("?"));
	var params = url.substring(url.indexOf("?") + 1);
	return makePOSTRequest(dest, async, params, ns, ajaxCaller, customCallback);
}

function makePOSTRequest(url, async, parameters, ns, ajaxCaller, customCallback) {
	parameters = addSubSessionIdToParameters( parameters, ns );
    parameters = addPageEIDToParameters( parameters );
	incQ(ns);
    if (async == null)
    {
        async = true;
    }
    var req = createRequestObject();
    var uid = getReqId(ns);
    if (this["beforeAjaxPOSTRequest"]) 
    {
    	try {
				beforeAjaxPOSTRequest(url, async, parameters, ns, ajaxCaller, req);
			} catch(e) {}
    }
    
    try{ parameters += getVariable(ns, "pageCode"); } catch(e){}
    req.open('POST', url, async);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if  ( async )
    {
      req.onreadystatechange = function()
      {
        var result = callback(async, req, ajaxCaller, ns, uid );
    	if (typeof customCallback == 'function' && req.readyState == 4 && req.status == 200) 
		{        	
    		customCallback(result);         
		}
      }
      req.send(parameters);
    }
    else
    {
      req.send(parameters);
      var result = callback(async, req, ajaxCaller, ns, uid );
      if (typeof customCallback == 'function') {
    	  customCallback(result);
      }
      return result;
    }
}

function callback(async, req, ajaxCaller, ns, uid) 
{
    try
    {
        if (this["afterAjaxPOSTRequest"]) 
        {
        	afterAjaxPOSTRequest(async, req, ajaxCaller, ns, uid);
        } 
        var proceed = false;
    	if (async)
    	{
    		if (req.readyState == 4) 
    		{ 
    			if(req.status == 200)
    			{
    				proceed = true;
    			} 
    			else if (req.status == 0) 
    			{
    				//dequeue-ing, 
    				decQ(ns, ajaxCaller, true);
    			}
    		}
    	}
    	else
    	{
             proceed=true;
    	}
    	
    	var result = true;
    	if (proceed){
			try	{
	    		if (this["beforeProcessResponse"]){
	    			beforeProcessResponse(ns, ajaxCaller, req);
	    		}
	    		RESPONSE_ARRAY = RESPONSE_ARRAY.concat(JSON.parse(req.responseText));
			} 
			catch (e) {
				log(e);
				log(req.responseText);
			}
			finally {
				// if q size is zero, the buffered responses are processed.
				result = decQ(ns, ajaxCaller, true);
			}
			
			if (this["postProcessResponse"]) {
        		postProcessResponse(ns, ajaxCaller, result, req);
    		}
			
        }
        return result;
	}
	finally	{
     
	}
}

function processResponses(ns, ajaxCaller, doUpdate)
{
	var respArray = RESPONSE_ARRAY;
	if (doUpdate){
	    RESPONSE_ARRAY = new Array();
	}
	return processAjaxResponses(ns, ajaxCaller, doUpdate, respArray);
}

function processAjaxResponses(ns, ajaxCaller, doUpdate, respArray)
{
	var result = true;
	for (var xx = 0;xx < respArray.length ; xx++ ) {
		var resObj = respArray[xx];
		if (hasAjaxValidationFailed(resObj)){
			result = false;
		}
		if (doUpdate) {
			if ( !updatePageWithObjectResponse(ns, ajaxCaller, doUpdate, respArray, xx) ){
				return false;
			}
			if(resObj.text.indexOf("moveTo")>0)
			{
				moveMessagesToTargetId();
			}
		}
	}
	if (doUpdate) {
		if  ( this["postProcessResponses"] ) {
			postProcessResponses(ns, ajaxCaller, result);
		}
		runWidgetAjaxHooks("postProcessResponses", ns, ajaxCaller, result);
		
	}
  return result;
}

//Check whether Ajax validation call returned an error messsage.
function hasAjaxValidationFailed(obj)
{
	var hasFailed = false;
    var service = obj.handler;//tok[0];
    var element = obj.id;//tok[1];
    var innerOrOuter = obj.innerouter;//tok[2];
    var text = obj.text;//tok[3];
    var actionFlag = obj.actionFlag;//(tok[4] != null)?tok[4]:"";
    var actionData = obj.actionText;//(tok[5] != null)?tok[5]:"";

	if ((service == "AjaxValidationService" && ((element.indexOf("ERRORMESSAGE") > 0 && actionFlag == "SHOW") || (actionFlag == "EVAL" && actionData.indexOf("alertComp") == 0))) ||
			(actionFlag == "EVAL" && actionData.indexOf("showError(") == 0))
    {
    	//If the previous call was for Ajax validation and it returned an error message to display, we know that Ajax validation failed.
    	//Popups are dealt with by calling alertComp
    	hasFailed = true;
    }
    return hasFailed;
}

//finds a date element and populates the subElementsArr (if passed) with the date sub-elements (year, month, day, hour, minute, second).
function findDateElementAndSubElements(element, subElementsArr) {
    var dateElementsArr = [];
    var isDate = false;
    for (var i = 0; i < DATE_TIME_SUFFIXES.length; i++)
    {
        var dateFieldElement = document.getElementById(element + DATE_TIME_SUFFIXES[i]);
        if (dateFieldElement != null)
        {
            isDate = true;
            dateElementsArr.push(dateFieldElement);
        }
    }

	if (!isDate)
	{
		return null;
	}
	if(subElementsArr != null)
	{
		subElementsArr.push.apply(subElementsArr, dateElementsArr);
	}
	return dateElementsArr[0];
}

//Finds an element. If the element is composed by sub-elements and subElementsArr is passed, then subElementsArr will contain the sub-elements
function findElement(element, innerOrOuter, subElementsArr)
{
	var dElement = document.getElementById(element);
	//if the parent begins with CELL + id, then use this....
	if (dElement != null && "CELL"+element == dElement.parentNode.id)
		dElement = dElement.parentNode;
	if (dElement == null) dElement = findDateElementAndSubElements(element, subElementsArr);
	if (dElement == null) dElement = document.getElementById("p1_"+ element);
	if (dElement == null) dElement = document.getElementById(element + "__QLR");
    if (dElement == null)    {
		d_element = dElement = document.getElementById(element + "_0");
		if (dElement == null || dElement == undefined)
		{
			//try taking _Rx off
			if (getRowPart(element).length > 0)
			{
				var rIndex = element.lastIndexOf("_R");
				element = element.substring(0, rIndex);
				dElement = document.getElementById(element);
			}
			if ((dElement == null || dElement == undefined) && (innerOrOuter != "NONE"))
			{
				if (AJAX_DEBUG) 
					alert("Ajax callback method. Can't find any tag with id="+element);
			}
		}
    } 

	return dElement;
}

function updatePageWithObjectResponse(ns, ajaxCaller, doUpdate, respArray, currPos) {
	var obj = respArray[currPos];
	
	var service = obj.handler;// tok[0];
	var element = obj.id;// tok[1];
	var innerOrOuter = obj.innerouter;// tok[2];
	var text = obj.text;// tok[3];
	var actionFlag = obj.actionFlag;// (tok[4] != null)?tok[4]:"";
	var actionData = obj.actionText;// (tok[5] != null)?tok[5]:"";

	var dElement;
  //none will be set by the controller for errors which we need to carry on with ..
	if ("none" != element) 
	{
		dElement = findElement(element, innerOrOuter);
		if (innerOrOuter != "NONE" && (!dElement || !dElement.id)) {
			return true; // Q. Really this should be logged .. maybe via an AjaxLogService?
		}
	}

	var continueProcessing = true;
	var hookResp = postAjaxCallHook(service, element, innerOrOuter, text, actionFlag, actionData, ajaxCaller, dElement, ns);

	if (hookResp === true || hookResp.continueAfterHook === true) {
		element 			= hookResp.element 		? hookResp.element 		: element;
		innerOrOuter     	= hookResp.innerOrOuter ? hookResp.innerOrOuter : innerOrOuter;
		text     			= hookResp.text 		? hookResp.text 		: text;
		actionFlag 			= hookResp.actionFlag 	? hookResp.actionFlag 	: actionFlag;
		actionData 			= hookResp.actionData 	? hookResp.actionData 	: actionData;
		dElement 			= hookResp.dElement 	? hookResp.dElement 	: dElement;
		continueProcessing  = processAjaxResponse(service, element, innerOrOuter, text, actionFlag,	actionData, ajaxCaller, dElement, ns, doUpdate, respArray, currPos);
	}
	postAjaxProcessingHook(service, element, innerOrOuter, text, actionFlag, actionData, ajaxCaller, dElement, ns);
	
	return continueProcessing;
}

function processAjaxResponse(service, element, innerOrOuter, text, actionFlag, actionData, ajaxCaller, dElement, ns, doUpdate, respArray, currPos) {
	if (innerOrOuter == "INNER") {
		var p4Ind = element.lastIndexOf("p4_");
		var inpId = element.substring(0, p4Ind) + element.substring(p4Ind + 3);
		var disabled = getDisabledState(ajaxCaller, inpId);
		dElement.innerHTML = text;
		restoreDisabledState(ajaxCaller, inpId, disabled);
	} else if (innerOrOuter == "OUTER") {
		setOuterHTML(dElement, text, service);
	} else if (innerOrOuter == "INNER_DIV") {
		dElement = getParentNode(dElement, "div");
		dElement.innerHTML = text;
	} else if (innerOrOuter == "INNER_APPEND") {
		dElement.innerHTML = dElement.innerHTML + text;
	} else if (innerOrOuter == "OUTER_DIV") {
		dElement = getParentNode(dElement, "div");
		setOuterHTML(dElement, text, service);
	} else if (innerOrOuter == "OUTER_TR") {
		dElement = getParentNode(dElement, "tr");
		setOuterHTML(dElement, text, service);
	} else if (innerOrOuter == "VALUE") {
		if (dElement) dElement.value = text;
	} else if (innerOrOuter == "HELP") {
		createHelpDiv(dElement, text, ns);
	} else if (innerOrOuter == "STYLECLASS") {
		if (dElement) dElement.className = text;
	} else if (innerOrOuter == "INLINESTYLE") {
		if (dElement) dElement.setAttribute("style", text);
	} else if (innerOrOuter == "HEAD_CONTENT") {
		addToHeadContent(text, actionData, ns, ajaxCaller, doUpdate, respArray, currPos);
		return false;
	} else if (innerOrOuter == "NONE") {
		// Do nothing
	} else {
		if (AJAX_DEBUG)
			alert("Ajax callback method. Called with wrong innerOrOuter argument. innerOrOuter=" + innerOrOuter);
		return true;
	}
	
	if (text.indexOf('script type="application/json') > -1) {
		 widgetApi.runWidgetsScripts(text); 
	}	
	
	if (innerOrOuter.indexOf("INNER") > -1) {
		// Run any script(s) that found inside the generated html. May contain an initialising script, for example.
		runScripts(text);
	} else if ((IE4 || SAFARI || ANDROID) && innerOrOuter.indexOf("OUTER") > -1) {
		// only IE needs to run scripts as when we replace the child in other browsers it will run the scripts and we don't want it running twice
		runScripts(text);
	}

	if (actionFlag == "SHOW" && actionData != "") {
		var actionElement = document.getElementById(actionData);
		showElem(actionElement, true);
	} else if (actionFlag == "HIDE" && actionData != "") {
		var actionElement = document.getElementById(actionData);
		showElem(actionElement, false);
	} else if (actionFlag == "EVAL" && actionData != "") {
		try{
			try {
				TRIGGERED_REASON.push(AJAX_RESPONSE_TRIGGER);
				if (ajaxCaller != "TetrisUpdate") {
					jsep.eval(actionData);
				} else {
					eval(actionData);// used for LD
				}
			} catch (e) {
				try {
					//indirect call of eval to set the context to global				
					runScriptAtLDLevel(actionData);					
				} catch (exc) {
					log(exc);
					throw(e);
				} 
			} 
			
			try {
				// run any <script>s which were inside the action data string
				runScripts(actionData);
			} catch (e) {
				throw(e);
			}
		} catch (e) {
			log(e);
			log(actionData);
		} finally {
			TRIGGERED_REASON.pop();
		}
	}

	// now run any onchange
	dElement = document.getElementById(element);
	if (dElement != null && dElement.onchange != null	&& ("" + dElement.onchange).indexOf("ajax") < 0)
		execute(dElement, "onchange", AJAX_RESPONSE_TRIGGER);

	if (text.indexOf("ec_suggest_") >= 0 && dElement.style.display !== "none" ) {
		setupIframe(dElement);
	}
	
	return true;
}

/* Strip of script tags and run any script(s) inside */
function runScripts(strcode)
{
  var scripts = new Array();        // Array which will store the script's code
  while(strcode.indexOf("<script") > -1 || strcode.indexOf("</script") > -1) {
	var s = strcode.indexOf("<script");
	var s_e = strcode.indexOf(">", s);
	var e = strcode.indexOf("</script", s);
	var e_e = strcode.indexOf(">", e);
	scripts.push(strcode.substring(s_e+1, e));
	strcode = strcode.substring(0, s) + strcode.substring(e_e+1);
  }
  
  for(var scriptIndex=0; scriptIndex<scripts.length; scriptIndex++) {
	try {
	  window.eval(scripts[scriptIndex]);
	}
	catch(ex) {
	  // do what you want here when a script fails
	  try {
		  //indirect call of eval to set the context to global	
		  runScriptAtLDLevel(scripts[scriptIndex]);
	  } catch(e) {
		  throw(e);
	  }
	}
  }
}

function addToHeadContent(p_text, p_headContent, p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_currPos) {
	// add the rest of the responses into their own array to invoke once we loaded the head content
	var localArray = new Array();	var j = 0;
	for (var i = p_currPos+1; i < p_respArray.length; i++)
	{
		localArray[j] = p_respArray[i];
		j++;
	}
	
	var typesArray = p_headContent.types;
	var urlsArray  = p_headContent.urls;
	
	setResourceQSize(p_ns, typesArray.length);
	loadResource(p_ns, p_ajaxCaller, p_doUpdate, localArray, typesArray, urlsArray, 0 );
}

function loadResource(p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex) {
	if ( p_arrayIndex < p_types.length && p_types.length == p_urls.length){
		// Create the correct type of element for the required resource
		var inline = false;
		if ( p_types[p_arrayIndex] == "js" ){
  		var newElem = document.createElement("script");
  		newElem.type = "text/javascript";
  		newElem.src = p_urls[p_arrayIndex];
		} else if ( p_types[p_arrayIndex] == "css" ) {
  		var newElem = document.createElement("link");
  		newElem.rel = "stylesheet";
  		newElem.type = "text/css";
  		newElem.href = p_urls[p_arrayIndex];
		}	else if ( p_types[p_arrayIndex] == "inline_js" ){
  		var newElem = document.createElement("script");
  		newElem.type = "text/javascript";
  		newElem.innerHTML = p_urls[p_arrayIndex];
  		inline = true;
		} else if ( p_types[p_arrayIndex] == "inline_css" ) {
  		var newElem = document.createElement("style");
  		newElem.type = "text/css";
  		newElem.innerHTML = p_urls[p_arrayIndex];
  		inline = true;
		}

		if (newElem) {
			if ( !inline ){
				// now let's wait for the resource to load before we load the next one
  			if (newElem.readyState) { // IE
  				newElem.onreadystatechange = function() {
  					if (newElem.readyState == "loaded" || newElem.readyState == "complete") {
  						newElem.onreadystatechange = null;
    					resourceLoaded(p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex);
  					}
  				};
  			} else { // Others
  				newElem.onload = function() {
  					resourceLoaded(p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex);
  				};
  			}
			} else {
				resourceLoaded(p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex);
			}
			
			// append the new element to HEAD
    	document.getElementsByTagName("head")[0].appendChild(newElem);
		} else {
			resourceLoaded(p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex);
		}
	}
}

function resourceLoaded( p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex ) {
	// load the next resources in the list
	loadResource(p_ns, p_ajaxCaller, p_doUpdate, p_respArray, p_types, p_urls, p_arrayIndex + 1);
	// dec the queue and if complete then we can process the rest of the ajax responses
	decResourceQ(p_ns, p_ajaxCaller, p_doUpdate, p_respArray);
}

function getResourceQSize(p_ns) {
	return getVariable(p_ns, "AJX_RES_Q", 0);
}

function setResourceQSize(p_ns, p_size) {
	return setVariable(p_ns, "AJX_RES_Q", p_size);
}

function incResourceQ(p_ns) {
	var inQ = getResourceQSize(p_ns) + 1;
	setResourceQSize(p_ns, inQ);
}

function decResourceQ(p_ns, p_ajaxCaller, p_doUpdate, p_respArray) {
	var inQ = getResourceQSize(p_ns);
	if (inQ > 0) {
		inQ--;
		setResourceQSize(p_ns, inQ);
		if (inQ == 0) {
			processAjaxResponses(p_ns, p_ajaxCaller, p_doUpdate, p_respArray);
		}
	}
	return true;
}

function postAjaxCallHook(p_service, p_element, p_innerOrOuter, p_text, p_actionFlag, p_actionData, p_ajaxCaller, p_dElement, ns)
{
	if (this["after" + p_service])
	{
		return this["after" + p_service](p_service, p_element, p_innerOrOuter, p_text, p_actionFlag, p_actionData, p_ajaxCaller, p_dElement, ns);
	}             
	return true;
}

function postAjaxProcessingHook(p_service, p_element, p_innerOrOuter, p_text, p_actionFlag, p_actionData, p_ajaxCaller, p_dElement, ns)
{
	var result = true;
	if (this["postProcess" + p_service])
	{
		result =  this["postProcess" + p_service](p_service, p_element, p_innerOrOuter, p_text, p_actionFlag, p_actionData, p_ajaxCaller, p_dElement, ns);
	} 
	
	if (p_service != "AjaxTetrisService" && this["postProcessAjaxTetrisService"])  
	{
		postProcessAjaxTetrisService(p_service, p_element, p_innerOrOuter);
	}

	return true;
}

function getDisabledState(callerType, elementId){
	var disabled = false;
	if (callerType == "ajaxSublist"){
		var subElement = document.getElementById(elementId);
		if (subElement){
			disabled = subElement.disabled; 
		}
		else {
		  subElement = document.getElementById("p4_" + elementId); // find the containing cell or div...
		  if (subElement){
			  disabled = (subElement.style.display == "none");
		  }
		}
	}
	return disabled;
}

function restoreDisabledState(callerType, elementId, initialDisabledState){
	if (callerType == "ajaxSublist"){
		var subElement = document.getElementById(elementId);
		if (subElement){
			subElement.disabled = initialDisabledState;
			if (document.getElementById(SELECT_LIST_PREFIX + elementId) != null){
				document.getElementById(SELECT_LIST_PREFIX + elementId).disabled = initialDisabledState;
			}
			if (document.getElementById(UNSELECT_LIST_PREFIX + elementId) != null){
				document.getElementById(UNSELECT_LIST_PREFIX + elementId).disabled = initialDisabledState;
			}
		}
	}
}

function setupIframe(div)
{
   var DivRef = div;
   showSuggetDiv(DivRef);
   var IfrRef = document.getElementById('ec_suggest_iframe');
   if (IfrRef != null)
   {
    IfrRef.style.width = DivRef.offsetWidth;
    IfrRef.style.height = DivRef.offsetHeight;
    IfrRef.style.top = findPosY(div);
    IfrRef.style.left = findPosX(div);
    IfrRef.style.zIndex = 2;
    IfrRef.style.display = "block";
   }
}

function showSuggetDiv(div)
{
   showElem(div, true);
}

function findPosX(obj)
{
    var curleft = 0;
    if (obj.offsetParent)
    {
        while (obj.offsetParent)
        {
            curleft += obj.offsetLeft;
            obj = obj.offsetParent;
        }
    }
    else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj)
{
    var curtop = 0;
    if (obj.offsetParent)
    {
        while (obj.offsetParent)
        {
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        }
    }
    else if (obj.y)
        curtop += obj.y;
    return curtop;
}

function setOuterHTML(elem, html, service)
{
  if(IE4 || ANDROID) 
  {
	  if (elem.nodeName == "TD" || elem.nodeName == "TH" ) //note td.outerHTML  (and th ) is readonly - so replace the inner!
	  {
		  var trimmedhtml = html.substring(html.indexOf(">") + 1, html.lastIndexOf("<"));
          elem.innerHTML = trimmedhtml;
		  
		  var styleStart = html.indexOf("style=");
		  var endFirstTag = html.indexOf(">");
		  if (styleStart >= 0 && styleStart <= endFirstTag){
			  styleStart += 7;
			  var styles = html.substring(styleStart, html.indexOf("\"", styleStart));
			  elem.style.cssText = styles;
		  }
		  else {
			 elem.style.cssText = "";
		  }

		  styleStart = html.indexOf("class=");
		  if (styleStart > -1) {
			  styleStart += 7;
			  if (styleStart <= endFirstTag){
				  elem.className = html.substring(styleStart, html.indexOf("\"", styleStart));
			  }
			  else {
			     elem.className = "";
			  }
		  }
		  else {
			  elem.className = "";
		  }
	  }
	  else if (elem.nodeName == "TR") {// Need to split and call this method again with the td html!
		  var startTrim = html.indexOf("<", html.indexOf(">"));
		  var trimmedhtml = html.substring(startTrim, html.lastIndexOf("<"));  //remove tr
		  // could be td or th...
		  var cellArray;
		  var cellType;
		  if (trimmedhtml.indexOf("<td") == 0){
			cellType = "<td";
			cellArray= trimmedhtml.split(cellType);
		  }
		  else {
			cellType = "<th";
			cellArray= trimmedhtml.split(cellType);
		  }
		  for (var i = 0; i < cellArray.length ;i++ ) {
			  //check to see the td has an id...
			  var idIndex = cellArray[i].indexOf("id=");
			  var endTag = cellArray[i].indexOf(">");
			  if (idIndex > -1 && idIndex < endTag){
				  var id = cellArray[i].substring(idIndex + 4, cellArray[i].indexOf('"', idIndex + 5));
				  var el = document.getElementById(id);
				  if (el != null) 
				  {
					  setOuterHTML(el, cellType + cellArray[i], service);
				  }
			  }
		  }
	  }
	  else
		elem.outerHTML = html;
  }
  else  
  {
    elem.outerHTMLInput = html;
    var range = elem.ownerDocument.createRange();
    range.setStartBefore(elem);
    var docFrag = range.createContextualFragment(html);
    TRIGGERED_REASON.push(REPLACE_CHILD_TRIGGER); //Stop Chrome running blur event handler
    elem.parentNode.replaceChild(docFrag, elem);
    TRIGGERED_REASON.pop();
  }
   if (service.indexOf("AjaxQuestionActionService") >= 0 || service.indexOf("AjaxButtonActionService") >= 0)
   {
	  //copy style attributes for QLR...
	  var styleStart = html.indexOf("style=") + 7;
  	  var endFirstTag = html.indexOf(">");
  	  if (styleStart >= 0 && styleStart <= endFirstTag){
		  var styles = html.substring(styleStart, html.indexOf("\"", styleStart));
		  if (styles.indexOf("display: none") >= 0){
			  elem.style.display = "none";
		  }
	  	  else {
		  	elem.style.display = "";
	  	}
     }
     else {
        elem.style.display = "";
  	}
  }
}

function hideSuggestList(suggestDivId, delay)
{
	if(document.getElementById(suggestDivId) == null)  return;
    if (delay != null && delay != undefined) setTimeout("document.getElementById('" + suggestDivId +"').style.display='none'", delay);
    else document.getElementById(suggestDivId).style.display="none";

    var IfrRef = document.getElementById('ec_suggest_iframe');
    if  (IfrRef != null)
    {
        IfrRef.style.display = "none";
    }
}

function hideSuggestListConstrained(inputId, suggestDivId, delay)
{
   var input = document.getElementById(inputId);
   if (input.value == null || input.value == undefined) hideSuggestList(suggestDivId, delay);
   if (IsValueASuggestion(suggestDivId, input.value)) hideSuggestList(suggestDivId, delay);   
}


function validAjaxAutoCompleteKeyPress(p_event)
{
  return(getKeyCode(p_event)!= 13) ;
}

function handleTab(inp, p_event, selStyle, isListType)
{
	var key=getKeyCode(p_event);
	if ( key == 9 /*tab*/ )
	{
		handleAutoSuggestChosen(inp, p_event, selStyle, isListType);
		return false;
	}
	else
	{
		return true;
	}
}

function suggestionKeyAction(inp, e, selStyle, ns, controllerName, context, isListType)
{
  var elid = inp.id;
  var key=getKeyCode(e);
  if (key == 40) changeSelectedSuggestion(elid, true, selStyle);
  else if (key == 38) changeSelectedSuggestion(elid, false, selStyle);
  else if (key == 13 /*return*/ || key == 9 /*tab*/) 
  { 
	  handleAutoSuggestChosen(inp, e, selStyle, isListType);
  }
  else ajaxAutoComplete(inp, ns, controllerName, context);
}

function handleAutoSuggestChosen(inp, evt, selStyle, isListType)
{
    // In IE 10 inp (passed in as this) does not refer to the input it refers to the window, this is only for the tab char
    // so attempt to get it from the event src instead
    if ( inp == null || inp.id == undefined || inp.id == "" ) 
    {
      // in IE passed in event is not valid onkeydown so instead use window.event
      // in IE the event has a srcElement rather than a target
      inp = evt ? (evt.target ? evt.target : evt.srcElement) : event.srcElement;
    }
	
	var elid = inp.id;
	var suggestDivId = "ec_suggest_"+elid;
    if (document.getElementById(suggestDivId).style.display != "none")
    {
      var value = getSelectedSuggestion(elid, selStyle);
	  if (isListType != null && isListType)
	  {
		  value = createInputWithListKey(inp, value);
	  }
	  
      if (value != null && value != undefined)
      { 
        inp.value = value;
        var dElement = document.getElementById(elid);
        if (dElement.onchange)
        {
          execute(dElement, "onchange", AJAX_RESPONSE_TRIGGER);
        }
        hideSuggestList(suggestDivId);
        return false;
      }
    }
}

function getSelectedSuggestion(elid, selStyle)
{
  var suggestDIV = document.getElementById("ec_suggest_"+elid);
  if (suggestDIV != null && suggestDIV != undefined)
  {
     for (var ci=0; ci<suggestDIV.childNodes.length; ci++)
     {
       var child = suggestDIV.childNodes[ci];
       if (child.tagName && child.tagName.toLowerCase() == "div" ) {
		 if (child.className == selStyle){
			 var val = "" + child.innerHTML;
			 val = val.replace(/&amp;/g, "&");
			 return val;
		 }
       }
     }
  }
}

function IsValueASuggestion(suggestId, value)
{
  var qId = suggestId.substring(11);//remove ec_suggest_ prefix
  var el = document.getElementById(qId);
  var suggestDIV = document.getElementById(suggestId);
  if (suggestDIV != null && suggestDIV != undefined) {
     for (var ci=0; ci<suggestDIV.childNodes.length; ci++) {
       var child = suggestDIV.childNodes[ci];
       if (child.tagName && child.tagName.toLowerCase() == "div" ) {
		 var check = child.innerHTML.replace(/&amp;/g, "&");
		 if (check.toLowerCase().indexOf(value.toLowerCase() + "<") == 0) {
			 //set the _X value if there is one...
			 createInputWithListKey(el, child.innerHTML);
			 return true;
		 }
       }
     }
  }
  return false;
}

function changeSelectedSuggestion(elid, down, selStyle)
{
  var suggestDIV = document.getElementById("ec_suggest_"+elid);
  var anySuggestions = suggestDIV != null && suggestDIV != undefined && suggestDIV.childNodes.length > 0;
  
  if (anySuggestions)
  {
     var firstDIV = null;
     var prevDIV = null;
     var currentDIV = null;
     var nextDIV = null;
     
     var i = 0;
     for (var ci=0; ci<suggestDIV.childNodes.length; ci++)
     {
       var child = suggestDIV.childNodes[ci];
       if (child.tagName && child.tagName.toLowerCase() == "div" )
       {
         if (i == 0)  firstDIV = child;
         if (child.className == selStyle) currentDIV = child;
         else if (currentDIV == null) prevDIV = child;
         else if (nextDIV == null) nextDIV = child;
         i++;
       }
     }
     if (currentDIV == null) {
       if (down) firstDIV.className = selStyle;
     }
     else if (down && nextDIV != null) {
       currentDIV.className = "";
       nextDIV.className = selStyle;
     }
     else if (!down && prevDIV != null) {
       currentDIV.className = "";
       prevDIV.className = selStyle;
     }
  }
}

function autoCompleteSetValue(inputId, suggestDivId, innerHTML, isListType)
{
    var dElement = document.getElementById(inputId);
    innerHTML = innerHTML.replace(/&amp;/g, "&");
    var value = (isListType != null && isListType) ? createInputWithListKey(dElement, innerHTML) : innerHTML;
    dElement.value = value;
    hideSuggestList(suggestDivId);
    if ( dElement.onchange && dElement.onchange != null	&& IE4 )
    {
      execute(dElement, "onchange", AJAX_RESPONSE_TRIGGER);
    }
    return false;
}

function resetHiddenElement(inpElem)
{
	var inpId = inpElem.id;
	var rowPart = "";
	if (getRowPart(inpId).length > 0)
	{
	    rowPart = inpId.substring(inpId.lastIndexOf("_R"));
	    inpId = inpId.substring(0, inpId.lastIndexOf("_R"));
	}
	var hiddenInput = document.getElementById(inpId + "_X" + rowPart);
	if (hiddenInput != null)
	{
		if (inpElem.value != null && inpElem.value.length > 0) {
			hiddenInput.value = inpElem.value;
		}
		else {
			hiddenInput.value = "";
		}
	}
}


function createInputWithListKey(inpElem, value)
{
	var inpId = inpElem.id;
	var rowPart = "";
	if (getRowPart(inpId).length > 0)
	{
	    rowPart = inpId.substring(inpId.lastIndexOf("_R"));
	    inpId = inpId.substring(0, inpId.lastIndexOf("_R"));
	}

    if (value != null && value != undefined)
    {
		var spanIndex = value.toLowerCase().indexOf("<span");
		if (spanIndex >= 0)
		{
			var key = value.substring(spanIndex);
			value = value.substring(0, spanIndex);
			var newSpan = document.getElementById(inpId + "key" + rowPart);
			var newInput;
			if (newSpan == null)
			{
				newSpan = document.createElement("span");
				inpElem.parentNode.appendChild(newSpan);
				newSpan.id = inpId+"key" + rowPart;
				newSpan.style.display = "none";
				var currentInput = document.getElementById(inpId + rowPart);
				newInput = currentInput.cloneNode(true);
				newInput.id = inpId + "_X" + rowPart;
				newSpan.appendChild(newInput);
				currentInput.name = "";
			}
			var val = key.substring(key.indexOf(">") + 1, key.indexOf("<", key.indexOf(">")));
			newInput = document.getElementById(inpId + "_X" + rowPart);
			newInput.value = val;
		}
	}
	return value;
}

function startJob(ns, caller, fieldId)
{
    incQ(ns);
}

function endJob(ns, caller, runQueuedMethod, fieldId)
{
    decQ(ns, caller, runQueuedMethod);
    //if (fieldId) setUpFocusValue(ns, document.getElementById(fieldId));
}

function runScriptAtLDLevel(scriptSrc) {
	return true;
}
 
/****************
*  pageEID STUFF
****************/

function addPageEIDToParameters( parameters )
{
    parameters += "&PAGEEID=" + pageEID;    
    return parameters;
}
