/*
 * Copyright (c) Temenos India Private Limited
 *
 * This source code is used to achieve the download and print funtionalities based on the session variable value
 *  
 * Access to, alteration, duplication or redistribution of this source code in any form 
 * is not permitted without the prior written authorisation temenos.
 * 
 */

//FIX FOR FIRST RADIO BUTTON IN THE LIST HAVING FOCUS STYLING IN ERROR MODE

$(document).ready(function() {
	// call the function for footer fix
	//fixFooter();
	

	// set background images
	function set_image_bkg(){
		var img_ob = $('.ext-bkg-image'),
			w_width = $(window).width(),
			w_height = $(window).height(),
		img_url = 'url("' + img_ob.find('img').attr('src') + '")';
		img_ob.css({
		'height': w_height + 'px',
		'width': w_width + 'px',
		'background-image': img_url
		});
	}
	set_image_bkg();
	$(window).on('resize',function(){
		
		//fixFooter(); // call the function for footer fix on resize also
		set_image_bkg();
	});

	$("a").on("click", function(){
		$(".tc-radio").removeClass("ext-tc-radio-input");
	});

	$(window).load(function(){
		$('body').find('input').closest("div").addClass("ext-tc-radio-input");
	});
	
	// Temporary fix to remove column sorting on DataGRid table when not needed
	$('.ext-non-sortable th').on('click',function(e){
		e.stopImmediatePropagation();
	});
	
	// Temporary fix for focusing on first input in ATM/Branch locator
	$("[id$='-gmap']").on("click", function() { 
		$('#EDGE_CONNECT_PHASE').find(':input').filter(':visible:first').blur();
	});
	
});

// Footer fix -> should be inside the theme

/*function fixFooter() {
    if (!$("html").is(".tc-footer-locked") && $(".tc-footer-container").length > 0) {
      $(".tc-footer-container").css("position", "relative")
                               .css("top", 0 + "px");
      var bottomOfFooter = $(".tc-footer-container")[0].getBoundingClientRect().bottom;                               
      //var bottomOfFooter = $(".tc-footer-container").position().top + $(".tc-footer-container").outerHeight(true);
      var pageHeight = $(window).height();
      if (bottomOfFooter < pageHeight) {
        $(".tc-footer-container").css("position", "relative")
                                 .css("top", (pageHeight - bottomOfFooter ) + "px");
      }
    } else {
      $(".tc-footer-container").css("position", "")
                               .css("top", "");
	}
  }
*/

function destroyPopup() {
	setTimeout(function(){	
		$(".ui-dialog-content").dialog("destroy");
	}, 1);
} 

function closeAllPopup() {
	$(".ui-dialog-content").dialog("close");
}

function downloadDoc(ContextPathDownload){
	try{
		openWindow=window.open(ContextPathDownload+'/ServerFileRetrievalServlet?serverFilePathSessionAttrName=DOC_FILEPATH&contentType=application/octet-stream&','toolbar=0,location=0,left=100,top=100,width=800,height=800');
		openWindow.focus(); 
	}
	catch (e){
		alert("Either popup blocker is enabled or file cannot be downloaded for viewing at this moment."); 
	}
}
function printDoc(ContextPathPrint){
	var getAcrobatInfo = function(){
		var getBrowserName = function() {
			return this.name = this.name || function() {
				var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";
				if(userAgent.indexOf("chrome") > -1){
					return "chrome";
				} else if(userAgent.indexOf("safari") > -1){
					return "safari";
				} else if(userAgent.indexOf("msie") > -1 || navigator.appVersion.indexOf('Trident/') > 0){
					return "ie";
				} else if(userAgent.indexOf("firefox") > -1){
					return "firefox";
				} else {
					//return "ie";
					return userAgent;
				}
			}();
		};
		var getActiveXObject = function(name) {
			try{ 
				return new ActiveXObject(name); 
			} catch(e) {}
		};
		var getNavigatorPlugin = function(name) {
			for(key in navigator.plugins) {
				var plugin = navigator.plugins[key];
				if(plugin.name == name) return plugin;
			}
		};
		var getPDFPlugin = function() {
			return this.plugin = this.plugin || function() {
				if(getBrowserName() == 'ie') {
					// load the activeX control
					// AcroPDF.PDF is used by version 7 and later
					// PDF.PdfCtrl is used by version 6 and earlier
					return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
				} else {
					return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getNavigatorPlugin('WebKit built-in PDF');
				}
			}();
		};
		var isAcrobatInstalled = function() {
			return !!getPDFPlugin();
		};
		var getAcrobatVersion = function() {
			try {
				var plugin = getPDFPlugin();
				if(getBrowserName() == 'ie') {
					var versions = plugin.GetVersions().split(',');
					var latest = versions[0].split('=');
					return parseFloat(latest[1]);
				}
				if(plugin.version) return parseInt(plugin.version);
					return plugin.name
				}
				catch(e) {
					return null;
				}
			}
			// The returned object
			return {
				browser: getBrowserName(),
				acrobat: isAcrobatInstalled() ? 'installed' : false,
				acrobatVersion: getAcrobatVersion()
			};
	};
	var info = getAcrobatInfo();
	//alert(info.browser+ " " + info.acrobat + " " + info.acrobatVersion);
	if(((info.browser == "ie") || (info.browser == "safari")) && (info.acrobat == false)){
		alert("Please install pdf reader to preview the content in "+info.browser);
	}
	else{
		try{
			openWindow=window.open(ContextPathPrint+'/ServerFileRetrievalServlet?serverFilePathSessionAttrName=DOC_FILEPATH&contentType=application/pdf&printPdfFlag=PRINT','','toolbar=0,location=0,left=100,top=100,width=800,height=800'); 
			openWindow.focus(); 
		}catch (e){
			alert("Either popup blocker is enabled or file cannot be downloaded for viewing at this moment."); 
		}
	}
}
function removeAccordionKey() {
	if (sessionStorage.getItem('accordion_Act') != "") {
		sessionStorage.removeItem('accordion_Act');
	}
}