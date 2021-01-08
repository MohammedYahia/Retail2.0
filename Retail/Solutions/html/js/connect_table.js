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

/******************************************************************************************************************
* Functions that can be overridden as required. 
* NB: If the before* functions return false then this will veto the standard actions.
******************************************************************************************************************/

function beforeRowClicked(p_comp, p_instancePath, p_selector, ns, p_colour, p_oddRowCol, p_evenRowCol) { return true ; }
function afterRowClicked(p_comp, p_instancePath, p_selector, ns, p_colour, p_oddRowCol, p_evenRowCol)  { }
function beforeRowDoubleClicked(p_comp, p_colour, p_oddRowCol, p_evenRowCol, p_instancePath, p_selector, p_defaultButton, ns) { return true ; }
function afterRowDoubleClicked(p_comp, p_colour, p_oddRowCol, p_evenRowCol, p_instancePath, p_selector, p_defaultButton, ns)  { }

/****************
*  TABLE STUFF
****************/

function tableNavClicked(p_tableName, p_pageNum, p_ns, p_tablePos, p_tblid){
 var tableName = unescape(stripPrefix(p_ns, p_tableName)); 

 if ( this["clientSideValidation"] && this["formatCheckElems"] )
 {
     if (!formatCheckElems(getFormElems(p_ns), p_ns)) return;
 }
 
 var tableNavMode = prefixCompID(p_ns, p_tableName, "TABLE_NAV__") + tableName + "__BTN_" + p_pageNum + "__ID__" + encodeParam(p_ns + stripPrefix(p_ns, p_tblid));
 var scrollToAnchorId = "_TABLE_" + p_tblid; // ANCHOR will get pre-pended to it
 ecSubmitForm(p_ns, tableNavMode, true, scrollToAnchorId );
}

function columnSort(td, table, dataType, selector, ns, withoutTableHeaderRow, oddStyle, evenStyle, selStyle){
 if (ns  == null) ns = "";
 var selectors = getForm(ns).getElementsByTagName("input");
 var s;
 for (var i = 0; i < selectors.length; i ++){
   if (selectors[i].name == selector){
	 s = selectors[i];
   }
 }
 if (s != null) {
  put(selector, getElementValue(s, ns));
 }
 resortTable(td, table, dataType, ns, withoutTableHeaderRow);
 if (s != null) {
  //reset the value of the selector...
  r = get(selector);
  var valueArray = splitstring(r, "|", false);
  s = document.getElementsByName(selector);
  //loop through all selectors....
  for (var x = 0; x < s.length ; x++){
    //loop through stored values
   for(var y = 0; y < r.length; y++){
    if (s[x].value == valueArray[y]){
     s[x].checked = true;
     s[x].value = r;
     break;
    }
   }
  }
 }
 //recolourTableRows(table, oddStyle, evenStyle, selStyle, withoutTableHeaderRow);
}

function toggleCheckboxes(cBox, tbody, scrolling, selStyle, oddStyle, evenStyle, ns){
  if (scrolling == true){
	var table = tbody.getElementsByTagName("table")[0];
	tbody = getFirstRealChild(table);
  }

  if (tbody == null || tbody.childNodes == null || tbody.childNodes.length == null)
  	return;

  var selectAllState = cBox.checked;
  for (var i = 0; i<tbody.childNodes.length; i++){
	var row = tbody.childNodes[i];
	if (row.innerHTML){
		var selector = getSelector(row, "");
		if ( (selectAllState && !selector.checked) ||
			 (!selectAllState && selector.checked) )
			row.click();
	}
  }
  //recolourTableRows(tbody.parentNode, oddStyle, evenStyle, selStyle, scrolling, ns);
}

function getSelector(p_row, ns)
{
	if (ns == null) ns = "";
	
	var searchID = getTableId(p_row) + "_Selector" ;
	
	var inputFields = p_row.getElementsByTagName("input");
	var selector = null ;
	if (inputFields && inputFields.length)
	{
		for (var i = 0; i < inputFields.length; i++){
			if (inputFields[i].id && inputFields[i].id.indexOf( searchID ) == 0 ){
				selector = inputFields[i];
				break;
			}
		}
	}
	return(selector);
}

function setSelector(p_row, ns, p_checked)
{
	var selector = getSelector(p_row, ns);
	if	(selector != null)
	{
		selector.checked = p_checked;
	}
}

function isRowSelected(p_row, ns)
{
	var selector = getSelector(p_row, ns);
	return ((selector != null) ? selector.checked : false);
}

function selectRowClicked(comp, instancePath, selector, ns){
    if (selector != null && selector.length > 0)
    {
        var s = document.getElementsByName(selector);
		

        if (s != null && s.length == null)
        {
			if (this["hideErrorMessage"])
			{
				hideErrorMessage(ns, s, []);
			}
            // I think this block is when a single element is returned (i.e. not an array) .. but not sure which browser/version does that to test
            // 
            if (isRadio(s))
            {
                s.checked = true;
				//hide and mand message...
				if (this["hideErrorMessage"])
				{
					hideErrorMessage(ns, s, []);
				}
            }
            else
            {
                s.checked = !s.checked;
            }
            
            var selectAll = findSelectAll(comp);
            
            if (selectAll != null)
                selectAll.checked = s.checked;
        }
        else
        {
            var allSel = true;
			if (this["hideErrorMessage"])
			{
				hideErrorMessage(ns, s[0], []);
			}
            for ( var x = 0; x < s.length; x++)
            {
                if (s[x].value == instancePath)
                {
                    if (isRadio(s[x]))
                    {
                        // not allowed to uncheck a radio....
                        s[x].checked = true;
					}
                    else
                    {
                        // checkbox, toggle state...
                        s[x].checked = !s[x].checked;
                    }
                    s.value = instancePath;
                }
                if (!s[x].checked)
                {
                    allSel = false;
                }
            }// end for

            var selectAll = findSelectAll(comp);
            
            if (selectAll != null)
                selectAll.checked = allSel;
        }
    }
}

function findSelectAll(p_comp)
{
    var table = getTable(p_comp);
    if (!table) return null;
    
    var searchID = table.id + "_SelectAll";

    var inputs = table.getElementsByTagName("input");
    var selectAll = null;
    var tmpObj = null;
    for ( var i = 0; i < inputs.length; i++)
    {
        tmpObj = inputs[i];
        var id = tmpObj.getAttribute("id");
        if (id && id.indexOf(searchID) == 0)
        {
            selectAll = tmpObj;
            break;
        }
    }  
    
    return(selectAll);
}

function rowDoubleClicked(p_comp, p_isMultiSelect, p_style, p_oddStyle, p_evenStyle, p_instancePath, p_selector, p_defaultButton, ns, p_doEvenWhenHidden)
{
    if (ns  == null) ns = "";
    if (beforeRowDoubleClicked(p_comp, p_style, p_oddStyle, p_evenStyle, p_instancePath, p_selector, p_defaultButton, ns) == false) return;
    selectRowClicked(p_comp, p_instancePath, p_selector, ns);
    if (p_style || p_oddStyle || p_evenStyle){
      setTableColours(p_comp, p_isMultiSelect, ns, p_style, p_oddStyle, p_evenStyle);
    }
    performDefaultButtonAction(p_comp, p_defaultButton, ns, p_doEvenWhenHidden);
    afterRowDoubleClicked(p_comp, p_style, p_oddStyle, p_evenStyle, p_instancePath, p_selector, p_defaultButton, ns);
}

/* Last three styles may not be defined */
function rowClicked(comp, instancePath, selector, ns, p_isMultiSelect, style, oddStyle, evenStyle){
 if(!comp)return;
 if (ns  == null) ns = "";
 if	(beforeRowClicked(comp, instancePath, selector, ns, style, oddStyle, evenStyle) == false) return;
 selectRowClicked(comp, instancePath, selector, ns);
 if (style || oddStyle || evenStyle){
  setTableColours(comp, p_isMultiSelect, ns, style, oddStyle, evenStyle);
 }
 afterRowClicked(comp, instancePath, selector, ns, style, oddStyle, evenStyle);
}

function getTable(p_comp){
  return findTable(p_comp);
}

function findTable(p_comp, p_stopAtID){
  var p = p_comp;
  while ( p != null) {
    if ( p_stopAtID && p_stopAtID != "" && p_stopAtID == p_id ) {
      p = null;
      break;
    }	
    if ( (p.nodeName == "TABLE" && p.title) || (p.id && p.id.indexOf("TBL_") >= 0 && getRowPart(p.id).length == 0 ) )
      break;
    p = p.parentNode;
  }
  return(p);
}

function getTableName(comp){
    return (getTable(comp).getAttribute("title"));
}

function getTableId(comp){
    return (getTable(comp).getAttribute("id"));
}

function mouseEntered(comp, ns, roStyle, selStyle, oddStyle, evenStyle ){
 if (ns  == null) ns = "";
 
 // Set the roll over style if this row is not selected
 //
 if (roStyle && roStyle.length > 0 && !isRowSelected(comp, ns)){
     
   setVariable(ns, prefixCompID(ns, comp.id, "RO_STYLE"), roStyle);
   setVariable(ns, prefixCompID(ns, comp.id, "SEL_STYLE"), selStyle);
   setVariable(ns, prefixCompID(ns, comp.id, "ODD_STYLE"), oddStyle);
   setVariable(ns, prefixCompID(ns, comp.id, "EVEN_STYLE"), evenStyle);
   
   // Hide Odd/Even styles
   //
   //hideOddEvenStyles(comp, oddStyle, evenStyle);
   
   // Save any other usage of the roll over style (e.g. maybe same as selected row)
   //
   jscss('replace', comp, roStyle, "ecMarker_rs" );
   
   // Now add in the Roll Over Style
   //
   jscss('add', comp, roStyle);
   
 }
 comp.style.cursor = (IE4)?'hand':'pointer';
}

function mouseLeft(comp, ns){ //rowInd starts on 1
  if (ns  == null) ns = "";
  
  var roStyle = getVariable(ns, prefixCompID(ns, comp.id, "RO_STYLE"));
  
  // Restore the odd/even styles if we are not showing the selected style
  //
  if (roStyle && roStyle.length > 0 && !isRowSelected(comp, ns) ){

      // Remove the current roll over style
      //
      jscss('remove', comp, roStyle);
      
      // Restore any other usages of the roll over style
      //
      jscss('replace', comp, "ecMarker_rs", roStyle );
      
      // Restore odd/even styles
      //
      //showOddEvenStyles(comp, getVariable(ns, prefixCompID(ns, comp.id, "ODD_STYLE")), getVariable(ns, prefixCompID(ns, comp.id, "EVEN_STYLE")));
  }
}

function hideOddEvenStyles(comp, oddStyle, evenStyle)
{
    jscss('replace', comp, oddStyle, "ecMarker_os");
    jscss('replace', comp, evenStyle, "ecMarker_es");
}

function showOddEvenStyles(comp, oddStyle, evenStyle)
{
    jscss('replace', comp, "ecMarker_os" , oddStyle );
    jscss('replace', comp, "ecMarker_es", evenStyle );
}


function setTableColours(comp, p_isMultiSelect, ns, selStyle, oddStyle, evenStyle){
 var tableID = getTableId(comp);
 //var isMultiSelect = (document.getElementById(tableID + "_SelectAll") != null );
 var tmp_rowClickedIds = getVariable(ns, 'rowClickedIds');
 var prevRowClickedId = tmp_rowClickedIds[tableID];

 if (p_isMultiSelect){
	if ( isRowSelected(comp, ns) )
		jscss('replace', comp, "ecMarker_ss", selStyle );
	else
		jscss('remove', comp, selStyle);
	showOddEvenStyles(comp, oddStyle, evenStyle);
 }
 else if (prevRowClickedId && prevRowClickedId != ""){ 
   var prevRowClicked = document.getElementById(prevRowClickedId);
   if (prevRowClicked != null && !isRowSelected(prevRowClicked, ns)) {
     
     // Remove selected style used for the click, but restore any other use of the selected style
     //
     jscss('remove', prevRowClicked, selStyle);
     jscss('replace', comp, "ecMarker_ss", selStyle );

	 // Put back the odd/even styles
	 //
	 showOddEvenStyles(prevRowClicked, oddStyle, evenStyle);
   }
 }
 tmp_rowClickedIds[tableID] = comp.id;
 setVariable(ns, 'rowClickedIds', tmp_rowClickedIds);

 if	(isRowSelected(comp, ns) && (("" + selStyle).length) > 0) {
     
   // Save any current usage of the selected style
   //
   jscss('replace', comp, selStyle, "ecMarker_ss");
 
   // Hide the odd/even styles so they don't trump the selected style before adding it
   //
   hideOddEvenStyles(comp, oddStyle, evenStyle);
   
   // Remove the rollover style if there is one so it doesn't hide the selected style
   //
   jscss('remove', comp, getVariable(ns, prefixCompID(ns, comp.id, "RO_STYLE")));
   
   // Now set the selected style
   //
   jscss('add', comp, selStyle);
 }
}



/* **** Please declare non-static variables in RichHtmlUtils.addStandardJavascript and use set/getVariable(ns,"var") **** */

function getColumnInnerText(el) {
    if (typeof el == "string") return el;
    if (typeof el == "undefined") { return el };
    var str = "";
    var cs = el.childNodes;
    var l = cs.length;
    for (var i = 0; i < l; i++) {
        switch (cs[i].nodeType) {
            case 1: //ELEMENT_NODE
                if (cs[i].className == "accessibilityStyle") break;
                str += getColumnInnerText(cs[i]);
                break;
            case 3: //TEXT_NODE
                str += cs[i].nodeValue;
                break;
        }
    }
    return str;
}

function resortTable(th, table, dataType, ns, withoutTableHeaderRow) {
  if (ns  == null) ns = "";
  var innerDiv = th.firstChild;
  // get the img
  var img = null;
  if (innerDiv.lastChild && innerDiv.lastChild.tagName && innerDiv.lastChild.tagName.toLowerCase() == 'img'){
	img = innerDiv.lastChild;
  }
  else {
    for (var ci=0;ci<innerDiv.childNodes.length;ci++) {
      if (innerDiv.childNodes[ci].tagName && innerDiv.childNodes[ci].tagName.toLowerCase() == 'img') {
        img = innerDiv.childNodes[ci];
      }
    }
  }
  var headerRow = th.parentNode;
  var column = th.getAttribute("abbr") - 1;

  if (table != null){
    var x = 1;
	if (withoutTableHeaderRow) x = 0;
    var y = table.rows.length;

    // Work out a type for the column
    sortfn = new Function("a","b","var n='"+ns+"'; return sortRowsCaseInsensitive(a,b,n);");
    if (dataType == "date") sortfn = new Function("a","b","var n='"+ns+"'; return sortRowsByDate(a,b,n);");;
    if (dataType == "number") sortfn = new Function("a","b","var n='"+ns+"'; return sortRowsByNumeric(a,b,n);");;
	setVariable(ns, "SORT_COLUMN_INDEX", column);
    var newRows = new Array();
    for (j=x;j<y;j++) {
	  if (withoutTableHeaderRow)
        newRows[j] = table.rows[j];
	  else
        newRows[j-1] = table.rows[j];
	}
    
    newRows.sort(sortfn);
    
    if (img != null) {
      if (img.getAttribute("sortdir") == "ascending") {
        img.src = getImageDirPath(ns) + "up.gif";
        newRows.reverse();
        img.setAttribute("sortdir","descending");
      }
      else {
        img.src = getImageDirPath(ns) + "down.gif";
        img.setAttribute("sortdir","ascending");
      }
    }

    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    for (i=0;i<newRows.length;i++) {
      if (table.getElementsByTagName("tbody")){
		  table.getElementsByTagName("tbody")[0].appendChild(newRows[i]);
      }
    }
    
    // Delete any other arrows there may be showing
    for (var ci=0;ci<headerRow.childNodes.length;ci++) {
      if (headerRow.childNodes[ci].lastChild && headerRow.childNodes[ci].lastChild.tagName != "undefined"){
	    if (headerRow.childNodes[ci].lastChild.tagName && headerRow.childNodes[ci].lastChild.tagName.toLowerCase() == "img" && headerRow.childNodes[ci].lastChild != img){
          headerRow.childNodes[ci].lastChild.src = getImageDirPath(ns) +"invis.gif";
          headerRow.childNodes[ci].lastChild.setAttribute("sortdir","");
	    }
	  }
    }
  }
}

function getParent(el, pTagName) {
    if (el == null) return null;
    else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())    // Gecko bug, supposed to be uppercase
        return el;
    else
        return getParent(el.parentNode, pTagName);
}

function sortRowsByDate(a, b, ns) {
	if (ns  == null) ns = "";
	var SORT_COLUMN_INDEX = getVariable(ns, "SORT_COLUMN_INDEX");
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
    aa = getColumnInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = getColumnInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
    }
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
    } else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
    }
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
}

function sortRowsByNumeric(a,b,ns) { 
	if (ns  == null) ns = "";
	var SORT_COLUMN_INDEX = getVariable(ns, "SORT_COLUMN_INDEX");
    aa = parseFloat(getColumnInnerText(a.cells[SORT_COLUMN_INDEX]));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(getColumnInnerText(b.cells[SORT_COLUMN_INDEX])); 
    if (isNaN(bb)) bb = 0;
    return aa-bb;
}

function sortRowsCaseInsensitive(a,b,ns) {
	if (ns  == null) ns = "";
	var SORT_COLUMN_INDEX = getVariable(ns, "SORT_COLUMN_INDEX");
    aa = getColumnInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
    bb = getColumnInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}

function sortRowsByDefault(a,b,ns) {
	if (ns  == null) ns = "";
	var SORT_COLUMN_INDEX = getVariable(ns, "SORT_COLUMN_INDEX");
    aa = getColumnInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = getColumnInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}