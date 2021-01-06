var progressBar = (function() {
	var bar_id;

	function _getWrapper() {
		return $("#" + bar_id + "_wrapper");
	}

	function _moveMarker() {
        if ($(".tc-progressstep-current").length == 0) {
            return;
        }
        
    	var curr = $(".tc-progressstep-current").position().left + ($(".tc-progressstep-current").width() / 2) + 16;
		$(".tc-progressbar-marker-wrapper").animate( {
            left: curr
        }, 600, "easeInOutCubic", function() {

            //turn into %;
            var percValue = 100 * parseInt($(".tc-progressbar-marker-wrapper").css("left"), 10) / parseInt($(".tc-progressbar-marker-wrapper").parent().width(), 10);
            $(".tc-progressbar-marker-wrapper").css("left", percValue + "%");

            if ( !$(".tc-progressbar-wrapper").is(".xs")) {
            	$.cookie("progressBarLeftPos", percValue + "%");
            }
        });        	
    }

    function _markPBAsResponsive() {
    	var $wrapper = _getWrapper();
    	if ($(window).width() < 768 ) {
    		if (!$wrapper.is(".xs")) {
    			$wrapper.addClass("xs")
    			_redrawForXS(true);
    		}
    	} else {
    		if ($wrapper.is(".xs")) {
    			$wrapper.removeClass("xs")
    		}
   			_redrawForXS(false);
    	}
    }

    function _redrawForXS(isXS) {
        if ($(".tc-progressstep-current").length == 0) {
            return;
        }
        
		var newLeft = "";
		if (isXS) {
			var currentCenter = $(".tc-progressstep-current").position().left + $(".tc-progressstep-current").outerWidth() / 2;
			newLeft = $(".tc-progressbar").width() / 2 - currentCenter;
			newLeft = (100 * (newLeft)/ parseInt($(".tc-progressbar").width(), 10) )  + "%";
		} 
			$.cookie("progressBarTextPos", newLeft);
   		$(".tc-progressbar").animate({
   			left: newLeft 
   		}, 600, "easeInOutCubic");
    }

	function init(args) {
		bar_id = args.id;
        $(".tc-progressbar-marker-wrapper").css("left", $.cookie("progressBarLeftPos") );
        $(".tc-progressbar").css("left", $.cookie("progressBarTextPos") );
        $(".tc-progressstep").css("width", 100/($(".tc-progressstep:visible").length) + "%")
        _getWrapper().css("opacity", "1").removeClass("xs");

        setTimeout(function() {
        	redraw(false);
        }, 100)
	}

	function redraw(fullInd) {
		if (fullInd){
			$(".tc-progressstep").css("width", 100/($(".tc-progressstep:visible").length) + "%")
			_getWrapper().removeClass("xs")
		}

		_markPBAsResponsive();
        _moveMarker();
	}

	return {
		init: init,
		redraw: redraw
	}
})();