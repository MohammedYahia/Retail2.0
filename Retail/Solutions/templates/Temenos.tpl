$%if COMPONENT_ID_PREFIX != ""$
    $$FORMCONTENT$ 
$%else$
$%if PRESENTATIONTYPE != Portlet || IS_RUNPREVIEW == "Y"$
<!DOCTYPE html>
  <html dir="$$PRESENTATIONTYPE.LAYOUTDIRECTION$" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" class="$$!FOOTER_LOCKED$ $$!HEADER_LOCKED$ $$!BOX_VIEW$ $$!FULL_SCREEN$ $$!SHOW_SIDEBAR$ $$!FONT_SIZE$ $$!DENSITY$ $$!HIGH_CONTRAST$ tc-show-breakpoint-hint tc-show-grid ">
    <head>
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
      <meta name="author" content="Temenos"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
      <title>$%IF !APP_TITLE != ''$$$!APP_TITLE$$%ELSE$Temenos Channels - $$PHASE$ $%ENDIF$</title>
      <link rel="icon" href="./images/favicon.ico">
      $$HEADCONTENT$
      
      $%IF DEVICE_INFO.isHybrid == "Y"$
          <script type="text/javascript" src="html/js/cordova/cordova_loader.js"></script>
      $%ENDIF$
      $%IF PRESENTATIONTYPE.LAYOUTDIRECTION == "rtl"$
          <link rel="stylesheet" href="html/css/T-rtl-classes.css" media="screen">
      $%ENDIF$
    
      $%COMMENT$  for dev only
      <link rel="stylesheet" href="html/gridpack/T-DevTools.css" media="screen">
  	  $%ENDCOMMENT$

	  <script type="text/javascript" src="./html/js-others/T-Authenticator.js"></script>
	  <script>
		var referenceOriginalFunction = window["ajaxQuestionAction1"];
console.log("overwrite the original functional");
window["ajaxQuestionAction1"] = function (que, elemId, p_valMand, ns, controllerName, context, disableInput, inline, cmpWithFocus, ignoreErrors)
{
       var elem = document.getElementById(elemId);

       // make sure the element has a type defined
       if (elem && !elem.getAttribute("type"))
       {
             elem.setAttribute("type","");
       }

     // call original method and return its result
return referenceOriginalFunction.call(this,que, elemId, p_valMand, ns, controllerName, context, disableInput, inline, cmpWithFocus, ignoreErrors);
  }
</script>
		<script type="text/javascript">
			function afterChangeTab(p_tabName, ns, p_selStyle, p_tabStyle) {
				//console.log(getTriggeredReason())
				//don't click if changing tab as part of an ajax response
				if (getTriggeredReason() == AJAX_RESPONSE_TRIGGER)
					return;
					
				var i=1;
				var TabPanel = p_tabName.replace("TAB", "PaneTAB");
				if ($("#" + TabPanel).is(":visible"))
				{
					$("#" + TabPanel).find('.defaultTabAction:first').click();
				}
			}
			
			
			
		</script>
		<style>
		.defaultTabAction {display: none}
		/* #EDGE_CONNECT_PHASE { opacity: 0; } /*
		</style>
		<script type="text/javascript" src="html/js/connect_table.js"></script>
		<script type="text/javascript" src="html/js-others/T-Custom.js"></script>
		
		
		<link rel="stylesheet" href="html/css/TCRetailExtended.css" media="screen">
		$%IF PROCESS == 'Login'$ <style>.ext-tc-nav-col {display:none;}</style>$%ENDIF$
	  
	  
	  
	  
      $%IF A[1].configure == "true"$
        <link id="override_css" type="text/css" rel="stylesheet" href="html/css/StyleOverrides_$$SESSION_ID$.css" media="screen">
      $%ELSE$
        <link id="override_css" type="text/css" rel="stylesheet" href="html/css/StyleOverrides.css" media="screen">
      $%ENDIF$      

  </head>
  <body style="margin:0px;" class="BrowserWindow" data-theme="$$THEME$">
    <div class="tc-skip tc-global-font tc-global-color normal-weight tc-tab-highlight"><a href="#EDGE_CONNECT_PHASE">Skip to Main Content</a></div>
    <div id="helpTextDiv" style="display: none;"></div>
    <div class="tc-breakpoint-hint"></div>
	
	$%if PRESENTATIONTYPE != "HybridOffline"$
		$%IF PRESENTATIONTYPE != "Rich HTML"$ 
			<div class="tc-global-font" style="position: absolute; width: 100%; top: 100px; text-align: center; padding: 1rem">
			<span class="tc-icon icon-warning"><span></span></span>
			This template and the Temenos theme should only be used with Rich HTML presentation types. </div>
		$%ENDIF$
	$%ENDIF$


$%endif$
    <form id="$$NAMESPACE$form1" method="post" action="$$ACTIONURL$" onsubmit="return false;">
      <div><input type="hidden" name="MODE"/></div>
      <div><input type="hidden" name="$$PAGE_KEY$" value="$$PAGE_VAL$"/></div>
      <div><input type="hidden" name="MENUSTATE"/></div>
      $$FORMCONTENT$
    </form>
  
<script type="text/javascript">
	//Handling the download functionality
	$%IF !TemplateCMD = downloadDoc$
		downloadDoc('$$CONTEXTPATH$');
	$%endif$
	//Handling the print functionality
	$%IF !TemplateCMD = printDoc$ 
		printDoc('$$CONTEXTPATH$');
	$%endif$
	$%IF !TemplateCMD = downloadTemplate$ 
		downloadTemplate('$$CONTEXTPATH$');
	$%endif$
	//Handling the EFS download functionality
	$%IF !TemplateCMD = EFS_DOCUMENT_DOWNLOAD$
		efsDocumentDownload();
	$%endif$
	var _efs_backgroundWorker_response = "_efs_backgroundWorker_response";

	function efsDocumentDownload() {
  _efs_addHiddenIFrame(_efs_backgroundWorker_response);
  window.open('$$CONTEXTPATH$/DocumentDownloadServlet?outputFileAttr=EFS_DOWNLOAD_FILE&filenameAttr=EFS_DOWNLOAD_FILENAME', _efs_backgroundWorker_response);
}

function _efs_addHiddenIFrame(identifier) {
  console.log("Attempting to add hidden iframe with identifier: [" + identifier + "]");
  if (!document.getElementById(identifier)) {
    console.log("Creating iframe with identifier: [" + identifier + "]");
    var iframe = (/MSIE (6|7|8)/).test(navigator.userAgent)
      ? document.createElement('<iframe name="' + identifier + '">')
      : document.createElement('iframe');
    iframe.name = identifier;
    iframe.id = identifier;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }
}



initialiseMultiSessionCheck(3, 5);

	</script>

  
    $%COMMENT$  for dev only
    <script src="html/gridpack/ecGrid.js"></script>
	$%ENDCOMMENT$
    
    $%include ##PROJECTHOME#\templates\TemenosTooltips.tpl$ $%endinclude$

$%if PRESENTATIONTYPE != Portlet || IS_RUNPREVIEW == "Y"$
	<form name="sessionTimeoutForm" method=POST action="servletcontroller" autocomplete="off">
		<input type="hidden" name="PRODUCT" value="">
		<input type="hidden" name="PRESENTATION_TYPE" value="">
		<input type="hidden" name="MODE" value="XX">
		<input type="hidden" name="WorkingElements[1].SessionLoggedOutDueToInactivity" value="Y"/>
	</form>
  </body>
</html>
$%endif$

$%endif$
