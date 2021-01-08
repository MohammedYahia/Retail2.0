var MegaMenu = (function() {
	//if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
	var MqL = 800;
	var TriggerType = "click";

	var create = function( config ) {
		if (config.bp != "") {
			MqL = parseInt(config.bp)
		} 

		if ( config.trigger != "" ) {
			TriggerType = config.trigger;
		}



		//move nav element position according to window width
		moveNavigation();
		_attachTruncatedHandlers();

		$(window).on('resize', function(){
			(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
			_attachTruncatedHandlers();
		});

	}
	function initMega() {
		//prevent default clicking on direct children of .cd-primary-nav 
		$('.cd-primary-nav').children('.has-children').children('a').off("click").on('click', function(event){
			event.preventDefault();
		});

		var hoverOverTimer = null,
			hoverOffTimer  = null;

		if (TriggerType == "hover") {
			$('.cd-primary-nav>.has-children>a, .cd-secondary-nav').off("mouseenter focus").on("mouseenter focus", function (e) {
				var $that = $(this)

				clearTimeout ( hoverOffTimer );
				
				hoverOverTimer = setTimeout( function() {
					_show( $that )
				}, 250)
			})
			$('.cd-primary-nav>.has-children>a, .cd-secondary-nav').off("mouseleave").on("mouseleave", function (e) {
				if ($(e.toElement).is(".cd-secondary-nav") )
					return;

				clearTimeout ( hoverOverTimer );

				var trig = $(this)
				hoverOffTimer = setTimeout ( function() {
					//handle secondary nav, by finding a
					_hide(trig.is("a") ? trig : trig.prev())
				}, 250)
				
			})
		}
		
		if (TriggerType == "click") {
			//open submenu
			$('.cd-primary-nav>.has-children').children('a').off("click").on('click', function(event){
				_toggleMenu($(this))
			});
		}

		var $ul = $('.cd-secondary-nav')
		$ul.each(function(i,o) {
			$(o).find(">li").css("width", "calc(100% / " +  $(o).find(">li").length + ")")
		})


		//open submenu through clicking...
		$('.cd-secondary-nav>.has-children .has-children').children('a').off("click").on('click', function(event){
			_toggleMenu($(this))
		});

		//submenu items - go back link
		$('.go-back>a').off("click").on('click', function(){
			$(this).closest('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
		});
	}

	function _attachTruncatedHandlers() {
		$('.cd-primary-nav').find('.tc-truncated-item').on('mouseenter', function(){
	    	var $this = $(this);
	    	if(this.offsetWidth < this.scrollWidth && !$this.attr('title')){
	        	$this.attr('title', $this.text());
				if ( "TT_Module" in window)
	        		TT_Module.showToolTip($this, $this.text());
    		}
		}).on("mouseleave", function() {
			if ("TT_Module" in window)
				TT_Module.destroyToolTip( $(this) );
	        $(this).removeAttr('title');
		})
	}


	function _toggleMenu( $el ) {
		if( !checkWindowWidth() ) event.preventDefault();
		if ($el.closest(".tc-accordion-menu").length > 0) {
			return;
		}
		if( $el.next('ul').hasClass('is-hidden') ) {
			_show($el)
		} else {
			_hide($el)
		}
	}

	function _show( $el) {
		//desktop version only
		var $ul = $el.next('ul');
		var liWidth = $ul.find("li:first").outerWidth(true);
		var fontSize = parseFloat($("body").css("font-size"));

		//hide any open secondary menus...
		$el.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').css("left", "").end().children('a').removeClass('selected');


		$el.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
		if ($ul.is(".cd-secondary-nav")) {
			var left = $ul[0].getBoundingClientRect().left;
			var outerLeft = $ul.closest(".responsive-section")[0].getBoundingClientRect().left;
			if (outerLeft != left) {
				$ul.css("left", (outerLeft - left) + "px")
			}

			_addDummyPadding($ul)
		}

		$('.cd-overlay').addClass('is-visible');		
	}

	//check each column for icons...
	function _addDummyPadding( $secondaryNav ) {
		$secondaryNav.find(">li").each(function(i,o) {
			var anyIcons = $(o).find("a>span>span.tc-menu-icon").length > 0;
			if (anyIcons)  {
				$(o).find(".tc-truncated-item").css("padding-left", "")
				$(o).find("li>a").filter( function() {
					return $(this).find(">span>span").length < 1;
				}).addClass("icon-padding")
			} else {
				$(o).find(".tc-truncated-item").css("padding-left", "0")
			}
		})
		if ($secondaryNav.find("ul>.go-back:visible").length > 0) {
			$secondaryNav.find("ul>.go-back:visible").parent().find(">li").addClass("goback-padding")
		}
		
	}

	function _hide ($el) {
		$el.removeClass('selected')
			.next('ul').addClass('is-hidden').css("left", "")
			.end()
			.parent('.has-children').parent('ul').removeClass('moves-out');
		$('.cd-overlay').removeClass('is-visible');
	}


	function closeNav() {
		$('.cd-nav-trigger').removeClass('nav-is-visible');
		$('.cd-main-header').removeClass('nav-is-visible');
		$('.cd-primary-nav').removeClass('nav-is-visible');
		$('.has-children ul').addClass('is-hidden');
		$('.has-children a').removeClass('selected');
		$('.moves-out').removeClass('moves-out');
		$('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$('body').removeClass('overflow-hidden');
		});
	}


	function checkWindowWidth() {
		//check window width (scrollbar included)
		var e = window, 
            a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        if ( e[ a+'Width' ] >= MqL ) {
			return true;
		} else {
			return false;
		}
	}

	function moveNavigation(){
		var navigation = $('.mega-nav-menu');
  		var desktop = checkWindowWidth();

        if ( desktop ) {
			$(".tc-menu-trigger").hide();
			$(".tc-show-sidebar").removeClass("tc-show-sidebar")
			if (navigation.parent().is(".mega-root")) {
				initMega();
				return;
			}

			
			navigation.appendTo(".mega-root");
			navigation.find(".old-cd-primary-nav").toggleClass("cd-primary-nav old-cd-primary-nav").attr("id", "cd-primary-nav")
			navigation.find(".old-cd-secondary-nav").toggleClass("cd-secondary-nav old-cd-secondary-nav")
			navigation.find(".old-has-children").toggleClass("has-children old-has-children")
			navigation.find(".old-go-back").toggleClass("go-back old-go-back")
			navigation.find(".cd-secondary-nav, .is-hidden").css("display", "")
			navigation.attr("id", null)
			          .removeClass("tc-accordion-menu")
			initMega();
		} else {
			$(".tc-menu-trigger").show();
			navigation.find("ul, li").css("width", "")
			if (navigation.prev().is(".tc-profile-section"))
				return;

			navigation.insertAfter('.tc-profile-section');
			navigation.find(".cd-primary-nav").toggleClass("cd-primary-nav old-cd-primary-nav").attr("id", null)
			navigation.find(".cd-secondary-nav").toggleClass("cd-secondary-nav old-cd-secondary-nav")
											   .css({width: "",
											   	     minWidth: ""})
			navigation.find(".has-children").toggleClass("has-children old-has-children")
			navigation.find(".go-back").toggleClass("go-back old-go-back")
			navigation.attr("id", "cd-primary-nav")
			          .addClass("tc-accordion-menu")


			AccordionMenu.create({
				id:		"cd-primary-nav",
				restoreState:   "Y",
				multiExpanding: "N",
				dividersInd:    "N",
				greyout:	"N"
			});

		}
	}

	return {
		create: create
	}
})();
