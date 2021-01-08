/*
 * $RCSfile$
 * $Author$
 * $Revision$
 * $Date$
 *
 */

// Title: Tigra Calendar
// URL: http://www.softcomplex.com/products/tigra_calendar/
// Version: 3.2 (European date format)
// Date: 10/14/2002 (mm/dd/yyyy)
// Feedback: feedback@softcomplex.com (specify product title in the subject)
// Note: Permission given to use this script in ANY kind of applications if
//    header lines are left unchanged.
// Note: Script consists of two files: calendar?.js and calendar.html
// About us: Our company provides offshore IT consulting services.
//    Contact us at sales@softcomplex.com if you have any programming task you
//    want to be handled by professionals. Our typical hourly rate is $20.

/* static variables for the page */
// if two digit year input dates after this year considered 20 century.
var NUM_CENTYEAR = 30;
// is time input control required by default
var BUL_TIMECOMPONENT = false;
// are year scrolling buttons required by default
var BUL_YEARSCROLL = true;
var RE_NUM = /^\-?\d+$/;

var DEBUG=false;

/* dynamic */
var calendars = [];
var currentX = 390; var currentY = 650;

function calendar1(obj_target_name, ns, format, separator, timeSep, dateTimeSep) {
    if (ns  == null) ns = "";

    // assing methods
    this.gen_date = cal_gen_date1;
    this.gen_time = cal_gen_time1;
    this.gen_tsmp = cal_gen_tsmp1;
    this.prs_date = cal_prs_date1;
    this.prs_time = cal_prs_time1;
    this.prs_tsmp = cal_prs_tsmp1;
    this.popup    = cal_popup1;
    this.get_target = cal_get_target;
    this.getImageDirPath = getImageDirPath;

	this.format = format || "dd/mm/yyyy";
	this.separator = separator || "/";
	this.timeSeparator = timeSep || ":";
	this.dateTimeSeparator = dateTimeSep || " ";

    this.target_name = obj_target_name;
    this.time_comp = BUL_TIMECOMPONENT;
    this.year_scroll = BUL_YEARSCROLL;

    // register in global collections
	calendars = getVariable(ns, 'calendars');
    this.id = calendars.length;
    calendars[this.id] = this;
}

function cal_get_target (ns) {
 if (ns  == null) ns = "";
 return document.forms[ns+'form1'].elements[this.target_name];
}


function calculate_cal_position (ns, related_target ){
    var target = document.getElementById(related_target),
        posY = target.getBoundingClientRect().y || target.getBoundingClientRect().top,
        posX = target.getBoundingClientRect().x || target.getBoundingClientRect().left,

        winHeight = window.innerHeight,
        winWidth = window.innerWidth,
        winScrollTop = window.scrollY || window.pageYOffset,

        //hardcoded and aproximated because position is set before size is calculated
        popupHeight = 200,
        popupWidth = 197
    ;

    /* CASES */
    //VERTICAL
    //Popup offsets bottom of window - show it on the top
    if ((posY + popupHeight + target.offsetHeight ) >= winHeight){
        setVariable(ns, 'currentY', posY - popupHeight + winScrollTop);
    //Popup has enough space
    } else {
        setVariable(ns, 'currentY', posY + target.offsetHeight + winScrollTop);
    }

    //HORIZONTAL
    //Popup offsets right side of window - move it to the left
    if( (posX + popupWidth) >= winWidth){
        setVariable(ns, 'currentX', posX - (posX + popupWidth - winWidth) - 20); //20 aproximates window vertical scrollbar width
    //Popup has enough space
    } else {
        setVariable(ns, 'currentX', posX);
    }
}

function cal_popup1 (ns, event, str_datetime) {

    /* Close Calendar Popup at ESC key hit */
    if( event != null && event.keyCode == 27 ){
        document.getElementById('FloatCalendarDiv').style.display = 'none';
        return false;
    }

    window.CALENDAR_PICKER_TRIGGER = this.target_name;

    if (ns  == null) ns = "";
    var targetObj = document.forms[ns+'form1'].elements[this.target_name];
    if (!targetObj)
      return cal_error("Error calling the calendar: no target control specified");
    if (targetObj.value == null)
      return cal_error("Error calling the calendar: parameter specified is not valid target control");
    this.dt_current = this.prs_tsmp(str_datetime ? str_datetime : targetObj.value);
    if (!this.dt_current) return;
    if (!buttonsEnabled(ns)) return;
    if (event != null){
        calculate_cal_position( ns, this.target_name );
        /*
        var pos = calcPopupPosition(197, 203, event);
        setVariable(ns, 'currentY', pos.y);
	    setVariable(ns, 'currentX', pos.x);
        */
    }

	//Unescape() required for IE7.
	var calendarPagePath = unescape(getResourcePath(ns, getVariable(ns, 'calendarPagePath')));
	var floatDiv = document.getElementById(ns + "FloatCalendarDiv");
	if (floatDiv)
	{
	    floatDiv.removeChild(floatDiv.childNodes[0]);
	}
	else
	{
	    floatDiv = createFloatingDiv(ns+"FloatCalendarDiv", document.body);
    }


    //Handle calendar close
    var closeCalendarPopup = function(){
        document.getElementById('FloatCalendarDiv').style.display = 'none';
        window.removeEventListener('mousedown', handleCalendarClose);
    }

    var handleCalendarClose = function ( e ){
        var node = e.target;
        do {
            node = node.parentNode
        } while (node.id !== 'FloatCalendarDiv' && node.parentNode !== null)

        if( node.id == 'FloatCalendarDiv' && e.target.id !== 'closeCalendarPopup'){
            return false;
        } else {
            closeCalendarPopup();
        }
    }
    window.addEventListener('mousedown', handleCalendarClose);


	floatDiv.style.position = "absolute";
	floatDiv.style.width = "197px";
	floatDiv.style.height = (this.time_comp ? 228 : 203) + "px";
	floatDiv.style.top = getVariable(ns, 'currentY') + "px";
	floatDiv.style.left = getVariable(ns, 'currentX') + "px";
	floatDiv.style.border = "0px";
	floatDiv.style.display = 'block';
	floatDiv.style.zIndex = '1050';

	var popupContent = getVariable(ns, 'calendarPopup');
	//nasty - but to be totally compliant, the html in the script block had to have </xxx replaced with <\/xxx
	//this just removes the \
	popupContent = popupContent.replace(/<\\\//g, "</");
	floatDiv.innerHTML = popupContent;
	//var toolBarContent = '	<div id="toolbar" onmouseover="this.style.cursor = \'pointer\'" style="height: 8%; width:100%;"><div style="float: left; background-color: #CCCCDD; width: 90%" onmousedown="try {dragStart(event, \'FloatCalendarDiv\');} catch (e){}">&nbsp;</div><div style="float: left; color: #CCCCDD; font-family: Arial; text-align: center; width: 10%" onclick="parentNode.parentNode.style.display = \'none\';" >X</div><div style="clear: both"></div></div><div style="color: #4444BB; font-family: Arial; height:92%; width:100%;"><iframe id="calendarIframe" src="#" style="height:100%; width:100%; color: #FFFFFF;" scrolling="no" frameBorder="0"><p>Your browser does not support iframes.</p></iframe></div>';
	//floatDiv.innerHTML = toolBarContent;
	var iframeElem = document.getElementById("calendarIframe");
	iframeElem.src = calendarPagePath + '?datetime=' + this.dt_current.valueOf()+ '&id=' + this.id + '&namespace=' + ns + "&format=" + escape(this.format) + "&separator=" + escape(this.separator);

	//var toolBarDiv = document.createElement("div");
	//var toolBarContent = "<div style='float: left; width: 90%; background-color: #FFFFCC' ><b>Calendar</b></div><div style='float: left; color: #CCCCDD; font-family: Arial; text-align: center; width: 10%' onclick='parentNode.parentNode.style.display = \"none\";' >X</div><div style='clear: both'></div>";
    //toolBarDiv.innerHTML = toolBarContent;
    //floatDiv.appendChild(toolBarDiv);


	//var iframe = document.createElement("iframe");
	//var src = calendarPagePath + '?datetime=' + this.dt_current.valueOf()+ '&id=' + this.id + '&namespace=' + ns + "&format=" + escape(this.format) + "&separator=" + escape(this.separator);
	//iframe.setAttribute("src", src);
	//iframe.style.height = "100%";
	//iframe.style.width = "100%";
	//iframe.srolling = "no";
	//iframe.frameBorder ="0";
    //floatDiv.appendChild(iframe);

    if  ( window.CALENDAR_FOCUS_TRIGGER && targetObj.onfocus )
    {
        window.execute(targetObj, "onfocus", window.CALENDAR_FOCUS_TRIGGER );
    }
}

// timestamp generating function
function cal_gen_tsmp1 (dt_datetime) {
    return(this.gen_date(dt_datetime) + ' ' + this.gen_time(dt_datetime));
}

// date generating function
function cal_gen_date1 (dt_datetime) {
	var arr_format = this.format.split(this.separator);
	var result = "";
	if (arr_format[0] == "dd")		 result = (dt_datetime.getDate() < 10 ? '0' : '') + dt_datetime.getDate();
	else if (arr_format[0] == "mm")  result = (dt_datetime.getMonth() < 9 ? '0' : '') + (dt_datetime.getMonth() + 1);
	else if (arr_format[0] == "yyyy")result = dt_datetime.getFullYear();
	result += this.separator;
	if (arr_format[1] == "dd")		 result += (dt_datetime.getDate() < 10 ? '0' : '') + dt_datetime.getDate();
	else if (arr_format[1] == "mm")  result += (dt_datetime.getMonth() < 9 ? '0' : '') + (dt_datetime.getMonth() + 1);
	else if (arr_format[1] == "yyyy")result += dt_datetime.getFullYear();
	result += this.separator;
	if (arr_format[2] == "dd")		 result += (dt_datetime.getDate() < 10 ? '0' : '') + dt_datetime.getDate();
	else if (arr_format[2] == "mm")  result += (dt_datetime.getMonth() < 9 ? '0' : '') + (dt_datetime.getMonth() + 1);
	else if (arr_format[2] == "yyyy")result += dt_datetime.getFullYear();
	return result;
}


// time generating function
function cal_gen_time1 (dt_datetime) {
    return (
        (dt_datetime.getHours() < 10 ? '0' : '') + dt_datetime.getHours() + this.timeSeparator
        + (dt_datetime.getMinutes() < 10 ? '0' : '') + (dt_datetime.getMinutes()) + this.timeSeparator
        + (dt_datetime.getSeconds() < 10 ? '0' : '') + (dt_datetime.getSeconds())
    );
}

// timestamp parsing function
function cal_prs_tsmp1 (str_datetime) {
    // if no parameter specified return current timestamp
    if (!str_datetime)
        return (new Date());

    // if positive integer treat as milliseconds from epoch
    if (RE_NUM.exec(str_datetime))
        return new Date(str_datetime);

    // else treat as date in string format
    var arr_datetime = str_datetime.split(this.dateTimeSeparator);
	if (arr_datetime.length == 2){
      return this.prs_time(arr_datetime[1], this.prs_date(arr_datetime[0]));
	}
	else{
	  return this.prs_date(str_datetime);
	}
}

// date parsing function
function cal_prs_date1 (str_date) {
    var arr_date = str_date.split(this.separator);

    if (arr_date.length != 3) return cal_error ("Invalid date format: '" + str_date + "'.\nFormat accepted is " +  this.format + ".");
    if (!arr_date[0]) return cal_error ("Invalid date format: '" + str_date + "'.\nNo day of month value can be found.");
    if (!RE_NUM.exec(arr_date[0])) return cal_error ("Invalid day of month value: '" + arr_date[0] + "'.\nAllowed values are unsigned integers.");
    if (!arr_date[1]) return cal_error ("Invalid date format: '" + str_date + "'.\nNo month value can be found.");
    if (!RE_NUM.exec(arr_date[1])) return cal_error ("Invalid month value: '" + arr_date[1] + "'.\nAllowed values are unsigned integers.");
    if (!arr_date[2]) return cal_error ("Invalid date format: '" + str_date + "'.\nNo year value can be found.");
    if (!RE_NUM.exec(arr_date[2])) return cal_error ("Invalid year value: '" + arr_date[2] + "'.\nAllowed values are unsigned integers.");

    var dt_date = new Date();
    dt_date.setDate(1);

	var day = getDay(this.format, str_date, this.separator);
	var month = getMonth(this.format, str_date, this.separator);
	var year = getYear(this.format, str_date, this.separator);

    if (month < 1 || month > 12) return cal_error ("Invalid month value: '" + month + "'.\nAllowed range is 01-12.");
    dt_date.setMonth(month-1);

    if (year < 100) year = Number(year) + (year < NUM_CENTYEAR ? 2000 : 1900);
    dt_date.setFullYear(year);

    var dt_numdays = new Date(year, month, 0);
    dt_date.setDate(day);
    if (dt_date.getMonth() != (month-1)) return cal_error ("Invalid day of month value: '" + day + "'.\nAllowed range is 01-"+dt_numdays.getDate()+".");

    return (dt_date);
}

function getDay(format, str_date, separator){
	return getPart(format, str_date, 'dd', '1', separator);
}

function getMonth(format, str_date, separator){
	return getPart(format, str_date, 'mm', '1', separator);
}

function getYear(format, str_date, separator){
	return getPart(format, str_date, 'yyyy', '2005', separator);
}

function getPart(format, str_date, part, defaultValue, separator)
{
    var arr_date = str_date.split(separator);
	var arr_format = format.split(separator);

	if (arr_format[0] == part)
		return arr_date[0];
	else if (arr_format[1] == part)
		return arr_date[1];
	else if (arr_format[2] == part)
		return arr_date[2];
	else
		return defaultValue;
}


// time parsing function
function cal_prs_time1 (str_time, dt_date) {

    if (!dt_date) return null;
    var arr_time = String(str_time ? str_time : '').split(this.timeSeparator);

    if (!arr_time[0])
    {
    	// special treatment for DST occuring at 00:00 when using Firefox
    	var date_copy = new Date(dt_date);
        dt_date.setHours(0);
        if (dt_date.getHours() != 0)
        {
        	dt_date = date_copy;
        	dt_date.setHours(1);
        }
    }
    else if (RE_NUM.exec(arr_time[0]))
        if (arr_time[0] < 24) dt_date.setHours(arr_time[0]);
        else return cal_error ("Invalid hours value: '" + arr_time[0] + "'.\nAllowed range is 00-23.");
    else return cal_error ("Invalid hours value: '" + arr_time[0] + "'.\nAllowed values are unsigned integers.");

    if (!arr_time[1]) dt_date.setMinutes(0);
    else if (RE_NUM.exec(arr_time[1]))
        if (arr_time[1] < 60) dt_date.setMinutes(arr_time[1]);
        else return cal_error ("Invalid minutes value: '" + arr_time[1] + "'.\nAllowed range is 00-59.");
    else return cal_error ("Invalid minutes value: '" + arr_time[1] + "'.\nAllowed values are unsigned integers.");

    if (!arr_time[2]) dt_date.setSeconds(0);
    else if (RE_NUM.exec(arr_time[2]))
        if (arr_time[2] < 60) dt_date.setSeconds(arr_time[2]);
        else return cal_error ("Invalid seconds value: '" + arr_time[2] + "'.\nAllowed range is 00-59.");
    else return cal_error ("Invalid seconds value: '" + arr_time[2] + "'.\nAllowed values are unsigned integers.");

    dt_date.setMilliseconds(0);
    return dt_date;
}

function cal_error (str_message) {
    if (DEBUG) {
        console.log(str_message);
    }
    return new Date(); // return a date so the picker will popup ..
}

/** Utility method to keep track of instantiated calendars */
function cal_new_calendar1(calendarComponents, obj_target_name, ns, format, separator, timeSep, dateTimeSep) {
    calendarComponents[obj_target_name] = new calendar1(obj_target_name, ns, format, separator, timeSep, dateTimeSep);
}

//GLOBAL VAR used to store keyboard navigation focus coords for calendar popup
var CALENDAR_FOCUS_COORDS = {
    cellIndex: 0,
    rowIndex: 0
};