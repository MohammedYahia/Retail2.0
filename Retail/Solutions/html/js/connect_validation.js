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

/*****************
* VALIDATION STUFF
******************/

var DAY_SUFFIX = ".DAY";
var MONTH_SUFFIX = ".MONTH";
var YEAR_SUFFIX = ".YEAR";
var HOURS_SUFFIX = ".HOUROFDAY";
var MINUTES_SUFFIX = ".MINUTES";
var SECONDS_SUFFIX = ".SECONDS";
var DATE_SUFFIX = ".DATE";
var TIME_SUFFIX = ".TIME";

function validateRegularExpression(c, expr, min, max, message, ns, inline, styles){
  var ok = true;
  if (hasChanged(ns, c))
  {
	  if (!this["beforeValidation"] || this["beforeValidation"](c, getMsg(ns, "ValidationMessage"), null, null, min, max, message, null, null, ns, null, null, styles) ){
		if (!this["beforeValidateRegularExpression"] || beforeValidateRegularExpression(c, expr, min, max, message, ns, styles) ){
		  if (c.value == null || c.value.length == 0) {
			 if (inline) {
				hideErrorMessage(ns, c, styles);
		     }
			 updateStyles(ns, c, styles, "remove");
			 return true;
		  }
		  if (expr != ''){
			var regExp;
			try {
				regExp = new RegExp(expr);
			}
			catch (e)
			{
				log(e);
			}
			if (regExp && !regExp.test(c.value)){
		    if (message[0]!= null && message[0].length > 0) alertComp(c,message[0],ns, inline, styles);
		    else alertComp(c, getMsg(ns, "ValidationMessage"), ns, inline, styles);
		    ok = false;
		   }
		  }
		
		  if (ok) {
			if (inline) {
			    hideErrorMessage(ns, c, styles);
		    }
			updateStyles(ns, c, styles, "remove");
		  }
		
		 ok = ok ? checkRange(c, trim(c.value).length, "Length", min, max, message, ns, inline, null, styles): ok ;
		 }
	  }
	  if (this["afterValidateRegularExpression"]) 
	  {
		 ok = afterValidateRegularExpression(c, expr, min, max, message, ns, ok, styles);
	  }
	  if (this["afterValidation"]) 
	  {
		 ok = afterValidation(c, getMsg(ns, "ValidationMessage"), null, null, min, max, message, null, null, ns, null, null, ok, styles);
	  }
		if (!ok)
		{
			//add question to list of invalid questions
			if (ns == null) ns = "";
			var v = getVariable(ns, "invalidQuestions");
			if (v == null) v = new Array();
			v[c.id] = c;
			setVariable(ns, "invalidQuestions", v);
		}
		else
		{
			//remove question from invalid questions
			if (ns == null) ns = "";
			var v = getVariable(ns, "invalidQuestions");
			if (v != null) delete v[c.id];
		}
  }
  return ok;
}

function validFile(comp, validFileExts, min, max,  message, ns, inline, styles){
 var ok = false;
 var val = comp.value;
 if (!this["beforeValidation"] || this["beforeValidation"](comp, getMsg(ns, "InvalidUploadTypeMessage"), null, null, min, max, message, validFileExts, null, ns, null, null, styles) ){
  if (!this["beforeValidFile"] || beforeValidFile(comp, validFileExts, message, ns) ){
   if (val == null || val.length == 0){
    enableSubmit(ns, true);
    ok=true;
   }
   if (inline) {
    hideErrorMessage(ns, comp, styles);
   } 
     
   if (!ok){
	var errorMessage="";
	var anyErrors=false;
	
    if (validFileExts!=null && validFileExts.length>0 && !validateFileExtension(comp, validFileExts)){
     var validFileTypeStr="";
     for(var i = 0; i < validFileExts.length; i++){
      validFileTypeStr+=validFileExts[i] + " ";      
     }
     if(anyErrors)errorMessage =+ "&nbsp;&nbsp;";
     errorMessage += getMsg(ns, "InvalidUploadTypeMessage", "QUESTION_CONSTRAINT=" + validFileTypeStr);
     anyErrors=true;
    }
    if (max!=null && max.length>0 && !validateFileSize(comp,max)){
     if(anyErrors)errorMessage += "&nbsp;&nbsp;";
     errorMessage += getMsg(ns, "InvalidMaxFileSizeMessage", "QUESTION_CONSTRAINT=" + max);
     anyErrors=true;
    }
    
    if(anyErrors){  
     if (message[0]!= null && message[0].length > 0) alertComp(comp,message[0],ns, inline);
     else alertComp(comp,errorMessage, ns, inline);
     if (ns  == null) ns = "";   
     enableSubmit(ns, false);
     ok = false;
    }
    else
    {
     if (ns  == null) ns = "";
     enableSubmit(ns, true);
     ok=true;
    } 
   }
  }
 }
 if (this["afterValidFile"]) 
 {
	 ok = afterValidFile(comp, validFileExts, message, ns, ok);
 }
 if (this["afterValidation"]) 
 {
     ok = afterValidation(comp, getMsg(ns, "InvalidUploadTypeMessage"), null, null, min, max, message, validFileExts, null, ns, null, null, ok, styles);
 }
 // make sure the form can support file upload
 if (ok)
 {
     document.getElementById("form1").setAttribute("enctype", "multipart/form-data");
 }
 return ok;
}

function validateFileExtension(comp, validFileExts){
 found=false;
 if(validFileExts==null){
  found=true;
 }else{
  for(var i = 0; i < validFileExts.length; i++){
   if((comp.value.substr(comp.value.lastIndexOf(".")+1,comp.value.length).toLowerCase())==validFileExts[i].toLowerCase())
    found=true;
  }
 }
 return found;
}


function validateFileSize(comp, max)
{
 if (window.FileReader){ // ie10 and later plus all other browsers
  if (comp.files && comp.files[0]){
   var file = comp.files[0];
   if (file.size > (max*1024)){
	return false;
   }
  }
 }
 return true;
}

function validAlphaNumeric(comp, min, max, message, ns, inline, styles){
 return checkWithHook("ValidAlphaNumeric", comp, "AN", getMsg(ns, "InvalidAlphaNumericMessage"), null, null, min, max, message, null, null, ns, inline, null, null, styles);
}

function validAlpha(comp, min, max, message, ns, inline, styles){
 return checkWithHook("ValidAlpha", comp, "A", getMsg(ns, "InvalidAlphaMessage"), null, null, min, max, message, null, null, ns, inline, null, null, styles);
}

function validAllChars(comp, min, max, message, ns, inline, styles){
 return checkWithHook("ValidAllChars", comp, "AC", "", null, null, min, max, message, null, null, ns, inline, null, null, styles);
}

function validNum(comp, min, max, numberSymbols, message, ns, inline, styles, name, numType, invalidMessage, regEx) {
 var isOk = checkWithHook(name, comp, numType, getMsg(ns, invalidMessage), numberSymbols, null, min, max, message, null, null, ns, inline, null, null, styles);
 var num = comp.value;
 if (isOk && numberSymbols && numberSymbols.length > 0)
 {
   num = removeNumberFormating(comp.value, numberSymbols, true);
 
   if ( num != null && num.length > 0 )
   {
     if(num.charAt(0) =='-') num = '-'+num.substr(1).replace(regEx, "");
     else num = num.replace(regEx, "");

     var newnum = addNumberFormating(num, numberSymbols);
     if (newnum != num) 
      {
           comp.value = newnum;
     }
   }
 }
 return isOk;
}
function validNumeric(comp, min, max, numberSymbols, message, ns, inline, styles){
	return validNum(comp, min, max, numberSymbols, message, ns, inline, styles, "ValidNumeric", "N", "InvalidNumMessage", /^0+(?!$)/);
}
function validDouble(comp, min, max, numberSymbols, message, ns, inline, styles){
	return validNum(comp, min, max, numberSymbols, message, ns, inline, styles, "ValidDouble", "D", "InvalidDecimalMessage", /^0+(?!\.|$)/);
}

function validDateTime(dateObj, min, max, message, format, separator, ns, inline, styles){
 if (format == null) format = new Array("dd/mm/yyyy", "hh:mm:ss");
 if (separator == null) separator = new Array("/", ":", " ");
 return checkWithHook("ValidDateTime", dateObj, "VDT", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + unescape(format[0] + separator[2] + format[1])), null, null, min, max, message, format, separator, ns, inline, null, null, styles);
}

function validDateWeekTime(dateObj, min, max, message, format, separator, ns, inline, styles){
 if (format == null) format = new Array("ww/yyyy", "hh:mm:ss");
 if (separator == null) separator = new Array("/", ":", " ");
 return checkWithHook("ValidDateWeekTime", dateObj, "VDWT", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + unescape(format[0] + separator[2] + format[1])), null, null, min, max, message, format, separator, ns, inline, null, null, styles);
}

function validDateWeek(dateObj, min, max, message, format, separator, ns, inline, styles){
 if (format == null) format = "ww/yyyy";
 if (separator == null) separator = "/";
 return checkWithHook("ValidDateWeek", dateObj, "VDW", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + unescape(format)), null, null, min, max, message, format, separator, ns, inline, null, null, styles);
}

function validDate(dateObj, min, max, message, format, separator, ns, inline, styles){
 if (format == null) format = "dd/mm/yyyy";
 if (separator == null) separator = "/";
 return checkWithHook("ValidDate", dateObj, "VD", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + unescape(format)), null, null, min, max, message, format, separator, ns, inline, null, null, styles);
}

function validTime(dateObj, min, max, message, format, separator, ns, inline, styles){
 return checkWithHook("ValidTime", dateObj, "VT", getMsg(ns, "InvalidTimeMessage", "QUESTION_CONSTRAINT=" + format), null, null, min, max, message, format, separator, ns, inline, null, null, styles); 
}

function validDayDatePart(dayObj, monthObjName, yearObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidDayDatePart", dayObj, "VDP", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + format), monthObjName, yearObjName, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles);
 return validateOtherSplitParts(res, dayObj.id);
}

function validMonthDatePart(monthObj, dayObjName, yearObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidMonthDatePart", monthObj, "VMP", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + format), dayObjName, yearObjName, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles);
 return validateOtherSplitParts(res, monthObj.id);
}

function validYearDatePart(yearObj, monthObjName, dayObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidYearDatePart", yearObj, "VYP", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + format), dayObjName, monthObjName, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles);
 return validateOtherSplitParts(res, yearObj.id);
}

function validHourTimePart(hourObj, minObjName, secObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidHourTimePart", hourObj, "VHT", getMsg(ns, "InvalidTimeMessage", "QUESTION_CONSTRAINT=" + format), minObjName, secObjName, min, max, message, format, separator, ns, inline, null, null, styles);
 return validateOtherSplitParts(res, hourObj.id);
}

function validMinuteTimePart(minObj, hourObjName, secObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidMinuteTimePart", minObj, "VMT", getMsg(ns, "InvalidTimeMessage", "QUESTION_CONSTRAINT=" + format), hourObjName, secObjName, min, max, message, format, separator, ns, inline, null, null, styles);
 return validateOtherSplitParts(res, minObj.id);
}

function validSecondTimePart(secondObj, hourObjName, minObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidSecondTimePart", secondObj, "VST", getMsg(ns, "InvalidTimeMessage", "QUESTION_CONSTRAINT=" + format), hourObjName, minObjName, min, max, message, format, separator, ns, inline, null, null, styles);
 return validateOtherSplitParts(res, secondObj.id);
}

function validWeekDatePart(weekObj, yearObjName, min, max, clientMin, clientMax, message, format, separator, ns, inline, styles){
 var res = checkWithHook("ValidWeekDatePart", weekObj, "VWP", getMsg(ns, "InvalidDateMessage", "QUESTION_CONSTRAINT=" + format), "", yearObjName, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles);
 return res;
}

function validateOtherSplitParts(res, baseId) {
	 //don't do if already failed, or if it is being checked as part of other split part test...
	 if (!res || getTriggeredReason() == FORMAT_VALIDATION_TRIGGER) return res;

	 var currentPart = baseId.substring(baseId.lastIndexOf("."));
	 res = true;
	 var qRoot = baseId.substring(0, baseId.lastIndexOf("."));
	 res = validPart(qRoot, res, ".DAY", currentPart);
	 res = validPart(qRoot, res, ".MONTH", currentPart);
	 res = validPart(qRoot, res, ".YEAR", currentPart);
	 res = validPart(qRoot, res, ".HOUROFDAY", currentPart);
	 res = validPart(qRoot, res, ".MINUTES", currentPart);
	 res = validPart(qRoot, res, ".SECONDS", currentPart);
	 return res;
}

function validPart(root, res, part, currentPart) {
	var d = document.getElementById(root + part);
	if (res && d && currentPart != part) { 
		if ( d.onchange )
			res = execute(d, "onchange", FORMAT_VALIDATION_TRIGGER);
		else
			res = execute(d, "onblur", FORMAT_VALIDATION_TRIGGER);
	}
	return res;
}

function checkWithHook(hook, c, t, m, d1, d2, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles){
 var ok = true;
 if (!this["beforeValidation"] || this["beforeValidation"](c, m, d1, d2, min, max, message, format, separator, ns, clientMin, clientMax) ){
   if (!this["before" + hook] || this["before" + hook](c, m, d1, d2, min, max, message, format, separator, ns, clientMin, clientMax) ){
     ok = checkA(c, t, m, d1, d2, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles);
   }
 }
 if (this["after" + hook]){
	 ok = this["after" + hook](c, m, d1, d2, min, max, message, format, separator, ns, clientMin, clientMax, ok);
 }
 if (this["afterValidation"]){
	 ok = this["afterValidation"](c, m, d1, d2, min, max, message, format, separator, ns, clientMin, clientMax, ok);
 }
 if (!ok)
 {
	 //add question to list of invalid questions
	  if (ns == null) ns = "";
	  var v = getVariable(ns, "invalidQuestions");
	  if (v == null) v = new Array();
	  v[c.id] = c;
	  setVariable(ns, "invalidQuestions", v);
	  c.setAttribute("aria-invalid", "true");
	  c.setAttribute("aria-describedby", c.id+"_ERRORMESSAGE" );
 }
 else
 {
	 //remove question from invalid questions
	if (ns == null) ns = "";
	var v = getVariable(ns, "invalidQuestions");
	if (v != null) delete v[c.id];
	c.removeAttribute("aria-invalid");
	c.removeAttribute("aria-describedby");
 }
 return ok;
}

function checkA(c, t, m, d1, d2, min, max, message, format, separator, ns, inline, clientMin, clientMax, styles) {
 var ok = true;
 var tmp = getElementValue(c, ns);
 if (tmp == null || tmp == "") {
   if ( c.validity && !c.validity.valid ) {
     ok = false;
   } else {	 
     var isInMandError = isFieldInMandError(ns, c.id);	
     if ( !isInMandError ){
       if (inline) {
	     hideErrorMessage(ns, c, styles);
       }
       updateStyles(ns, c, styles, "remove");
     }  
     return true;
   }  
 }
 
 if ( ok ) {
   var els = null;
  
   if (t == "N" || t == "D"){
     if ( d1 && d1.length > 0 ) tmp = removeNumberFormating(tmp, d1, false);
   }   
  
   if      (t == "A")    ok = isAlpha(tmp);
   else if (t == "AN")   ok = isAlphanumeric(tmp);
   else if (t == "AC")   ok = true;
   else if (t == "N")    ok = isClientInteger(tmp);
   else if (t == "D") {
     var dSChar = ".";
     if ( d1 && d1.length > 0 ) dSChar = "" + d1.charAt(0);
     ok = isClientDouble(tmp, dSChar);
   }
   else if (t == "VDP")  ok = isDay(tmp);
   else if (t == "VMP")  ok = isMonth(tmp);
   else if (t == "VWP")  ok = isWeek(tmp);
   else if (t == "VYP")  ok = isYear(tmp);
   else if (t == "VHT")  ok = isHour(tmp);
   else if (t == "VMT")  ok = isMinute(tmp);
   else if (t == "VST")  ok = isSecond(tmp);
   else if (t == "VT")   ok = isTime(tmp, format, separator);
   else if (t == "VD") {
     var v = nDate(tmp, format, separator, ns);
     if (v != null) {
       c.value = v;
       ok = true;
     } else {
       ok = false;
     }	 
   }
   else if (t == "VDT") {
     var v = nDateTime(tmp, format, separator, ns);
     if (v != null) {
       c.value = v;
       ok = true;
     } else {
       ok = false;
     }	 
   }
   else if (t == "VDWT") {
     var v = nDateWeekTime(tmp, format, separator, ns);
     if (v != null) {
       c.value = v;
       ok = true;
     } else {
       ok = false;
     }	 
   }
   else if (t == "VDW") {
     var v = nDateWeek(tmp, format, separator, ns);
     if (v != null) {
       c.value = v;
       ok = true;
     } else {
       ok = false;
     }	 
   }
 }
 if (!ok){
  //for hour/minute/second, we need time validation message...
  var errorMessageIndex = 0;
  if (t == "VHT" || t == "VMT" || t == "VST" || t == "VT") {
	  errorMessageIndex = 5;
  }
  var errorMsg = ( message[errorMessageIndex] && message[errorMessageIndex].length > 0) ? getMsg("@GOT_MSG@", message[errorMessageIndex], "QUESTION_CONSTRAINT=" + format) : m;
  return alertComp(c, errorMsg, ns, inline, styles);
 }
 else{
  if (getForm(ns)) {
   els = getForm(ns).elements;
  }
   if (inline) {
		hideErrorMessage(ns, c, styles);
   }
   updateStyles(ns, c, styles, "remove");
  
  if (t.charAt(0) == "A") return checkRange(c, tmp.length, "Length", min, max, message, ns, inline, null, styles);
  else if (t == "N"){
   if (min.indexOf("+") == 0) min = min.substring(1);
   if (max.indexOf("+") == 0) max = max.substring(1);
   return checkRange(c, mpi(tmp), "Value", min, max, message, ns, inline, d1, styles);
  }
  else if (t == "D"){
   if (min.indexOf("+") == 0) min = min.substring(1);
   if (max.indexOf("+") == 0) max = max.substring(1);
   if ( d1 && d1.length > 0 ) tmp = removeNumberFormating(tmp, d1, true);
   return checkRange(c, mpd(tmp), "Value", min, max, message, ns, inline, d1, styles);
  }
  else if (t == "VDP") return validDateParts(c, c, els[c.name.substring(0, c.name.lastIndexOf(".")) + d1], els[c.name.substring(0, c.name.lastIndexOf(".")) + d2], min, max, clientMin, clientMax, format, separator, ns, inline, message, styles);
  else if (t == "VMP") return validDateParts(c, els[c.name.substring(0, c.name.lastIndexOf(".")) + d1], c, els[c.name.substring(0, c.name.lastIndexOf(".")) + d2], min, max, clientMin, clientMax, format, separator, ns, inline, message, styles);
  else if (t == "VYP") return validDateParts(c, els[c.name.substring(0, c.name.lastIndexOf(".")) + d1], els[c.name.substring(0, c.name.lastIndexOf(".")) + d2], c, min, max, clientMin, clientMax, format, separator, ns, inline, message, styles);
  else if (t == "VD" || t == "VDT") {
    var valToTest = c.value;
    if ( t == "VDT" ){
      var tInd = valToTest.indexOf(separator[2]);
      if ( tInd > -1 ) {
        valToTest = valToTest.substring(0, tInd);
      }
      format = format[0]; separator = separator[0];
    }  
    if (!checkMinDate(c, valToTest, min, format, separator, ns, inline, clientMin, message, styles)) return false;
    if (!checkMaxDate(c, valToTest, max, format, separator, ns, inline, clientMax, message, styles)) return false;
    return true;
  }
  else if (t == "VDW" || t == "VDWT") {
    var valToTest = c.value;
  	if ( t == "VDWT" ){
      var tInd = valToTest.indexOf(separator[2]);
      if ( tInd > -1 ) {
        valToTest = valToTest.substring(0, tInd);
      }
      format = format[0]; separator = separator[0];
    }  
    if (!checkMinDateWeek(c, valToTest, min, format, separator, ns, inline, clientMin, message, styles)) return false;
    if (!checkMaxDateWeek(c, valToTest, max, format, separator, ns, inline, clientMax, message, styles)) return false;
    return true;
  }
 }
 return true;
}

function trim(text){
  return text.replace(/^\s+|\s+$/g,'');
}

function isAlpha(c){
 var x;
 c = c.toUpperCase();
 for (var i = 0; i < c.length; i++){
  x = c.charAt(i);
  if (!isLetter(x) && !isSpecial(x)) return false;
 }
 return true;
}

function isAlphanumeric(c){
 var x;
 c = c.toUpperCase();
 for (var i = 0; i < c.length; i++){
  x = c.charAt(i);
  if (!isDigit(x) && !isLetter(x) && !isSpecial(x)) return false;
 }
 return true;
}

/*
 * This kind of expresion $$anytext$ is not allowed in any text area
 */
function isLegalExpresion(c, styles) {
	
	var tmp = c.value;
	
	if (tmp != null && tmp.length != 0) {
		var regExp = new RegExp('\\$(%|\\$).*[a-zA-Z0-9_-].*\\$');
		if (regExp.test(c.value)){
			alertComp(c, getMsg("", "ValidationMessage"), "", true, styles);
			return false;
		}
	}
	return true;
}

function isClientInteger(s, numberSymbols){
 return isInt(s, numberSymbols);
}
function isInteger(s){
 return isInt(s, ".,");
}
function isInt(s, numberSymbols){
 if (s.length == 0) return true;
 var gSymbol;
 if (numberSymbols && numberSymbols.length > 1) gSymbol = numberSymbols.charAt(1);
 for(var i = 0; i < s.length; i++){
  if (i == 0 && (s.charAt(i) == "-" || s.charAt(i) == "+")) {
   if (s.length == 1) return false;
   continue;
  } 
  if (!isDigit(s.charAt(i))){ 
   if(!(gSymbol && gSymbol != "" && (s.charAt(i) == gSymbol)))return false;
  }
 }
 return true;
}

function isClientDouble(s, numberSymbols){
 return isDbl(s, numberSymbols);
}
function isDouble(s){
 return isDbl(s,".,");
}
function isDbl(s, numberSymbols){
	s = removeNumberFormating(s, numberSymbols, true);
	return !isNaN(parseFloat(s)) && isFinite(s);
}

function isDigit(c){
 return ((c >= "0") && (c <= "9"));
}

function isLetter(c){
 return ((c >= "A") && (c <= "Z"));
}

function isSpecial(c){
 return (c == " " || c == "'");
}

function isTime(val, format, separator){
 var arr_parts  = splitstring(val, separator, false, true);
 var arr_format = splitstring(format, separator, false, true);

 for (var i = 0 ; i < arr_format.length; i++ )
 {
     if (arr_parts[i] == "" || isNaN(arr_parts[i]) || parseInt(arr_parts[i]) < 0 ) return false;
     
     if (arr_format[i] == "hh"){ 
         if (parseInt(arr_parts[i]) > 23) return false;
     }
     else { 
         if (parseInt(arr_parts[i]) > 59) return false;
     }
 }
 return true;
}

function addNumberFormating(strValue, numberSymbols){
  var decimalSymbol = numberSymbols.charAt(0);
  var groupSymbol = numberSymbols.charAt(1);
  var parts = new Array();
  var s = strValue + "";
  if (s.length > 0 && s.charAt(0) == ".") s = "0" + s;
  parts = splitstring(s, '.', false, true);
  var hasGroupSymbol = numberSymbols.charAt(1) == "Y";
  if (hasGroupSymbol){
    groupSymbol = numberSymbols.charAt(2);
    if (groupSymbol && groupSymbol != ""){
      var objRegExp = new RegExp('(-?\\d+)(\\d{3})');
      while(objRegExp.test(parts[0])) parts[0] = parts[0].replace(objRegExp, '$1'+groupSymbol+'$2');
    }
  }
  if (parts[1]) return parts[0] + decimalSymbol + parts[1];
  else return parts[0];
}

function removeNumberFormating(strValue, numberSymbols, replaceDecimalSymbol){
  if (strValue && strValue != "") { 
    var transformedValue = strValue;
    var parts;
    var decimalSymbol = numberSymbols.charAt(0);
    if (decimalSymbol && decimalSymbol != "")   {
      if (transformedValue.charAt(0) == decimalSymbol) transformedValue = "0" + transformedValue;
      parts = splitstring(transformedValue, decimalSymbol, false, true);    
      if (parts.length == 1 || parts.length == 2) transformedValue = parts[0];
    }  
    var hasGroupSymbol = numberSymbols.charAt(1) == "Y";
    if (hasGroupSymbol){
      var groupSymbol = numberSymbols.charAt(2);
      if (groupSymbol && groupSymbol != "") {
        var validateGroupSymbolPosition = numberSymbols.charAt(3) == "Y";
        if (validateGroupSymbolPosition) {
          var firstDigit = 0;
          if (transformedValue.charAt(0) == '-') firstDigit = 1;
          for (var i = transformedValue.length - 4; i > firstDigit; i -= 4) {
            var charAt = transformedValue.charAt(i);
            if (charAt != groupSymbol && !isDigit(charAt)) {
              return strValue;
            } else if (charAt == groupSymbol) {
              transformedValue = transformedValue.substring(0, i) + transformedValue.substring(i + 1);
            } else {
              i++;
            }
          }
        } else {
          var grpRegExp = new RegExp(groupSymbol, "g");
          if ("[\^$.|?*+()".indexOf(groupSymbol) != -1) grpRegExp = new RegExp("\\"+groupSymbol, "g");
          transformedValue = transformedValue.replace(grpRegExp,'');
        }
      }  
    }  
    strValue = transformedValue;  
    if (decimalSymbol && decimalSymbol != "" && parts.length == 2) {
      if (replaceDecimalSymbol) strValue = strValue + "." + parts[1];
      else strValue = strValue + decimalSymbol + parts[1];
    }  
  }
  return strValue;
}

function checkRange(comp, val, text, min, max, message, ns, inline, numberSymbols, styles){
 if (!checkMin(comp, val, min, text, message, ns, inline, numberSymbols, styles)) return false;
 if (!checkMax(comp, val, max, text, message, ns, inline, numberSymbols, styles)) return false;
 return true;
}

function checkMax(comp, val, max, text, message, ns, inline, numberSymbols, styles){
 if (max == "") return true;
 var val1 = "" + val;
 var val2 = "" + max;
 if (isInteger(val1) && isInteger(val2)){
  val1 = mpi(val1);
  val2 = mpi(val2);
 }
 else if (isDouble(val1) && isDouble(val2)){
  val1 = mpd(val1);
  val2 = mpd(val2);
 }
 if (val1 > val2){
  if (message[2].length > 0) alertComp(comp, message[2], ns, inline, styles);
  else{
   if (numberSymbols && numberSymbols.length > 0) val2 = addNumberFormating(val2, numberSymbols);
   alertComp(comp,getMsg(ns, "InvalidMax" + text + "Message", "QUESTION_CONSTRAINT=" + val2),ns, inline, styles);
   }
  return false;
 }
 return true;
}

function checkMin(comp, val, min, text, message, ns, inline, numberSymbols, styles){
 if (min == "") return true;
 var val1 = "" + val;
 var val2 = "" + min;
 if (isInteger(val1) && isInteger(val2)){
  val1 = mpi(val1);
  val2 = mpi(val2);
 }
 else if (isDouble(val1) && isDouble(val2)){
  val1 = mpd(val1);
  val2 = mpd(val2);
 }
 if (val1 < val2){
  if (message[1].length > 0) alertComp(comp,message[1],ns, inline, styles);
  else{
   if (numberSymbols && numberSymbols.length > 0) val2 = addNumberFormating(val2, numberSymbols);
   alertComp(comp,getMsg(ns, "InvalidMin" + text + "Message", "QUESTION_CONSTRAINT=" + val2),ns, inline, styles);
  }
  return false;
 }
 return true;
}

function mpi(n, defaultVal){
 if (n == null && defaultVal != null) n = "" + defaultVal;
 else n = "" + n; 
 while (n != null && (n.charAt(0) == '0') && (n.length>1)) n = n.substring(1);
 return parseInt (n,10);
}

function mpd(n){
 n = "" + n;
 while ((n.charAt(0) == '0') && (n.length>1)) n = n.substring(1);
 return parseFloat(n);
}

function validDateParts(focusObj, dayObj, monthObj, yearObj, min, max, clientMin, clientMax, format, separator, ns, inline, message, styles){
 if ((dayObj != null && dayObj.value == "") || (monthObj != null && monthObj.value == "") || (yearObj != null && yearObj.value == ""))
  return true;
 var intYear = (yearObj == null ? getCurrentYear(ns) : parseInt(yearObj.value,10));
 var intMonth = (monthObj == null ? 1 : mpi(monthObj.value, 1));
 var intDay = (dayObj == null ? 1 : mpi(dayObj.value, 1));
 if (intDay > daysInMonth[intMonth]){
  return alertComp(dayObj, ( message[3] && message[3].length > 0 ) ? message[3] : getMsg(ns, "InvalidDaysInMonthMessage"), ns, inline, styles);
 }
 else if ((intMonth == 2) && (intDay > daysInFebruary(intYear))){
  return alertComp(yearObj, ( message[4] && message[4].length > 0 ) ? message[4] : getMsg(ns, "InvalidLeapYearMessage"), ns, inline, styles);
 }
 if ( min == "" && max == "" ) return(true);
 
 var newValue = intDay + "/" + intMonth + "/" + intYear;
 var newFormat = "dd/mm/yyyy";
 var newSeparator = "/";
 
 var arr_min = splitstring(min, "/",false);
 var arr_max = splitstring(max, "/",false);
 
 // Need to ban dd/mm/yyyy from date seperators!
 if ( format.indexOf("dd") < 0 )
 {
     arr_min[0] = "1";
     arr_max[0] = "1";
 }
 if ( format.indexOf("mm") < 0 )
 {
     arr_min[1] = "1";
     arr_max[1] = "1";
 }
 if ( format.indexOf("yyyy") < 0 )
 {
     arr_min[2] = getCurrentYear(ns);
     arr_max[2] = getCurrentYear(ns);
 }
 
 var newMin = arr_min[0] + "/" + arr_min[1] + "/" + arr_min[2];
 var newMax = arr_max[0] + "/" + arr_max[1] + "/" + arr_max[2];
 
 if (min != "" && !checkMinDate(focusObj, newValue, newMin, newFormat, newSeparator, ns, inline, clientMin, message, styles)) return false;
 if (max != "" && !checkMaxDate(focusObj, newValue, newMax, newFormat, newSeparator, ns,  inline, clientMax, message, styles)) return false;
 
 return true;
}

function getCurrentYear(ns)
{
	return(getVariable(ns, "CURRENT_YEAR"));
}

function nDateTime(dt, format, separator, ns){
 if((dt==null) || (dt=="")) return null;
 var index = dt.indexOf(separator[2]);
 if ( index > -1 ) {
   var datePart = dt.substring(0, index);
   var timePart = dt.substring(index+1);
   datePart = nDate(datePart, format[0], separator[0], ns); 
   if ( datePart == null ) return null;
   if ( !isTime(timePart, format[1], separator[1]) ) {
     return null;
   }
   return datePart + separator[2] + timePart;
 } else {
   return nDate(dt, format[0], separator[0], ns);
 }
}

function nDateWeekTime(dt, format, separator, ns){
 if((dt==null) || (dt=="")) return null;
 var index = dt.indexOf(separator[2]);
 if ( index > -1 ) {
   var datePart = dt.substring(0, index);
   var timePart = dt.substring(index+1);
   datePart = nDateWeek(datePart, format[0], separator[0], ns); 
   if ( datePart == null ) return null;
   if ( !isTime(timePart, format[1], separator[1]) ) {
     return null;
   }
   return datePart + separator[2] + timePart;
 } else {
   return nDateWeek(dt, format[0], separator[0], ns);
 }
}

function nDate(dt, format, separator, ns){
 if((dt==null) || (dt=="")) return null;
 var arr_parts = splitstring(stripTrailingChars(dt,separator), separator,false, true);
 var arr_format = splitstring(stripTrailingChars(format,separator), separator,false);

 if(arr_parts.length != arr_format.length) 
  return null;

 this.dd = "1"; this.mm = "1"; this.yy = getCurrentYear(ns);

 var dateString = null;

 if (arr_format.length > 0) {
  if (arr_format[0] == "dd")        if (isNaN(arr_parts[0])) return null; else this.dd=mpi(arr_parts[0]);
  else if (arr_format[0] == "mm")   if (isNaN(arr_parts[0])) return null; else this.mm=mpi(arr_parts[0]);
  else if (arr_format[0] == "yyyy") if (isNaN(arr_parts[0])) return null; else this.yy=mpi(arr_parts[0]);

  dateString = "";
  if (arr_parts[0].length == 1) 
	  dateString = "0";
  dateString += arr_parts[0];
 }

 if (arr_format.length > 1){
  if (arr_format[1] == "dd")        if (isNaN(arr_parts[1])) return null; else this.dd=mpi(arr_parts[1]);
  else if (arr_format[1] == "mm")   if (isNaN(arr_parts[1])) return null; else this.mm=mpi(arr_parts[1]);
  else if (arr_format[1] == "yyyy") if (isNaN(arr_parts[1])) return null; else this.yy=mpi(arr_parts[1]);

  dateString += separator;
  if (arr_parts[1].length == 1) 
	  dateString += "0";
  dateString += arr_parts[1];
 }

 if (arr_format.length > 2){
  if (arr_format[2] == "dd")        if (isNaN(arr_parts[2])) return null; else this.dd=mpi(arr_parts[2]);
  else if (arr_format[2] == "mm")   if (isNaN(arr_parts[2])) return null; else this.mm=mpi(arr_parts[2]);
  else if (arr_format[2] == "yyyy") if (isNaN(arr_parts[2])) return null; else this.yy=mpi(arr_parts[2]);

  dateString += separator;
  if (arr_format[2].length == 1) 
	  dateString += "0";
  dateString += arr_parts[2];
 }
 if(isDate(""+this.yy,""+this.mm,""+this.dd)) {
  return dateString;
 }
 else 	{
  return null;
 }

}

function nDateWeek(dt, format, separator, ns){
 if((dt==null) || (dt=="")) return null;
 var arr_parts = splitstring(stripTrailingChars(dt,separator), separator,false, true);
 var arr_format = splitstring(stripTrailingChars(format,separator), separator,false);

 if(arr_parts.length != arr_format.length) 
  return null;
 
 this.ww = 1; this.yy = getCurrentYear(ns);

 var dateString = null;

 if (arr_format.length > 0) {
  if (arr_format[0] == "ww")        if (isNaN(arr_parts[0])) return null; else this.ww=mpi(arr_parts[0]);
  else if (arr_format[0] == "yyyy") if (isNaN(arr_parts[0])) return null; else this.yy=mpi(arr_parts[0]);

  dateString = "";
  if (arr_parts[0].length == 1) 
   dateString = "0";
  dateString += arr_parts[0];
 }

 if (arr_format.length > 1){
  if (arr_format[1] == "ww")        if (isNaN(arr_parts[1])) return null; else this.ww=mpi(arr_parts[1]);
  else if (arr_format[1] == "yyyy") if (isNaN(arr_parts[1])) return null; else this.yy=mpi(arr_parts[1]);

  dateString += separator;
  if (arr_parts[1].length == 1) 
   dateString += "0";
  dateString += arr_parts[1];
 }
 
 if ( isWeek(this.ww) && isYear(""+this.yy) ){
  return dateString;
 }
 else {
  return null
 }
 
}

function setFocus(obj){
  if (obj) {
    try {
      if (document.querySelectorAll) {
          //see if there is an element with id = id + _editor (for rich_t_e)
          var lookup = obj.id + "_editor";
          var els = document.querySelectorAll("." + lookup);
          if (els.length > 0)
        	  obj = els[0];
      }
      
      if ( obj.type && obj.type == "text" ) obj.select();
      obj.focus();
      setTimeout(function(){try{obj.focus();}catch (e){}}, 100);
    } 
    catch (e) {
    }
  }
  return false;
}

function isDate (year, month, day){
 if (! (isYear(year) && isMonth(month) && isDay(day))) 
  return false;
 var intYear = parseInt(year,10);
 var intMonth = mpi(month);
 var intDay = mpi(day);
 if (intDay > daysInMonth[intMonth]) 
  return false;
 if ((intMonth == 2) && (intDay > daysInFebruary(intYear))) 
  return false;
 return true;
}

function checkMaxDate(comp, val, max,  format, sep, ns, inline, clientMax, message, styles){
 var retVal = true;
 if (max == "") return retVal;
 var Dt = new nDate(val,  format, sep, ns);
 var Dub = new nDate(max,  format, sep, ns);
 if (Dt.yy > Dub.yy) retVal=false;
 if(Dt.yy == Dub.yy){
  if ( (Dt.mm > Dub.mm) ||  ((Dt.mm == Dub.mm) && (Dt.dd > Dub.dd))) retVal=false;
 }
 if (!retVal){
  return alertComp(comp, ( message[2] && message[2].length > 0 ) ? message[2] : getMsg(ns, "InvalidMaxDateMessage", "QUESTION_CONSTRAINT=" + ((clientMax == null) ? max : clientMax)), ns, inline, styles);
 }
 return true;
}

function checkMinDate(comp, val, min, format, sep, ns, inline, clientMin, message, styles){
 var retVal = true;
 if (min == "") return true;
 var Dt = new nDate(val,  format, sep, ns);
 var Dlb = new nDate(min,  format, sep, ns);
 if (Dt.yy < Dlb.yy) retVal=false;
 if(Dt.yy == Dlb.yy){
  if ( (Dt.mm < Dlb.mm) ||  ((Dt.mm == Dlb.mm) && (Dt.dd < Dlb.dd)))  retVal=false;
 }
 if (!retVal){
  return alertComp(comp, ( message[1] && message[1].length > 0 ) ? message[1] : getMsg(ns, "InvalidMinDateMessage", "QUESTION_CONSTRAINT=" + ((clientMin == null ) ? min : clientMin)), ns, inline, styles);
 }
 return true;
}

function checkMaxDateWeek(comp, val, max,  format, sep, ns, inline, clientMax, message, styles){
 var retVal = true;
 if (max == "") return retVal;
 
 var Dt = new nDateWeek(val,  format, sep, ns);
 var Dub = new nDateWeek(max,  format, sep, ns);
 if (Dt.yy > Dub.yy) retVal=false;
 if (Dt.yy == Dub.yy){
  if ( Dt.ww > Dub.ww ) retVal=false;
 }
 if (!retVal){
  return alertComp(comp, ( message[2] && message[2].length > 0 ) ? message[2] : getMsg(ns, "InvalidMaxDateMessage", "QUESTION_CONSTRAINT=" + ((clientMax == null) ? max : clientMax)), ns, inline, styles);
 }
 return true;
}

function checkMinDateWeek(comp, val, min, format, sep, ns, inline, clientMin, message, styles){
 var retVal = true;
 if (min == "") return true;
 var Dt = new nDateWeek(val,  format, sep, ns);
 var Dlb = new nDateWeek(min,  format, sep, ns);
 if (Dt.yy < Dlb.yy) retVal=false;
 if (Dt.yy == Dlb.yy){
  if ( Dt.ww < Dlb.ww ) retVal=false;
 }
 if (!retVal){
  return alertComp(comp, ( message[1] && message[1].length > 0 ) ? message[1] : getMsg(ns, "InvalidMinDateMessage", "QUESTION_CONSTRAINT=" + ((clientMin == null ) ? min : clientMin)), ns, inline, styles);
 }
 return true;
}

function isIntegerInRange(s, a, b){
 if (!isInteger(s)) return false;
 return intbounds(mpi(s), a, b);
}

function intbounds(x,l,u){
 return ((x>=l) && (x<=u));
}

function isYear(s){
 return ((isInteger(s)) && (s.length == 4));
}

function isWeek(s){
 return (isIntegerInRange (s, 1, 53));
}

function isMonth(s){
 return (isIntegerInRange (s, 1, 12));
}

function isDay(s){
 return (isIntegerInRange (s, 1, 31));
}

function isHour(s){
 return (isIntegerInRange (s, 0, 23));
}

function isMinute(s){
 return (isIntegerInRange (s, 0, 59));
}

function isSecond(s){
 return (isIntegerInRange (s, 0, 59));
}

function daysInFebruary (year){
 if (isNaN(year)) return 29;
 return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0) ) ) ? 29 : 28 );
}

function stripTrailingChars(s,chars){
 var x = s.length - 1;
 while(x>=0){
  if(chars.indexOf(s.charAt(x)) !=-1)
   s = s.substring(0,x--);
  else x=-1;
 }
 return s;
}

function alertMandMessage(mandComp, ns, inlineErrors){
  var mandMessage =	getMandMessage(ns, mandComp);
  if (mandMessage == "Mandatory") {
	mandMessage = getMsg(ns, "MandMessage", "QUESTION_CONSTRAINT=" + getVariable(ns, "MANDCHAR"));
  }
  else {
    mandMessage = substituteVariable(mandMessage, "QUESTION_CONSTRAINT=" + getVariable(ns, "MANDCHAR"));
  }
  ok = alertComp(mandComp, mandMessage, ns, inlineErrors);
}

//normal table layout behaviour - overridden in div version.....
function getTListContainerDiv(outerDiv) {
	return getParentNode(outerDiv.parentNode, "DIV");
}

function showErrorMessage(ns, comp, p_msg, styles) {
	var errorMessageId = getErrorMessageId(ns, comp);
	var errorNode = document.getElementById(errorMessageId);
	if (errorNode){
		jscss('remove', errorNode, 'qlrError');
		
		//search if there is a visible warning or info message after the error
		var warningMessageId = getWarningMessageId(ns, comp);
		var infoMessageId = getInfoMessageId(ns, comp);
		var lastMessageElement = errorNode;
		if (lastMessageElement.nextSibling != null)
		{
			while (lastMessageElement.nextSibling.id == warningMessageId || lastMessageElement.nextSibling.id == infoMessageId) {
				lastMessageElement = lastMessageElement.nextSibling;
				if (lastMessageElement.style.display != "none" || lastMessageElement.nextSibling == null) {
					break;
				}
			}
		}
		
		var newMessage = p_msg;
		if(lastMessageElement == errorNode || lastMessageElement.style.display == "none") {
			//if there is no visible message after the error, add a line break (end of messages for current question); otherwise the last message already contains the line break (from server side)
			newMessage += "<br/>";
		} else if (getVariable(ns, "ShowOneMessage") != "Y") {
			// if the error is not the last visible message just add the separator - not the case when only one message (the error) is shown
			newMessage += getVariable(ns, "MessagesSeparator");
		}
		errorNode.innerHTML = newMessage;
		
		showElem(errorNode, true);
	}
	var errorRowId = getErrorMessageRowId(ns, comp);
	var errorRow = document.getElementById(errorRowId);
	if (errorNode){
		showElem(errorRow, true);
	}
}

function getMandMessageId(ns, comp){
	var lookupParts = getLookupId(ns, comp);
	var id = lookupParts[0] + "MM_" + lookupParts[1] + lookupParts[2];
	var node = document.getElementById(id);
	if (node == null)	{
		lookupParts = getLookupId(ns, comp, true)
	}
	return lookupParts[0] + "MM_" + lookupParts[1] + lookupParts[2] ;
}

function getMandMessage(ns, comp){
	var mandMessage = "";
	var lookupId = getMandMessageId(ns, comp);
	var mm = document.getElementById(lookupId);
    if (mm != null && mm.innerHTML != null) {
		mandMessage = mm.innerHTML;
	}
	return mandMessage;
}

function mandCheckRow(p_rowId, ns, p_butAction, inlineErrors, validateAllFields)
{
 if (ns  == null) ns = "";
 var ok = true; var mandComp=null; 
 var row = document.getElementById(ns + p_rowId); 
 var mandMessage = getMsg(ns, "MandMessage", "QUESTION_CONSTRAINT=" + getVariable(ns, "MANDCHAR")); 
 if (!this["beforeMandCheckRow"] || this["beforeMandCheckRow"](row, mandMessage, ns) ){
   var els = getFormElems(ns, ns+p_rowId);
   mandComp = checkMandFields(els, ns, p_butAction, inlineErrors, validateAllFields);
 }
 if (mandComp != null){
  ok = alertMandMessage(mandComp, ns, inlineErrors);
  setFocus(mandComp);
 }
 if (this["afterMandCheckRow"]) 
 {
   ok = this["afterMandCheckRow"](row, mandMessage, ns, ok);
 }
 return ok;
}

function mandCheckElems(formEls, ns, p_butAction, inlineErrors, validateAllFields){
 if (ns  == null) ns = "";
 var ok = true;
 var mandComp = null;
 var mandMessage = getMsg(ns, "MandMessage", "QUESTION_CONSTRAINT=" + getVariable(ns, "MANDCHAR"));
 if (!this["beforeMandCheckElems"] || this["beforeMandCheckElems"](formEls, ns, p_butAction, mandMessage) ){
   mandComp = checkMandFields(formEls, ns, p_butAction, inlineErrors, validateAllFields);
 }
 if (mandComp != null){
  ok = alertMandMessage(mandComp, ns, inlineErrors);
  try {
	  setFocus(mandComp);
  }
  catch (e){;}
 }
 if (this["afterMandCheckElems"]){
  ok = this["afterMandCheckElems"](formEls, ns, p_butAction, mandMessage, ok, mandComp);
 }
 return(ok);
}

function isFieldInMandError(ns, p_compId){
  var mandErrorsList = getVariable(ns, "MAND_ERRORS");
  if ( mandErrorsList ) {
    for ( var i = 0; i < mandErrorsList.length; i++ ){
      if ( mandErrorsList[i] == p_compId ){
        return true;
      }
    }	
  }
  return false;
}

function arraycontains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function checkMandFields(formEls, ns, p_butAction, inlineErrors, validateAllFields)
{
   setVariable(ns, "MAND_ERRORS", null);
   var tmpMandErrorList = new Array();
   var mandErrorsList = new Array();

   var mandComp = null;
   var compID = ( p_butAction ) ? getCompID(ns, p_butAction) : null; 
   for (var i = 0; i < formEls.length ; i++){
    var tmp = formEls[i];
    if(!tmp.disabled && tmp.type != "hidden" && tmp.id.indexOf(UNSELECT_LIST_PREFIX) == -1){
     if (!validateAllFields && tmp.name != null && tmp.name == p_butAction) break;
     if ( compID != null && tmp.id != null && tmp.id.indexOf(compID) != 0 ) continue;
     var val = "" + getElementValue(tmp, ns);
     var s = (IE4 || tmp.type == "textarea" || tmp.type == "text" || tmp.type == "select-one" || tmp.type == "select-multiple")? tmp.style :tmp.parentNode.style;
     var mandMessage = getMandMessage(ns, tmp);
	 if (mandMessage.length > 0) {
      if (trim(val) == ""){
       showMessage = true;

       var lookupIdArr  = getLookupId(ns, tmp);
       var lid = lookupIdArr[0] + lookupIdArr[1] + lookupIdArr[2];
       if ( !arraycontains(tmpMandErrorList, lid) ) {
    	   mandErrorsList.push(tmp.id);
           tmpMandErrorList.push(lid);
       }
       var styleArray =  extractStyleArray(tmp);
       if (styleArray != null)
           updateStyles(ns, tmp, styleArray, "add");
       
       //try and get the style array..
	   var oc;
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
			var styleArray = styles.replace(/'/g,'').replace(/"/g,'').split(',');     
			updateStyles(ns, tmp, styleArray, "add");
		   }
		   catch (e){}
	   }
       if (mandComp == null){
        mandComp = tmp;
       }
	   if(inlineErrors) 
		alertMandMessage(tmp, ns, inlineErrors);
      }
      else {
       if (tmp.id.indexOf(SELECT_LIST_PREFIX) > -1){
        var id = tmp.id.substring(tmp.id.indexOf(SELECT_LIST_PREFIX) + SELECT_LIST_PREFIX.length);
        var comp = document.getElementById(ns + UNSELECT_LIST_PREFIX + id);
        if (comp != null) s = comp.style;
       }
       setMandStyle(tmp, s, false);
      }
     }
    }
   }

   if ( mandComp == null ) mandErrorsList = null;
   setVariable(ns, "MAND_ERRORS", mandErrorsList);

   return mandComp;
}

function formatCheckElems(formEls, ns, inlineErrors){
	if (ns  == null) ns = "";
	// blank variable to ensure ajaxValidate is called
	var oldFocusVal = getVariable(ns, "focusValue");
	setVariable(ns, "focusValue", "");
	var ok = true;
	var dateTimeElemsOk = true;
	var tmp; 
	var dateTimeElems=new Array(); // keyed by name, component e.g. BIRTHDAY1.DATE(), obj
	for (var i = 0; i < formEls.length ; i++){
		tmp = formEls[i];
		if (tmp.type != null) {
			if(!tmp.disabled && tmp.type != "hidden" && tmp.id.indexOf(UNSELECT_LIST_PREFIX) == -1){
				accumulateDateTimeElems(tmp, dateTimeElems, ns);
				//check if there is an onchange method (don't bother on lists - unless it's a date part ).... also allow those with qlr or sublist..
				var retval = true;
				if (tmp.onchange != null && (("" + tmp.onchange).indexOf("ajax") < 0 || ("" + tmp.onchange).indexOf("ajaxQuestionAction") > 0 || ("" + tmp.onchange).indexOf("ajaxSubList") > 0 || (tmp.onblur != null && ("" + tmp.onblur).indexOf("ec_suggest") > 0) ) && (tmp.type.indexOf("select") != 0 || isDatePartElem(tmp))){
					retval = execute(tmp, "onchange", FORMAT_VALIDATION_TRIGGER);
				}
				else if (tmp.onblur != null && (("" + tmp.onblur).indexOf("ajax") < 0 || ("" + tmp.onblur).indexOf("ajaxQuestionAction") > 0 || ("" + tmp.onblur).indexOf("ajaxSubList") > 0 ) && (tmp.type.indexOf("select") != 0 || isDatePartElem(tmp)))
					retval = execute(tmp, "onblur", FORMAT_VALIDATION_TRIGGER);
				if (retval != null && retval == false){ 
					ok = false;
					setFocus(tmp);
					break;
				}
			}
		}
	}
	dateTimeElemsOk = validateDateTimeElems(dateTimeElems, ns, inlineErrors);
	if (this["afterFormatCheckElems"]){
		this["afterFormatCheckElems"](tmp, ns, ok, dateTimeElemsOk);
	}
	// restore variable
	setVariable(ns, "focusValue", oldFocusVal);
	setVariable(ns, "FORMAT_ERRORS", (ok && dateTimeElemsOk) ? null : tmp);
	return (ok && dateTimeElemsOk) ; 
}

function alertComp(p_comp, p_msg, ns, inline, styles)
{
  if (!inline) inline = false;
  var ok = false;
  if ( ns == null ) ns = "";
  if (!this["beforeMessageAlert"] || beforeMessageAlert(p_comp, p_msg, ns) )  {
   updateStyles(ns, p_comp, styles, "add");
   if(inline) {
		showErrorMessage(ns, p_comp, p_msg, styles);
   }
   else {
        alert(p_msg);
   }
  }
  if ( p_comp != null )
  {  
	 //only change tab if mand & format checking complete
	 var mandErrors = getVariable(ns, "MAND_ERRORS");
	 var formatErrors = getVariable(ns, "FORMAT_ERRORS");
	 if (mandErrors || formatErrors) {
		showTab(p_comp, ns);
	 }
	 if (!inline)
		 setFocus(p_comp);
  }
  if (this["afterMessageAlert"]) ok = afterMessageAlert(p_comp, p_msg, ns, ok);
  return(ok);
}

function isDatePartElem(p_elem)
{
    if  ( p_elem != null)
    {
        return(isDatePartFunctionName(p_elem.name));
    }
	
	return(false);
}

function accumulateDateTimeElems(p_elem, p_dateTimeElems, ns)
{
	if	( isDatePartElem(p_elem) )
	{
        p_dateTimeElems[p_elem.name] = p_elem;
    }
}

function validateDateTimeElems(p_dateTimeElems, ns, inline)
{
    var checked = new Array();
    for (var elemKey in p_dateTimeElems)
    {
        if (typeof(p_dateTimeElems[elemKey]) == "object")
        {
            var elem = p_dateTimeElems[elemKey];
            var name = elemKey.substring(0,elemKey.lastIndexOf("."));
            
            if (checked[name]) continue;
            var val = "" + getElementValue(elem, ns);
            if (trim(val) == "") continue;
            
            checked[name] = true;
            for (var i=0; i < DATE_TIME_PARTS.length; i++)
            {
                var otherElemKey = name + "." + DATE_TIME_PARTS[i];
                if  (otherElemKey != elemKey)
                {
                    var otherElem =  p_dateTimeElems[otherElemKey];
                    if  (otherElem)
                    {
                        val = "" + getElementValue(otherElem, ns);    
                        if  (trim(val) == "") 
                        {
                            return alertComp(otherElem, getMsg(ns, "ValidationMessage"), ns, inline);
                        }
                    }
                }
            }
		}
    }
    return(true);
}

function trimValue(elem, ns)
{
	elem.value = trim(getElementValue(elem, ns));
}

