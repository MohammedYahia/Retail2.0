$%if COMPONENT_ID_PREFIX != ""$
    $$FORMCONTENT$ 
$%else$
$%if PRESENTATIONTYPE != Portlet || IS_RUNPREVIEW == "Y"$
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
  <html dir="$$PRESENTATIONTYPE.LAYOUTDIRECTION$" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
    <head>
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	  $%COMMENT$ Setting the viewport this way is useful for hybrid, beacause this prevents zooming $%ENDCOMMENT$
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">	 
      $%COMMENT$ This is useful for windows phone hybrid, if you want to prevent tap highlighting $%ENDCOMMENT$
      <meta name="msapplication-tap-highlight" content="no" />	  
      $%COMMENT$ This inclusion enables cordova for hybrid. You can either include cordova here in the template and have it available everywhere, or have it included in each widget that needs cordova $%ENDCOMMENT$	  
      <script src="$$HTML_LOCATION$js/cordova/cordova_loader.js"></script>
      <meta http-equiv="Content-Security-Policy" content="default-src * gap:; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https://ssl.gstatic.com 'unsafe-eval'; object-src *; style-src 'self' data: 'unsafe-inline'; img-src * data:; media-src 'self' data:; font-src 'self' data:; connect-src *"/>
      <title>Temenos $$PRESENTATIONTYPE$ $%IF !VALIDATION_ERROR_COUNT > 0$ - $$!VALIDATION_ERROR_COUNT$ problems exist in your phase.$%ENDIF$</title>
                $$HEADCONTENT$
    </head>
    <body style="margin:0px;" class="BrowserWindow">
$%endif$
$%if PRESENTATIONTYPE != "Pure HTML" && PRESENTATIONTYPE != "Accessibility Compliant"$
    $%COMMENT$ UNCOMMENT IFRAME IF USING AUTOCOMPLETE - PROVIDES WORK-AROUND FOR IE6 ISSUE
    <!--iframe id="ec_suggest_iframe" style="position:absolute; left:0; top:0px; width:0px; height: 0px; " ></iframe-->
    $%ENDCOMMENT$
    <form id="$$NAMESPACE$form1" method="post" action="$$ACTIONURL$" onsubmit="return false;">
      <div><input type="hidden" name="MODE"/></div>
      $%if PRESENTATIONTYPE == "Offline"$
      	<div><input type="hidden" name="PAGE" value="$$PAGE$"/></div>
      $%ELSE$
      	<div><input type="hidden" name="$$PAGE_KEY$" value="$$PAGE_VAL$"/></div>
      $%ENDIF$
      <div><input type="hidden" name="MENUSTATE"/></div>
$%else$
    <form id="$$NAMESPACE$form1" method="post" action="$$ACTIONURL$">
      <div style="display: none;"><input type="text" name="MODE"/></div>
      <div style="display: none;"><input type="text" name="$$PAGE_KEY$" value="$$PAGE_VAL$"/></div>
      <div style="display: none;"><input type="text" name="MENUSTATE"/></div>
$%endif$
	$%if IN_POPUP != "Y"$ <!-- don't show the branding in a popup -->
	    <div style="background-image: url($$CONTEXTPATH$/images/edgeBanner.jpg); width: 100%; height: 150px"></div>
	$%endif$
      <!-- To center the contents of your form, set style="text-align:center;" on the form tag (works in IE), 
          and style="margin-left:auto; margin-right:auto;" on the following table (works in Mozilla) -->
          $%IF PRESENTATIONTYPE.LAYOUTCONTROL == "HTML Divs" || PRESENTATIONTYPE.LAYOUTCONTROL == "HTML DispInlineBlock"$
              <div style="width: 100%">
                      $%IF !VALIDATION_ERROR_COUNT = 1$<div class='errorMessageRed'>1 problem exist in your phase.</div>$%ENDIF$
                      $%IF !VALIDATION_ERROR_COUNT > 1$<div class='errorMessageRed'>$$!VALIDATION_ERROR_COUNT$ problems exist in your phase.</div>$%ENDIF$
          $%else$
              <table cellpadding="0" cellspacing="0" border="0" width="100%" summary="edgeConnect Layout">
                      $%IF !VALIDATION_ERROR_COUNT = 1$<tr><td class='errorMessageRed'>1 problem exist in your phase.</td></tr>$%ENDIF$
                      $%IF !VALIDATION_ERROR_COUNT > 1$<tr><td class='errorMessageRed'>$$!VALIDATION_ERROR_COUNT$ problems exist in your phase.</td></tr>$%ENDIF$
          $%endif$
             $$FORMCONTENT$
          $%IF PRESENTATIONTYPE.LAYOUTCONTROL == "HTML Divs" || PRESENTATIONTYPE.LAYOUTCONTROL == "HTML DispInlineBlock"$
                $%IF PRESENTATIONTYPE.LAYOUTCONTROL == "HTML Divs"$
                    <div style="clear:both"></div>
                $%ENDIF$
              </div>
          $%else$
              </table>
          $%endif$     
    </form>
$%if PRESENTATIONTYPE != Portlet || IS_RUNPREVIEW == "Y"$
<script>
	$%COMMENT$ This is hook that is called befora an AJAX call is performed. $%ENDCOMMENT$		
	function beforeAjaxPOSTRequest(url, async, parameters, ns, ajaxCaller, req) {
		showProgress();
		return true;
	}
	$%COMMENT$ This is hook that is called after making an AJAX call. Note that this hooks gets invoked multiple times, hence the logic for req.readyState $%ENDCOMMENT$
	function afterAjaxPOSTRequest(async, req, ajaxCaller, ns, uid) {
		if (async)
		{
			if (req.readyState == 4) 
			{ 
				closeProgress();
			}
		}
		else
		{
			closeProgress(); 
		}			
		return true;
	}
	
	$%COMMENT$ This is hook that is called before processing a form submit. $%ENDCOMMENT$
	function beforeSubmit () {
		showProgress();
	};
	$%COMMENT$ This is hook that is called when a new page is displayed. $%ENDCOMMENT$
	function afterInitForm(ns) {
		//If you have decided to comment out the call to hideSplashScreen() in index-hybrid.html,
		//this would be a good place to hide the splashscrreen by uncommenting the line below
		//document.addEventListener("deviceready", hideSplashScreen, false);
		document.addEventListener("deviceready", closeProgress, false);		
		if (isWindowExternalNotifyDefined()) {
            closeProgress();
        }           		
	};
	
    $%COMMENT$ 
            Shows the progress dialog for hybrid
            Call with a "message" parameter only if you want to display a custom message in the progress dialog. You can choose to display the default message or to show no message at all. 
        $%ENDCOMMENT$
        function showProgress(message) {
            //if (navigator.spinnerDialog) {
            if ((typeof(navigator) !=='undefined') && (typeof(navigator.spinnerDialog) !=='undefined')) {            
                if (message) {
                    navigator.spinnerDialog.show(true, message);
                } else {
                    $%COMMENT$ 
                        Call navigator.spinnerDialog.show(true)  if you want to show also a message in the progress dialog. The message is configured in the hybrid message editor, under the key loading_wait 
                        Call navigator.spinnerDialog.show(false) if you don't want to show any message in the progress dialog
                    $%ENDCOMMENT$
                    navigator.spinnerDialog.show(false, null);
                }
            } else 
            {
            	if (isWindowExternalNotifyDefined()) {
                    window.external.notify("UNIVERSAL_APPS_SHOW_PROGRESS_NOTIFY"+JSON.stringify({"showMessage":false, "message":message}));
                } else {
                    console.log("no navigator.spinnerDialog");
                }
            }
        };
        
        $%COMMENT$ 
            Closes the progess dialog for hybrid 
        $%ENDCOMMENT$
        function closeProgress() {
            //if (navigator.spinnerDialog) {
            if ((typeof(navigator) !=='undefined') && (typeof(navigator.spinnerDialog) !=='undefined')) {            
                navigator.spinnerDialog.hide();
            } else 
            {
            	if (isWindowExternalNotifyDefined()) {
                    window.external.notify("UNIVERSAL_APPS_CLOSE_PROGRESS_NOTIFY");
                } else {
                    console.log("no navigator.spinnerDialog");
                }
            }
        };      
  </script>
  </body>
</html>
$%endif$
$%endif$
