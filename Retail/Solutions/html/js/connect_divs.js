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

function show(els, naType, ns, checkSiblings, isLayout, doAnimation){
 if (doAnimation === null) doAnimation = true;
 var allHidden = true; var mainCellIDs = new Array();
 if (ns == null) ns = "";
 for (var i=0; i < els.length ; i++){
  if (els[i] == null) return null;
  mainCellIDs[i] = null;
  if (els[i].style != null){ 
    if (beforeElemShown(ns, els[i], naType)) {
	 runElemShownWidgetHooks("before", ns, els[i], naType);
     if (els[i].style.visibility == "hidden") els[i].style.visibility = "visible";
	 jscss('remove', els[i], DISABLED_CLASS);
     //var floatInd = els[i].style.styleFloat;
     if (els[i].tagName.toUpperCase() == "DIV") {
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

		 if ( (els[i].parentNode != null && parentFS != null) ){// || floatInd == "left" /*ie6 fix */) {
			els[i].style.display = 'inline';
		 } 
		 else if (isLayout && naType != "Hide" && doAnimation) {
            var parts = naType.split("|");
			if (naType.indexOf("Fade") == 0){
                eC_Fade(ns, els[i], 1*parts[1], parts[2]);
            }
            else if(naType.indexOf("Slide") == 0 || naType.indexOf("Blind") == 0 || naType.indexOf("Bounce") == 0) {
                eC_Move(ns, els[i], 1*parts[1], parts[0], parts[2]);
            }
		    els[i].style.display = '';
		 }
		 else {
	       showElem(els[i], true);
		 }
		 
		 showElem(els[i].parentNode, true);
		 if (els[i].parentNode.parentNode.id.indexOf("Pane") == -1){
		   showElem(els[i].parentNode.parentNode, true);
		 }

		 if ( parentFS != null ) {
  	       showElem(parentFS.parentNode.parentNode, true);
		   showElem(parentFS.parentNode.parentNode.parentNode, true);
		   showElem(parentFS.parentNode.parentNode.parentNode.parentNode, true);
		 }  
       } else {
	     if (els[i].tagName == "SPAN" || els[i].tagName == "span")
	       els[i].style.display = 'inline';
	     else
	 		els[i].style.display= jscss("check", els[i], "ecDIB") ? 'inline-block' : 'block';
	   }
     }
     else{
       showElem(els[i], true);
       showElem(els[i].parentNode, true);
     }
     setFormElementDisabled(els[i], false);
     if (naType == "Disable") setElementEnabled(els[i]);

	 showHiddens = updateHidden( els[i], true );
     afterElemShown(ns, els[i], naType);
	 runElemShownWidgetHooks("after", ns, els[i], naType);
   }
  }
 }
 if (!allHidden) return null;
 else return mainCellIDs;
}

function hide(els, keepHeading, saveData, naType, ns, checkSiblings, isLayout){
 var allHidden = true; var mainCellIDs = new Array();
 if (ns == null) ns = "";
 for (var i=0; i < els.length ; i++){
  if (els[i] == null) return null;
  mainCellIDs[i] = null;
  if (beforeElemHidden(ns, els[i], keepHeading, saveData, naType)) {
	runElemHiddenWidgetHooks("before", ns, els[i], keepHeading, saveData, naType);
	jscss('add', els[i], DISABLED_CLASS);
	var showHiddens = false;
	if (window['isShowHiddens']) showHiddens = window['isShowHiddens']();
	if ( ( naType == "Hide" || naType == "Remove" ) && !showHiddens){
	  if (keepHeading != null && keepHeading == "true"){
		if (els[i].parentNode.parentNode.tagName.toUpperCase() == "FIELDSET" || els[i].parentNode.tagName.toUpperCase() == "FIELDSET")
		  els[i].style.display = "none";
		else 
		  els[i].style.visibility = "hidden";
	  }
	  else{
	    if (els[i].style != null){
		  els[i].style.display = 'none';
		  if ( checkSiblings ) { 
            var parentFS = getParentFieldset(els[i]);
		    if ((els[i].tagName.toUpperCase() == "DIV") && (parentFS != null)){
     	      if ( !areFieldsetSiblingsAllHidden(parentFS) ) {
  			    allHidden = false;
  		      }
		      if (allHidden) {
			    parentFS.style.display = "none";
			    mainCellIDs[i] = getMainCellIDFromFS(ns, parentFS);
  		        parentFS.parentNode.parentNode.style.display = "none";
		      }
		    } 
		  }
	    }
	  }
    } 
    else if (els[i].tagName.toUpperCase() == "DIV" && isLayout && els[i].style.display != "none") {
        var parts = naType.split("|");
		if (naType.indexOf("Fade") == 0) {
            eC_Fade(ns, els[i], parts[1]*-1, parts[2]);
        }
        else if (naType.indexOf("Slide") == 0 ||naType.indexOf("Blind") == 0 || naType.indexOf("Bounce") == 0) {
			eC_Move(ns, els[i], parts[1]*-1, parts[0], parts[2]);
        }
	}

    if (saveData == 'false') 
      setFormElementDisabled(els[i], true);// disabling stops the value being sent back to the server.
    if (naType == "Disable") 
       setElementDisabled(els[i]);
    
    checkIfAllCellsHidden(ns, els[i]);

    showHiddens = updateHidden( els[i], false );

	afterElemHidden(ns, els[i], keepHeading, saveData, naType);
	runElemHiddenWidgetHooks("after", ns, els[i], keepHeading, saveData, naType);
  }
 }
 if (!allHidden) return null;
 else return mainCellIDs;
}
/*
 *  This function is used at runtime when you don't have LiveDesigner
 *  This function was introduced to solve the situation when you are using a frame in a solution. 
 */
function updateHidden( p_elem, p_show ) 
{
    return false;
}
function checkIfAllCellsHidden(ns, p_elementCellToCheck)
{
	var row = p_elementCellToCheck;
	//we're interested in either a compID or an empty string
	var compIdPrefx = getCompID(ns, p_elementCellToCheck.id) || "";
	while (row.tagName.toLowerCase() != "form" && row.tagName.toLowerCase() != "tr" && (row.id == null || row.id.indexOf(compIdPrefx + "row_") != 0)){
		row = row.parentNode;
		if (!row.tagName) return;
	}
	if (row.tagName.toLowerCase() == "form") return;
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

function getActiveTab(p_startingTab) // WARNING: This overrides the definition in connect.js ..
{
	return p_startingTab.parentNode.parentNode.getElementsByTagName("INPUT")[0];
}

function getTListContainerDiv(outerDiv) {
	return outerDiv.parentNode.parentNode.parentNode.parentNode;
}

function eC_Move(ns, element, p_duration, type, effect, submit, submitParams) {
  var newDiv;
  var bounceInd = (type.indexOf("Bounce") >= 0);
  var slideInd =  (type.indexOf("Slide") >= 0) || bounceInd;
  var leftInd =   (type.indexOf("Left") >= 0);
  var rightInd =  (type.indexOf("Right") >= 0);
  var bottomInd = (type.indexOf("Bottom") >= 0);
  var horizInd = leftInd || rightInd;
  var removeWidth = false;

  //don't run again if we are already showing/hiding element.
  var currentOpts  = getVariable(ns,  element.id +"_animopts");
  if (currentOpts) {
     if (currentOpts.origDuration == p_duration) {
		return;
     }
  }
  //if hidden and hiding, or shown and showing, then don't do anything (ignore phase)...
  if (currentOpts == null && element.id && element.id != "EDGE_CONNECT_PHASE") {
	  if (element.style.display != "none" && p_duration > 0 ||
		  element.style.display == "none" && p_duration < 0) {
		  	return;
	  }
  }
 
  animate({
    delay: 10,
    origDuration: p_duration, 
    duration: Math.abs(p_duration) || 1000, // 1 sec by default
    delta: window[effect],
	element: element,
	expandInd: p_duration > 0,
	ns: ns,
	progress: 0,
	to: 0,
	from: 0,
	start: function() {
		var currentOpts  = getVariable(ns,  element.id +"_animopts");
		if ( currentOpts != null) {
			return invertCurrentOpts(currentOpts);
		}

		if (element.style.width == "") removeWidth = true;
		if (element.parentNode.className != "animMaskDiv"){
			newDiv = document.createElement("div");
			element.parentNode.insertBefore(newDiv, element);
			newDiv.appendChild(element);
			element.parentNode.className = jscss("check", element, "ecDIB") ? "animMaskDiv ecDIB" : "animMaskDiv";
		}
		setElOpac(element.parentNode, "0");
		element.style.display= jscss("check", element, "ecDIB") ? 'inline-block' : 'block';
		element.style.visibility='visible';
		var size;
		if (this.expandInd){
			this.from = 1;
			this.to = horizInd ? element.clientWidth : element.offsetHeight;
			size = this.to;
		} else {
			this.from = horizInd ? element.clientWidth : element.offsetHeight;
			this.to = 0;
			size = this.from;
		}
		element.size = size;
		if (horizInd){
			if (slideInd){
				element.parentNode.style.width = size + 'px';
			}
			else {
				element.style.width = size + "px";
				element.parentNode.style.width = '1px';
				if (rightInd) {
					element.parentNode.style.left = size + 'px';
					element.parentNode.style.position = 'relative';
				}
			}
		} else {
			element.parentNode.style.height = size + 'px';
		}
		this.step(0);
		setElOpac(element.parentNode, "1");
		element.parentNode.style.overflow = 'hidden';
		element.style.position = "relative";
		if (window.frameElement && window.frameElement.id == "popupiframe")
			window.frameElement.style.visibility = "visible";
		return this;
	},
    step: function(delta) {
		var to = this.to; var from = this.from;
		var size = this.expandInd ? to*delta : from - from*delta;
		var offset;
		if (bottomInd) offset = this.expandInd ? to - size : from - size;
		else offset = horizInd ? size - element.size : size - element.offsetHeight;
		if (rightInd) offset = -offset;
		if (slideInd){
			if (horizInd) 
				element.style.left = offset + 'px';
			else {
				element.style.top = offset + 'px';
				element.style.bottom =  size + "px";
				if (!bottomInd)
					element.parentNode.style.height = size + 'px';
			}
		} 
		else {
			if (horizInd) { 
				if (rightInd){
					element.parentNode.style.left = offset + 'px';
					element.style.left = -offset + 'px';
					element.parentNode.style.width = size + 'px';
				}
				else {
					element.parentNode.style.width = size + 'px';
				}
			}
			else {
				element.parentNode.style.height = size + 'px';
			}
		}
	},
	stop: function() {
		if(!this.expandInd){
		    if (window.frameElement && window.frameElement.id == "popupiframe")
				window.frameElement.style.visibility = "hidden";
			if (!submit)
				element.style.display='none';
			else
				element.style.visibility='hidden';
		}
		//take it out of the temp div...
		if (newDiv && newDiv.parentNode){
			newDiv.parentNode.insertBefore(element, newDiv);
			element.parentNode.removeChild(newDiv);
		}

		if (removeWidth){
			element.style.width = "";
		}
		
		element.style.position = "relative";

		if (submit) {
			setElOpac(element, "0");
			ecDoSubmit(submitParams.ns, submitParams.mode, submitParams.scrollToButton, submitParams.id);
		}
	}
  });
}

function invertCurrentOpts(opts){
	opts.duration = opts.duration * opts.progress;
	var tmpTo = opts.to;
	var tmpFrom = opts.from;
	opts.expandInd = !opts.expandInd;
	if (opts.expandInd){
		opts.to = tmpFrom;
		opts.from = 1;
	} else {
		opts.to = 0;
		opts.from = tmpTo * opts.progress;
	}
	var anim_id =  getVariable(opts.ns,  opts.element.id +"_anim_id");
	if ( anim_id != null) clearInterval(anim_id);
	return opts;
}

function eC_Fade(ns, element, p_duration, effect, submit, submitParams) {
  var to, from;
  var expandInd = p_duration > 0;
  
  //
  var currentOpts  = getVariable(ns,  element.id +"_animopts");
  if (currentOpts) {
     if (currentOpts.origDuration == p_duration) {
		return;
     }
  }
  //if hidden and hiding, or shown and showing, then don't do anything (ignore phase)...
  if (currentOpts == null && element.id && element.id != "EDGE_CONNECT_PHASE") {
	  if (element.style.display != "none" && p_duration > 0 ||
		  element.style.display == "none" && p_duration < 0) {
		  	return;
	  }
  }
  
  animate({
    delay: 10,
    origDuration: p_duration, 
    duration: Math.abs(p_duration) || 1000, // 1 sec by default
    delta: window[effect],
	element: element,
	ns: ns,
	progress: 0,
	start: function() {
		var currentOpts  = getVariable(ns,  element.id +"_animopts");
		if ( currentOpts != null) currentOpts.stop();
		var anim_id =  getVariable(ns,  element.id +"_anim_id");
		if ( anim_id != null) clearInterval(anim_id);

		if (expandInd){
			setElOpac(element, 0);
			from = 0;
			to = 1;
		}
		else {
			to = 0;
			from = 1;
		}
		element.style.display= jscss("check", element, "ecDIB") ? 'inline-block' : 'block';
		element.style.visibility = 'visible';
		if (window.frameElement && window.frameElement.id == "popupiframe")
			window.frameElement.style.visibility = "visible";
		return this;
	},
    step: function(delta) {
		if (expandInd) setElOpac(element, delta);
		else setElOpac(element, 1 - delta);
    },
	stop: function() {
		if (!expandInd) {
			element.style.display = "none";	
			if (window.frameElement && window.frameElement.id == "popupiframe")
				window.frameElement.style.visibility = "hidden";
		}
		if (submit) {
			setElOpac(element, "0");
			ecDoSubmit(submitParams.ns, submitParams.mode, submitParams.scrollToButton, submitParams.id);
		}
	}
  });
}

function getElOpac(el) {
	var val = "";
	if (el.filters) val= el.filters.alpha.opacity/100;
	else val= el.style.opacity;
	return parseFloat(val);
}
function setElOpac(el, opac) {
	el.style.opacity = opac;
	el.style.MozOpacity = opac;
	el.style.filter = "alpha(opacity=" + (parseFloat(opac) * 100) + ")";
}

function animate(opts) {
  opts = opts.start();
  setVariable(opts.ns,  opts.element.id +"_animopts", opts );
 
  var start = new Date();   
  var animId = setInterval(function() {
    var timePassed = new Date() - start;
    var progress = timePassed / opts.duration;
	//i++;
	//var progress = i/100;
    if (progress > 1) progress = 1;
    var delta = opts.delta(progress);
	opts.progress = progress;
    opts.step(delta);
    if (progress == 1) {
      clearInterval(animId);
	  setVariable(opts.ns,  opts.element.id +"_animopts", null );
	  setVariable(opts.ns,  opts.element.id +"_anim_id",  null );
	  opts.stop();
    }
  }, opts.delay || 10);
  setVariable(opts.ns,  opts.element.id +"_anim_id", animId );
}

function bounce(progress) {
  for(var a = 0, b = 1; 1; a += b, b /= 2) {
    if (progress >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
    }
  }
}

var linearEasing  = function(p) {return p;};
var accelEasing   = function(p) {return Math.pow(p, 5);};
var decelEasing   = function(p) {return 1-Math.pow(1-p, 5);};
var bounceEasing  = function(p) {return 1 - bounce(1 - p);};

