//override of edge default, as this widget can remove the inline onclick handler....

function getLinks(p_document, p_includeDisabled, ns)
{
	var numLinks = p_document.links.length;
	var linx = new Array();
	for (var i = 0; i < numLinks; i++)
	{
		//not worrying about namespace here. TODO this may need doing sometime......
		var events = $._data(p_document.links[i], "events");
		var hasEvents = (events != null);
		if (hasEvents && events.click != null  && (  typeof disabled == 'undefined' || (p_includeDisabled || !disabled))  ) {
			linx.push(p_document.links[i]) ;
		}
		else {
			with ( p_document.links[i] )
			{
				if  ( ( typeof onclick != 'undefined' && onclick != null)  && ( typeof disabled == 'undefined' || (p_includeDisabled || !disabled)) )
				{
					 var onclickString = onclick.toString();
					 if  ( ns == '' || onclickString.indexOf("'" + ns + "'") > -1 || onclickString.indexOf("\"" + ns + "\"") > -1)
					 {
						linx.push(p_document.links[i]) ;
					 }
				}
			}

		}
	}
	return(linx);
}

function performedDefaultButtonActionOnLinks(p_comp, p_defaultButton, p_elements, ns, p_doEvenWhenHidden)
{
	var buttonClickedCheck = "buttonClicked('" + p_defaultButton + "'";
	var buttonClickedOfflineCheck = "buttonClickedOffline('" + removeSpaces(p_defaultButton) + "'";
	var buttonClickedCheckDbl = "buttonClicked(\"" + p_defaultButton + "\"";
	var buttonClickedOfflineCheckDbl = "buttonClickedOffline(\"" + removeSpaces(p_defaultButton) + "\"";
  
	for (var i =0; i < p_elements.length; i++)
	{
		var onclickInd = p_elements[i].onclick;
		var oldClickAttr = $(p_elements[i]).attr('onoldclick');
		var oldonclickInd = typeof oldClickAttr !== typeof undefined && oldClickAttr !== false
		if  ( onclickInd || oldonclickInd)
		{
			var onclickString = onclickInd ? p_elements[i].onclick.toString() : oldClickAttr;
			if  ( onclickString.indexOf(buttonClickedCheck) > -1 || onclickString.indexOf(buttonClickedOfflineCheck) > -1 || onclickString.indexOf(buttonClickedCheckDbl) > -1 || onclickString.indexOf(buttonClickedOfflineCheckDbl) > -1 )
			{
				if (p_doEvenWhenHidden || !isHidden(p_elements[i]))
				{
					p_comp.onblur();
					if (onclickInd){
						execute(p_elements[i], "onclick" , DEFAULT_BUTTON_ACTION_TRIGGER);
					} else {
						$(p_elements[i]).click();
					}
					
				}
				return(true);
			}
		}
	}
	return(false);
}	
	
	
$(window).resize(function() {
    try {
      $(".tc-ui-dialog").dialog("option", "position", "center");
    } catch (e) {
      //in case dialog has not been initialised...
    }
});

 function showPopup(argObj) {
	setTimeout(function(){		
		  var $button = $("#" + argObj.id);
		  var $parent = argObj.ParentContextSelector ? $button.closest(argObj.ParentContextSelector) : $("html");
		  var $dialog = $("[data-dialog-trigger=" + argObj.id + "]");
		var errors = $('div.tc-error-color');
		if(errors.length <= 0) {
		  if ($dialog.length == 1) 
			$dialog.dialog("open");
		  else {
			var $section = $parent.find(argObj.IdToUpdate);
			var modal = $section.is(".tc-popup-modal");
			var title = $section.find(".tc-popup-title").text();

			$section.dialog({
			  title: title,
			  dialogClass: "tc-ui-dialog",
			  modal: modal,
			  width: 'auto',
			  height: 'auto',
			  autoOpen: true,
			  open: function() {
				$(this).attr("data-dialog-trigger", argObj.id).parent().appendTo("#EDGE_CONNECT_PROCESS");
			  },
			  show: function() {
				$(this).fadeIn('fast');
			  },
			  hide: function() {
				$(this).fadeOut('fast');
			  }
			});
		  }
		}
	}, 1);
  
	
}

 function showPopup_alt(argObj) {
	setTimeout(function(){		
		  var $button = $("#" + argObj.id);
		  var $parent = argObj.ParentContextSelector ? $button.closest(argObj.ParentContextSelector) : $("html");
		  var $dialog = $("[data-dialog-trigger=" + argObj.id + "]");
		var errors = $('div.tc-error-color');
		if(errors.length <= 0) {
		  if ($dialog.length == 1) 
			$dialog.dialog("open");
		  else {
			var $section = $parent.find(argObj.IdToUpdate);
			var modal = $section.is(".tc-popup-modal");
			var title = $section.find(".tc-popup-title").text();

			$section.dialog({
			  title: title,
			  dialogClass: "tc-ui-dialog",
			  modal: modal,
			  width: 'auto',
			  height: 'auto',
			  autoOpen: true,
			  open: function() {
				//$(this).attr("data-dialog-trigger", argObj.id).parent().appendTo("#EDGE_CONNECT_PROCESS");
				$(this).parent().show();
			  },
			  show: function() {
				$(this).fadeIn('fast');
			  },
			  hide: function() {
				$(this).fadeOut('fast');
			  }
			});
		  }
		}
	}, 1);
  
	
}

function toggleExpandingSection(argObj) {
	var $button = $("#" + argObj.id);
	if (argObj.ParentContextSelector != null && argObj.ParentContextSelector.length > 0){
		var $section = $button.closest(argObj.ParentContextSelector).find(argObj.IdToUpdate);
		if ($section.is(".tc-ex-sec-show")) {
			$section.css("height", $section.outerHeight());
			var time = $section.outerHeight() * 2;
			$section.transit({
				height: "0px" 
			}, time, "ease", function() {
				$section.addClass("tc-ex-sec-hide").removeClass("tc-ex-sec-show")
			})
			if (argObj.DefaultTextOnButton != "") {
				$button.find("span").text(argObj.DefaultTextOnButton);
			}
			
		} else {
			var time = $section.get(0).scrollHeight * 2
			$section.transit({
				height: $section.get(0).scrollHeight 
			}, time, "ease", function() {
				$section.addClass("tc-ex-sec-show").removeClass("tc-ex-sec-hide")
					.css("height", "");
			})
			if (argObj.ClickedTextOnButton != "") {
					$button.find("span").text(argObj.ClickedTextOnButton);
			}
				
		}
	}
}

function toggleExpandingSectionScroll(argObj) {
	var device = argObj.isHybrid;
	var $button = $("#" + argObj.id);
	if (argObj.ParentContextSelector != null && argObj.ParentContextSelector.length > 0){
		var $section = $button.closest(argObj.ParentContextSelector).find(argObj.IdToUpdate);
		if ($section.is(".tc-ex-sec-show")) {
			$section.css("height", $section.outerHeight());
			var time = $section.outerHeight();
			if(device != '') {
				$('html, body').animate({
					scrollTop: $(argObj.ParentContextSelector).offset().top
				}, 0);
			}
			$section.transit({
				height: 0 
			}, time, "ease", function() {
				$section.addClass("tc-ex-sec-hide").removeClass("tc-ex-sec-show")
			})
			if (argObj.DefaultTextOnButton != "") {
				$button.find("span").text(argObj.DefaultTextOnButton);
			}
			
		} else {
			var time = $section.get(0).scrollHeight;
			$section.transit({
				height: $section.get(0).scrollHeight 
			}, time, "ease", function() {
				$section.addClass("tc-ex-sec-show").removeClass("tc-ex-sec-hide")
					.css("height", "");
			})
			if (argObj.ClickedTextOnButton != "") {
					$button.find("span").text(argObj.ClickedTextOnButton);
			}
				
		}
	}
}




function setFocusToSearch(argObj) {
  // hide any other popups...
  $(".tc-popup.show-popup").not(".tc-popup-fixed").removeClass("show-popup");

  if ( !$(argObj.IdToUpdate).is(".show-popup") )
    $(".tc-search-input").focus();
  else 
    $(window).focus();
}

function ext_moveToButton(argObj) {
  var rtl = $("html").attr("dir")  == "rtl";
  var $button = $("#" + argObj.id);
  var $offsetParent = $button.offsetParent();//.closest(".responsive-section, .tc-card");
  var buttonPos = $offsetParent.is(".tc-card") ? $button.position().left - 25 : $button.position().left
  var containerWidth = $offsetParent.outerWidth();
  var offsetParam = rtl ? "left" : "right";

// work out the id with component prefix injectected...
  var tmpIdArr = [];
  $(argObj.IdToUpdate.split(",")).each(function(i, o) {
      var selector = $.trim(o).replace("#", "#" + argObj.COMPONENT_ID_PREFIX );
      tmpIdArr.push(selector);//$parent.find(selector).addBack(selector).toggleClass("$$ITEM.ClassToToggle$");
  });
  var IdToUpdateWithCompPrefix = tmpIdArr.join(", ");

  var $elsToUpdate = $(IdToUpdateWithCompPrefix);
  if (argObj.ParentContextSelector != null && argObj.ParentContextSelector.length > 0){
	$elsToUpdate = $button.closest(argObj.ParentContextSelector).find(IdToUpdateWithCompPrefix);
  }

  //close any open popups
  $(".tc-header-icon-on, .tc-icon-on").not("#" + argObj.id).removeClass("tc-header-icon-on tc-icon-on");
  //$(".tc-popup.show-popup").not(IdToUpdateWithCompPrefix).removeClass("show-popup"); // This doesn't work. Please refer to lines 223-225
  
  // find the current opened popup
  var currPopoutId = $button.closest('.tc-card-header-with-popout').find('.tc-popup').attr('id');
  //close any open popups
  $(".tc-popup.show-popup").not('#' + currPopoutId).removeClass("show-popup");
  

    if (rtl) {
      $elsToUpdate.css(offsetParam, buttonPos + 10);
    } else {
	  var horizAdjust = $button.is(".tc-header-icon") ? 0 : 9;
      $elsToUpdate.css("left", "").css(offsetParam, containerWidth - ( buttonPos + $button.width() ) + horizAdjust);
      setTimeout(function() {
  		  if ( $elsToUpdate.length > 0 && $elsToUpdate.offset().left < 0) {
  			  var right = parseInt( $elsToUpdate.css("right"), 10 );
  			  $elsToUpdate.css("right", right + $elsToUpdate.offset().left);
  		  }
  	   }, 500);
    }
}

