var AccordionMenu = (function() {
	var settings;

	function _getCurrentMenu() {
		return $("#" + settings.id + ".tc-accordion-menu");
	}

	function _addDividers() {
		if (settings.dividersInd == "Y") {
			//add dividing lines...
			_getCurrentMenu().each(function(i,o) {
				$(o).find(">ul>li:not(:first-child)>a").append("<div class='tc-menu-divider'></div>");
			})
		}
	}

	function _addGreyoutMask() {
		if (settings.greyout == "Y") {
			if ($(".tc-accordion-menu-mask").length == 0) {
				$("body").append("<div class='tc-accordion-menu-mask'></div>");
			}
		}
	}

	function _restoreState() {
		if (settings.restoreState == "Y"){
			//expand to current menu item
			_getCurrentMenu().find(".activeMenuItem").parents("li").each( function(i,o) {
				if (i == 0) $(o).addClass("tc-current-active");
				$(o).addClass("active");
			})
		}
	}

	function _indentSubMenusWhereParentHasIcon() {
		_getCurrentMenu().find(".tc-menu-icon").each(function(i,o) {
			if (i == 0) {
				$(o).closest(".tc-accordion-menu")
					.find("a")
					.filter(function(ii,oo) {
						var icon = $(oo).find("span>span.tc-menu-icon")
						return icon.length == 0 ? true : false;
					})
					.addClass("tc-menu-item-indent")
			}
		})

	}

	function _attachTruncatedHandlers() {
		_getCurrentMenu().find('.tc-truncated-item').on('mouseenter', function(event){
	    	var $this = $(this);
	    	if(this.offsetWidth < this.scrollWidth && !$this.attr('title')){
	        	$this.attr('title', $this.text());
				if ( "TT_Module" in window) {
					$this.attr("tooltip", $this.contents().not($this.children()).text())
	        		TT_Module.showToolTip($this, event);
				}
    		}
		}).on("mouseleave", function() {
			if ("TT_Module" in window)
				TT_Module.destroyToolTip( $(this) );
	        $(this).removeAttr('title');
		})
	}

	

	function _attachClickHandler() {
		_getCurrentMenu().find("a").off("click").on("click", function(event){
			//remove keyboard mode flag
			//$("html").removeClass("tc-key-nav");
				
			if ($(this).is(".edgeConnectDisabled")) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			}

			$(".tc-accordion-menu .tc-current-active").removeClass("tc-current-active");
			var link = $(this);
			link.parent().addClass("tc-current-active");
			var closest_ul = link.closest("ul");
			var parallel_active_links = closest_ul.find(".active")
			var closest_li = link.closest("li");

			if (window.UtilModule) {
				link.css("overflow", "hidden")
				UtilModule.triggerRippleEffect(event, link);
			}

			var link_status = closest_li.hasClass("active");
			var count = 0;

			if (settings.multiExpanding != "Y") {
				event.preventDefault();
				event.stopPropagation();					
				closest_ul.find(".active>ul").slideUp(400, function(){
					parallel_active_links.removeClass("active tc-current-active");
				});				
			} else {
				if (link_status) {
					event.preventDefault();
					event.stopPropagation();					
					closest_li.find("ul").slideUp(400, function(){
					})
					closest_li.removeClass("active tc-current-active")
				}
			}

			if(!link_status){
				event.preventDefault();
				event.stopPropagation();
				closest_li.children("ul").slideDown(400, function() {
				});
				closest_li.addClass("active");
			}
			
			setTimeout(function() {
				$(window).trigger('resize');
			}, 450);
		})		
	}

	function create(params) {
		settings = params;

		_getCurrentMenu().find("a").each(function(i,o) {
			if ($(o).children().eq(0).is(".tc-truncated-item"))
				return;


			var $contents = $(o).contents();
			$(o).append("<span class='tc-truncated-item' ></span>")
			$contents.appendTo( $(this).find(".tc-truncated-item") )
		});

		_getCurrentMenu().parent().parent().addClass("tc-menu")
		_restoreState();
		_addDividers();
		_addGreyoutMask();
		_indentSubMenusWhereParentHasIcon();
		_attachTruncatedHandlers();
		_attachClickHandler();
		
	}

	return {
		create: create
	}
})();
