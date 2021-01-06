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

var ACTIVE_HELP_TRIGGER = null // DomObj - trigger button that activated the last help dialog, so we can focus back to it

function showHelp(qName, ns, controllerName, contextPath, evt) {
    if (!this["beforeHelpRequest"] || beforeHelpRequest(qName, ns, controllerName, contextPath)) {
        var url = contextPath + "helpservletcontroller?QUESTION=" + qName + "&namespace=" + ns + "&controllername=" + controllerName;
        var top = calcWinPopupTop(300, window.event ? window.event : evt);
        var left = calcWinPopupLeft(600, window.event ? window.event : evt);
        window.open(url, "helpwin" ,"toolbar=no,directories=no,status=yes,scrollbars=yes,resizeable=yes,resize=yes,menubar=no,height=300,width=600,top=" + top + ",left=" + left);
    }
    if (this["afterHelpRequest"]) {
        afterHelpRequest(qName, ns, controllerName, contextPath);
    }
}

function calcWinPopupTop(p_windowHeight, evt) {
    var top = 0;
    p_windowHeight = parseFloat(p_windowHeight);
    
    if ((evt.screenY + p_windowHeight) > screen.height) {
        top = screen.height - (p_windowHeight + 30);
    } else  {
        top = evt.screenY;
    }
    
    return top;
}

function calcWinPopupLeft(p_windowWidth, evt) {
    var left = 0;
    p_windowWidth = parseFloat(p_windowWidth);
    
    if ((evt.screenX + p_windowWidth) > screen.width) {
        left = screen.width - (p_windowWidth + 30)
    } else {
        left = evt.screenX;
    }
    return left;
}

function calcPopupPosition (p_w,p_h, evt, dElement) {
    // try not to place the popup over the input
    var leftOffset = (document.body.parentNode.scrollLeft != null && navigator.userAgent.indexOf("AppleWebKit") == -1)? document.body.parentNode.scrollLeft : window.scrollX,
        browserWidth = calcBrowserWidth(),
        topOffset = (document.body.parentNode.scrollTop != null && navigator.userAgent.indexOf("AppleWebKit") == -1)? document.body.parentNode.scrollTop : window.scrollY,
    
        //skip the evt, because we have click and focus
        //use x an y from dElement
        eventClientY = dElement.getBoundingClientRect().y || dElement.getBoundingClientRect().top,
        eventClientX = dElement.getBoundingClientRect().x || dElement.getBoundingClientRect().left,
    
        left = eventClientX + leftOffset,
        top = eventClientY + topOffset;

    p_w = parseFloat(p_w);
    p_h = parseFloat(p_h);

    if ( eventClientX + p_w > leftOffset + browserWidth) { //no space right side, place it left of the trigger
        left = left - p_w - 20;
    } else { //place it right side
        left += 20;
    }

    if ( eventClientY - p_h < 0 ) { //no space top, place it bellow the trigger
        top = top + 20;
    } else { //place it top
        top = top - p_h;
    }

    return {x: left, y: top};
}

function calcBrowserWidth() {
    return getPageSize()[0];
}

function calcBrowserHeight() {
    return getPageSize()[1];
}

function getPageSize() {
    var xScroll, 
        yScroll,
        pageHeight,
        pageWidth;

    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
    } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }
    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }
    // for small pages with total height less then height of the viewport
    if (yScroll > windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }
    // for small pages with total width less then width of the viewport
    if (xScroll > windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }

    return [pageWidth,pageHeight];
}

var helpTimeout;
function showAjaxHelp(elId, qName, ns, controllerName, contextPath, evt, targetId) {
    //evt or targetId could be null/undefined/empty but not both
    if (!this["beforeHelpRequest"] || beforeHelpRequest(elId, qName, ns, controllerName, contextPath))
    {
        var isValidTargetId = targetId != null && targetId.length > 0;
        if (isValidTargetId)
        {
            setVariable(ns, 'currentHelpTarget', targetId);
            removeHelpContent();
        }
        else
        {
            if (window.event) evt = window.event;
            if(evt)
            {
                var xy = new Object();
                if (window.event)
                {
                    xy.clientX = window.event.clientX;
                    xy.clientY = window.event.clientY;
                }
                else
                {
                    xy.clientX = evt.clientX;
                    xy.clientY = evt.clientY;
                }
                setVariable(ns, 'clickEvt', xy);
            }
        }

        //helpTimeout = setTimeout( function () { ajaxHelp(elId, qName, ns, controllerName, contextPath); }, 500);
        ajaxHelp(elId, qName, ns, controllerName, contextPath);
    }
    if (this["afterHelpRequest"])
    {
        afterHelpRequest(elId, qName, ns, controllerName, contextPath);
    }
}

function hideHelpContent() {
    if (helpTimeout) {
        clearTimeout(helpTimeout);
        helpTimeout = null;
    }

    var currentHelpContent      = document.getElementById('helpContent'),
        helpContentIsHovered    = false; //changes when user go over help bubble

    if (currentHelpContent !== null) {
        
        currentHelpContent.addEventListener('mouseenter', function(e){
            helpContentIsHovered = true;
        }, false);
        
        currentHelpContent.addEventListener('mouseleave', function(e){
            currentHelpContent.style.display = 'none';
        }, false);

        setTimeout(function(){ //give the user enough time to get over the help bubble
            if(!helpContentIsHovered){
                currentHelpContent.style.display = 'none';
            }
        }, 600);
    }
}

function removeHelpContent() {
    var currentHelpContent = document.getElementById('helpContent');
    if (currentHelpContent != null) {
        currentHelpContent.parentNode.removeChild(currentHelpContent);
    }
}

function helpDivHandleKeyDown (event, helpDiv) {
    event.preventDefault();
    switch (event.keyCode) {
        case 27: // ESC
        case 13: // Return/Enter
            helpDiv.style.display = 'none';
            ACTIVE_HELP_TRIGGER.focus();
            break;
        case 9: //TAB
            //toggle focus between content and close
            if (document.activeElement.className.indexOf('helpContentText') > -1) {
                helpDiv.querySelectorAll('.HelpCloseIcon')[0].focus();
            } else {
                helpDiv.querySelectorAll('.helpContentText')[0].focus();
            }
            break;
        default:
            break;
    }
}

function createHelpDiv (dElement, text, ns) {
    var currentHelpTarget = getVariable(ns, 'currentHelpTarget'),
        clickEvt = getVariable(ns, 'clickEvt'),
        helpDiv;

    if (currentHelpTarget != null) {
        var helpContainer = document.getElementById(currentHelpTarget);

        helpContainer.innerHTML = text + helpContainer.innerHTML;
        helpContainer.style.display = "";

        helpDiv = document.getElementById("helpContent");

        helpDiv.style.width = helpContainer.clientWidth + "px";
        helpDiv.style.height = helpContainer.clientHeight + "px";
        return;
    }
    
    helpDiv = document.getElementById("helpDiv");

    if (helpDiv == null) {
        helpDiv = createFloatingDiv("helpDiv", document.body);
        helpDiv.addEventListener('keydown', function(event){ helpDivHandleKeyDown(event, this) }, false);
    }

    helpDiv.innerHTML = text;
    helpDiv.style.position = "absolute";

    var w = helpDiv.firstChild.offsetWidth;
    var h = helpDiv.firstChild.offsetHeight;

    var pos = calcPopupPosition(w,h,clickEvt, dElement);

    helpDiv.style.left     = "" + pos.x + "px";
    helpDiv.style.top      = "" + pos.y + "px";
    helpDiv.style.display  = "";

    //dElement.blur();
    var theDivOfHelp = helpDiv.querySelectorAll('.helpContentText');
    if (theDivOfHelp && theDivOfHelp.length > 0) {
        theDivOfHelp[0].focus();
    }
    ACTIVE_HELP_TRIGGER = dElement;
}

function clickHelpButton(help_id) {
    if (help_id && help_id.length>0) {
        var helpElem = document.getElementById(help_id);
        if (helpElem && helpElem.onclick) {
            helpElem.onclick();
        }
    }
}


//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

// Determine brwsr and version.

function ecBrowser() {

    var ua, s, i;

    this.isIE    = false;
    this.isNS    = false;
    this.version = null;

    ua = navigator.userAgent;

    s = "MSIE";
    if ((i = ua.indexOf(s)) >= 0) {
        this.isIE = true;
        this.version = parseFloat(ua.substr(i + s.length));
        return;
    }

    s = "Netscape6/";
    if ((i = ua.indexOf(s)) >= 0) {
        this.isNS = true;
        this.version = parseFloat(ua.substr(i + s.length));
        return;
    }

    // Treat any other "Gecko" brwsr as NS 6.1.
    s = "Gecko";
    if ((ua.indexOf(s)) >= 0) {
        this.isNS = true;
        this.version = 6.1;
        return;
    }
}

var brwsr = new ecBrowser();

// Global object to hold drag information.
var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(event, id) {
    var x, 
        y;

  // If an element id was given, find it. Otherwise use the element being clicked on.
    if (id) {
        dragObj.elNode = document.getElementById(id);
    } else {
        if (brwsr.isIE) {
            dragObj.elNode = window.event.srcElement;
        }

        if (brwsr.isNS) {
            dragObj.elNode = event.target;
        }

        // If this is a text node, use its parent element.
        if (dragObj.elNode.nodeType == 3) {
            dragObj.elNode = dragObj.elNode.parentNode;
        }
    }

  // Get cursor position with respect to the page.
    if (brwsr.isIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop  + document.body.scrollTop;
    }
  
    if (brwsr.isNS) {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }

    // Save starting positions of cursor and element.
    dragObj.cursorStartX = x;
    dragObj.cursorStartY = y;
    dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
    dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

    if (isNaN(dragObj.elStartLeft)) {
        dragObj.elStartLeft = 0;
    }
    if (isNaN(dragObj.elStartTop)) {
        dragObj.elStartTop  = 0;
    }

    // Update element's z-index.
    // dragObj.elNode.style.zIndex = ++dragObj.zIndex;
    // Capture mousemove and mouseup events on the page.
    if (brwsr.isIE) {
        document.attachEvent("onmousemove", dragGo);
        document.attachEvent("onmouseup",   dragStop);
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    if (brwsr.isNS) {
        document.addEventListener("mousemove", dragGo,   true);
        document.addEventListener("mouseup",   dragStop, true);
        event.preventDefault();
    }
}

function dragGo(event) {
    var x, 
        y;

    // Get cursor position with respect to the page.
    if (brwsr.isIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }

    if (brwsr.isNS) {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }

    // Move drag element by the same amount the cursor has moved.
    dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
    dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";

    if (brwsr.isIE) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    
    if (brwsr.isNS) {
        event.preventDefault();
    }
}

function dragStop(event) {

    // Stop capturing mousemove and mouseup events.
    if (brwsr.isIE) {
        document.detachEvent("onmousemove", dragGo);
        document.detachEvent("onmouseup",   dragStop);
    }
  
    if (brwsr.isNS) {
        document.removeEventListener("mousemove", dragGo,   true);
        document.removeEventListener("mouseup",   dragStop, true);
    }
}