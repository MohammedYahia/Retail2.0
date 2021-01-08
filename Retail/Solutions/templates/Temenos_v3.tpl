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
      <link rel="icon" type="image/png" sizes="32x32" href="./images/favicon-32x32.png">
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

    $%IF PRESENTATIONTYPE != "Rich HTML"$ 
      <div class="tc-global-font" style="position: absolute; width: 100%; top: 100px; text-align: center; padding: 1rem">
      <span class="tc-icon icon-warning"><span></span></span>
      This template and the Temenos theme should only be used with Rich HTML presentation types. </div>
    $%ENDIF$


$%endif$
    <form id="$$NAMESPACE$form1" method="post" action="$$ACTIONURL$" onsubmit="return false;">
      <div><input type="hidden" name="MODE"/></div>
      <div><input type="hidden" name="$$PAGE_KEY$" value="$$PAGE_VAL$"/></div>
      <div><input type="hidden" name="MENUSTATE"/></div>
      $$FORMCONTENT$
    </form>
      
    $%COMMENT$  for dev only
    <script src="html/gridpack/ecGrid.js"></script>
	$%ENDCOMMENT$
    
    $%include ##PROJECTHOME#\templates\TemenosTooltips.tpl$ $%endinclude$

$%if PRESENTATIONTYPE != Portlet || IS_RUNPREVIEW == "Y"$
  </body>
</html>
$%endif$

$%endif$
