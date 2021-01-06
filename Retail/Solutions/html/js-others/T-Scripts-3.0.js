$.fn.reverse = [].reverse
$.expr.filters.offscreen = function(el) {
  var rect = el.getBoundingClientRect();
  return (
           (rect.left + rect.width) < 0 
             || (rect.top + rect.height) < 0
             || (rect.left > window.innerWidth || rect.top > window.innerHeight)
         );
};

$(window).load(function() {
  //$("#EDGE_CONNECT_PHASE").hide().css("opacity", "1").fadeIn(200, function() {
    // $('#EDGE_CONNECT_PHASE').find(':input').filter(':visible:first').focus();
    // $(".tc-footer-container").css("opacity", "1")
    // UtilModule.showFloatingActionButtons();
    // UtilModule.runCardAnimations();
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
    // window.scrollTo(0, 0);
  //});
});

function getScrollBarWidth () {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
};

function getIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");
  
  if (Idx > 0) {
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
  }

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./)) 
    return 11;
  else
    return 0; //It is not IE
}

$(function() {
  if (getScrollBarWidth() > 10) {
    $("html").addClass("scrollbars");
  }

  var ieVersion = getIEVersion();
  if (ieVersion > 0) {
    $("html").addClass("ie");
    $("html").addClass("ie" + ieVersion);
    var sAgent = window.navigator.userAgent;
    if (sAgent.indexOf("Phone") >= 0) {
       $("html").addClass("win-phone");
    }
  }

  var ua = navigator.userAgent;
  if (ua.match(/(iPad|iPhone|iPod)/g)) {
    $("html").addClass("ios");
    var version = ua.substring(ua.indexOf("OS") + 3, ua.indexOf("OS") + 4);
    $("html").addClass("ios" + version);
    $("input").attr("autocorrect", "off")
              .attr("autocapitalize", "off")
  }
  $('#EDGE_CONNECT_PHASE').find(':input').filter(':visible:first').focus();
  $(".tc-footer-container").css("opacity", "1")
  UtilModule.fixPopupClick();
  UtilModule.showFloatingActionButtons();
  UtilModule.runCardAnimations();
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  window.scrollTo(0, 0);

  try{
        //perfect scrollbar loaded as part of menu...
        if ($.perfectScrollbar) {
          $(".tc-popup").perfectScrollbar({
            suppressScrollX: true
          });          
        }

        $(window).on("resize", function() {
          if ($.perfectScrollbar) {
            $(".tc-popup").perfectScrollbar('update');
          }
        })
  }
  catch (e){
    console.log(e.message)
  }   
  

  $(document).on( "click", function(e) {
    //don't hide popups if event was triggered from with a popup dialog...
    try {
      var inDialog = $(e.originalEvent.srcElement).closest(".tc-ui-dialog").length > 0;
      if (inDialog || $("body>.ui-widget-overlay.ui-front").length > 0)
        return;
    } catch (e) {
      //don't worry...
    }

    if ($(".show-popup").length > 0) {
      $(".show-popup:not(.tc-popup-fixed, .tc-popup-sticky, #languageMultivalue)").css("transform", "")
      $(".show-popup:not(.tc-popup-fixed, .tc-popup-sticky, #languageMultivalue), .tc-header-icon-on, .tc-icon-on")
          .removeClass("show-popup tc-header-icon-on tc-icon-on")
      
    }

   $('#helpContent').hide();

    //remove menu in box on mode
    if (!$("html").is(".tc-sidebar-anim") && $(e.target).closest(".tc-nav-col").length == 0 && $("html").is(".tc-box-on")){
        $("html").removeClass("tc-show-sidebar")
        $(".tc-menu-trigger").removeClass("tc-header-icon-on")
    }
  })

  try
  {
    var supportsTouch = 'ontouchstart' in window || (navigator.msMaxTouchPoints > 0);
    if (supportsTouch){
      $("html").addClass("tc-touch-device");
      $(document).swipe( {
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
          if (fingerData[0].start.x < 40 ) {
            $("html").addClass("tc-show-sidebar tc-sidebar-anim");
            LockHeader.checkForLockHeaders(); 
            setTimeout(function() { $("html").removeClass("tc-sidebar-anim"); }, 200)
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
          }
        },
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
          $("html").removeClass("tc-show-sidebar");
          LockHeader.checkForLockHeaders(); 
          setTimeout(function() { $("html").removeClass("tc-sidebar-anim"); }, 200)
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          return false;
        },
      });  
     }
  }
  catch (e)
  {
  }


  UtilModule.makeTableRowsClickable();
  UtilModule.fixSingleCheckBoxes();
  UtilModule.fixAccessibility();
  UtilModule.fixFooter();
  UtilModule.hideSinglePageTableMessages();
  UtilModule.wrapTablesOverflow();
  UtilModule.attachRippleEffect();
  UtilModule.attachKeyboardNavDetector();
  TabModule.setup();
  LockHeader.setup();

  SortableModule.makeSortable();
});

var SortableModule = (function() {
    function makeSortable() {
        //add a drag handle
        $(".tc-sortable-container .tc-detail-section").each(function(i,o) {
          $(o).append("<div class='tc-drag-handle tc-normal-icon icon-drag tc-rounded-1'><span></span></div>");
        })
        if (jQuery.ui) {
          $(".tc-sortable-container").sortable({
            items: ".tc-detail-section",
            handle: ".tc-drag-handle",
            revert: true,
            placeholder: "ui-state-highlight tc-rounded-1 tc-confirmation-alt-bg-color",
            forcePlaceholderSize: true,
            helper: function(event, ui){
                var $clone =  $(ui).clone();
                $clone .css('position','absolute');
                return $clone.get(0);
            },      
            start: function(e, ui){
                UtilModule.triggerRippleEffect(e, ui.item )
                ui.placeholder.height(ui.item.height());
                ui.placeholder.css("margin-bottom", ui.item.css("margin-bottom"));
            },
            update: function(e, ui){
              var $this = $(this)
              SortableModule.saveState($this)
            }

          });
          _restoreState();
        }
    }

    function saveState($this) {
        var thisID = $this.attr('id'),
            $items = $this.find('.tc-detail-section'),
            itemsOrder = [];

        // create array of elements that are moved and their order
        $items.each(function(){
          itemsOrder.push($(this).attr('id'));
        });
        // create string from itemsOrder array
        var itemsOrderStr = itemsOrder.toString();
        // create or update the cookie name = id of container, value = string of elements that are rearranged 
        CookieModule.newCookie(thisID,itemsOrderStr,365);
    }

    function _restoreState() {
        // get the container of sortable elements 
        var $containers = $('.tc-sortable-container');
        $containers.each(function(){
          var $this = $(this),
              cookieName = $this.attr('id');

          if(CookieModule.readCookie(cookieName) != '') { // check if there is a cookie with custom order

            var elOrder = CookieModule.readCookie(cookieName).split(",");
            var parent = elOrder.length != null && elOrder.length > 0 ? $("#" + elOrder[0]).parent() : $("#" + elOrder).parent();
            for(i=0; i<elOrder.length; i++) {
              $('#' + elOrder[i]).appendTo(parent); // arrange cards based on cookie
            }
          }
        });


        //$('.ext-sortable-element').show(); // show the cards after re-arrangement
    }

    return {
      makeSortable: makeSortable,
      saveState: saveState
    }

})()
var CookieModule = (function() {
    function newCookie(name,value,days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString(); 
      } 
      document.cookie = name+"="+value+expires+"; path=/"; 
    }

    function readCookie(name) {
      var cookieName = name + "=";
      var nuller = '';
      if (document.cookie.indexOf(cookieName) == -1)
        return nuller;

      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') 
          c = c.substring(1,c.length);
        
        if (c.indexOf(cookieName) == 0) 
          return c.substring(cookieName.length,c.length); 
      }
      return null; 
    }

    function eraseCookie(name) {
      //Erasing a cookie is simple. You just need to set its expiry date in the past.
      newCookie(name,"",-1);
    }

    return {
      newCookie: newCookie,
      readCookie: readCookie,
      eraseCookie: eraseCookie
    }

})()


var UtilModule = ( function() {

  function scrollIt(destination, duration, easing, callback) {
    if (duration == null) 
      duration = 300;
    if (easing == null) 
      easing = "linear"


    var easings = {
      linear: function(t) {
        return t;
      },
      easeInQuad: function(t) {
        return t * t;
      },
      easeOutQuad: function(t) {
        return t * (2 - t);
      },
      easeInOutQuad: function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic: function(t) {
        return t * t * t;
      },
      easeOutCubic: function(t) {
        return (--t) * t * t + 1;
      },
      easeInOutCubic: function(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart: function(t) {
        return t * t * t * t;
      },
      easeOutQuart: function(t) {
        return 1 - (--t) * t * t * t;
      },
      easeInOutQuart: function(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      },
      easeInQuint: function(t) {
        return t * t * t * t * t;
      },
      easeOutQuint: function(t) {
        return 1 + (--t) * t * t * t * t;
      },
      easeInOutQuint: function(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      }
    };

    var start = window.pageYOffset;
    var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }

    function scroll() {
      var now = 'now' in window.performance ? performance.now() : new Date().getTime();
      var time = Math.min(1, ((now - startTime) / duration));
      var timeFunction = easings[easing](time);
      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

      if (timeFunction == 1 || window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }

      requestAnimationFrame(scroll);
    }

    scroll();
  }

  function fixFooter() {
    if (typeof inAnim !== 'undefined' && inAnim)
      return;

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
  function hideSinglePageTableMessages() {
    $(".tc-table-nav-row").each(function(i,o) {
        if ($(o).children().length == 0) {
            $(o).hide();
        }
        // add class to first and last (before we wrap page x of x in span)
        $(o).children().first().addClass("tc-nav-item-first");
        $(o).children().last().addClass("tc-nav-item-last");

        //wrap page message in span to set font size...
        $(o).contents().first().wrap("<span class='tc-fs'>");

    });
  }

  function attachKeyboardNavDetector() {
    $(document).on("keydown", function (event) {
      if (event.keyCode  == 9 /*TAB*/)
        $("html").addClass("tc-key-nav");
    })
    $(document).on("mousedown", function (event) {
      $("html").removeClass("tc-key-nav");
    })
  }  

  function attachRippleEffect() {
    $(".tc-ripple-effect:not([data-ripple-effect-handler-added='Y'])")
        .attr('data-ripple-effect-handler-added', 'Y')
        .on("click", function(e) {
            UtilModule.triggerRippleEffect(e, $(this) )
        });
  }
  function triggerRippleEffect( event, $element ) {
    var $inkWrapper = $("body").find(".tc-ink-wrapper");

    if($inkWrapper.length == 0) {
      $inkWrapper = __addRippleInk($element);
    }

    $inkWrapper.css({
      width   : $element.outerWidth(),
      height  : $element.outerHeight(),
      top     : $element.position().top  + parseInt($element.css('marginTop'), 10),
      left    : $element.position().left + parseInt($element.css('marginLeft'), 10)
    }).appendTo($element.offsetParent());
    if ($element.is(".tc-card-header-icon, .tc-table-nav-item")) {
      $inkWrapper.css("border-radius", "50%")
    }
    if ($element.is(".tc-compact .tc-table-nav-item")) {
    $inkWrapper.css("border-radius", "0")
    }


    var $ink = $inkWrapper.find(".tc-ink");
    var d = Math.max($element.outerWidth(), $element.outerHeight());
  if (d > 100) d = 100;
  //event.clientX - $element.offset().left
    $ink.css({
      width   : d,
      height  : d,
      top     : event.pageY - $element.offset().top  - (d / 2),//event.offsetY - (d / 2),
      left    : event.pageX - $element.offset().left  - (d / 2)//event.offsetX - (d / 2)
    })

    $ink.addClass("animate");
    setTimeout(function() {
      $inkWrapper.remove();
    }, 500);
  };

  function __addRippleInk($element) {
    $("body").prepend("<div class='tc-ink-wrapper' ><span class='tc-ink'></span></div>");
    return $("body").children(".tc-ink-wrapper");
  };

  function fixSingleCheckboxes() {
    $("input[type=checkbox]:only-child").each(function(i,o) {
      var $label = $("<label><span style='color: transparent; position: absolute'>label</span></label>");

      $(o).after($label);

      $label.on("click", function(e) {
        $("#" + o.id).click();
      })
    });

    
  };

  function fixAccessibility() {
    //popuplate empty table headers...
    $("th").each(function(i,o) {
      if (!$(this).text().trim().length) {
        $(this).append("<span style='display: none'>th</span>");
      }
    });
    //popuplate empty anchors... 
    $("a[id*=ANCHOR]").each(function(i,o) {
      if (!$(this).text().trim().length) {
        $(this).append("<span style='display: none'>anchor</span>");
      }
    });
    //add selector label
    $("input[id*='_Selector_']").each(function(i,o) {
      var baseId = $(this).attr("id");
      //check if there is already a label...
      if ($("label[for='" + baseId + "']").length > 0)
        return;

      $(this).wrap("<label>select</label>")
    });

    //div CAN a label
    $("[name*='CONNECT_ACTIVE_TAB']").each(function(i,o) {
      if ($(this).parent().is("label"))
        return;
      $(this).wrap("<label style='display: none'>active tab</label>")
    })

    //div table inputs a label
    $("table input, table select").each(function(i,o) {
      var baseId = $(this).attr("id");
      if (baseId != null) {
        var rowPart = getRowPart(baseId);
        var partId = baseId.substring(0, baseId.indexOf("_R" + rowPart))
        $(this).attr("aria-labelledby", "p1_" + partId)        
      }
    })

    //make empty labels into spans...
    $("label:empty").each(function(i,o) {
      $label = $(o)
      if ($label.parent().is(".tc-checkbox, .tc-radio"))
        return;
      $(this).replaceWith("<span id='" + $label.attr("id") + "'></span>")
    })
  }

  function launchIntoFullscreen() {
    element = document.documentElement;

    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if(document.msExitFullscreen) {
      document.msExitFullscreen();
    }

  };
  
  function updateScreenStateCookie() {
    setTimeout( function() {
      var $html = $("html");
      var fontSize = $html.is(".tc-small") ? "tc-small" :
                     $html.is(".tc-med") ? "tc-med" :
                     $html.is(".tc-big") ? "tc-big" : 
                     $html.is(".tc-xl")  ? "tc-xl"  : "tc-small";

      var compactMode  = $html.is(".tc-compact")       ? "tc-compact" : "";
      var lockHeader   = $html.is(".tc-header-locked") ? "tc-header-locked" : "";
      var boxView      = $html.is(".tc-box-on")        ? "tc-box-on" : "tc-box-off";
      var lockFooter   = $html.is(".tc-footer-locked") ? "tc-footer-locked" : "";
      var showSideBar  = $html.is(".tc-show-sidebar")  ? "tc-show-sidebar" : "";
      var highContrast = $html.is(".tc-high-contrast") ? "tc-high-contrast" : "";

      $.cookie("fontSize",     fontSize,     { expires: 32 });
      $.cookie("compactMode",  compactMode,  { expires: 32 });
      $.cookie("lockHeader",   lockHeader,   { expires: 32 });
      $.cookie("lockFooter",   lockFooter,   { expires: 32 });
      $.cookie("boxView",      boxView,      { expires: 32 });
      $.cookie("showSideBar",  showSideBar,  { expires: 32 });
      $.cookie("highContrast", highContrast, { expires: 32 });
      $(window).resize();
      setTimeout(function() {
        fixFooter();
      }, 100)
    }, 10);
  };

  function fixInlineDivs(ns, elem, naType) {
      if (elem.nodeName == "DIV" && elem.style.display == "inline") {
          elem.style.display = "inline-block";
      }
      if (elem.parentNode.nodeName == "DIV" && elem.parentNode.style.display == "inline" ) {
        elem.parentNode.style.display = "inline-block";
      }
  };

  function wrapTablesOverflow() {
    $(".tc-table").parent().addClass("tc-table-wrapper");
  }

  function showFloatingActionButtons() {
    $(".tc-floating-create-button").css("transform", "scale(1)");
  }
  
  function fixPopupClick() {
    $(".tc-popup").on("click", function(e) {
      e.stopPropagation();
    })
  }

  function makeTableRowsClickable() {
    $(".tc-table>tfoot>tr, .tc-table>tbody>tr").on("click", function(e) {
      //ignore these events...
      if (  !($(e.target).is('.tc-no-prop')
            || $(e.target).closest('.tc-no-prop, .tc-icon[onclick]').length
            || e.target.nodeName == 'INPUT' 
            || e.target.nodeName == 'LABEL' 
            || e.target.nodeName == 'TEXTAREA'
            || e.target.nodeName == 'SELECT')) {
        //find button...
        var visDefaultButton = $(this).find(".tc-default-table-action:visible");
        var allDefaultButtons = $(this).find(".tc-default-table-action");

        if (visDefaultButton.length == 1) {
          visDefaultButton.click();
        }
        else if (allDefaultButtons.length == 1) {
          allDefaultButtons.click();
        }

        //click first visible if more than one...
        else if (visDefaultButton.length > 1)  {
          visDefaultButton.first().click();
        }
        else if (allDefaultButtons.length > 1)  {
          allDefaultButtons.first().click();
        }

        if (visDefaultButton.length > 0 || allDefaultButtons.length > 0) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        return true;
      }
    })
  }
  
  function runCardAnimations() {  
    $(".tc-tile-animated").not(".animated").not(":offscreen").each(function( index, obj ) {
      index++;
      var $this = $( this );
      setTimeout(function (){
         $this.css({
           opacity: "1",
           transform: ""
         }).addClass("animated");
      }, index * 100);    
    });
    $(".tc-card-animated").not(".animated").not(":offscreen").each(function( index, obj ) {
      index++;
      var $this = $( this );
      setTimeout(function (){
         $this.css({
           opacity: "1",
           transform: ""
         }).addClass("animated");;
      }, index * 100);
    });   
  }

  return {
    fixFooter:                    fixFooter,
    fixPopupClick:                fixPopupClick,
    hideSinglePageTableMessages:  hideSinglePageTableMessages,
    attachRippleEffect:           attachRippleEffect,
    triggerRippleEffect:          triggerRippleEffect,
    fixSingleCheckBoxes:          fixSingleCheckboxes,
    fixAccessibility:             fixAccessibility,
    launchIntoFullscreen:         launchIntoFullscreen,
    exitFullscreen:               exitFullscreen,
    updateScreenStateCookie:      updateScreenStateCookie,
    fixInlineDivs:                fixInlineDivs,
    wrapTablesOverflow:           wrapTablesOverflow,
    showFloatingActionButtons:    showFloatingActionButtons,
    attachKeyboardNavDetector:    attachKeyboardNavDetector,
    runCardAnimations:            runCardAnimations,
    makeTableRowsClickable:       makeTableRowsClickable,
    scrollIt:                     scrollIt
  };

})();

Hi.addHook('postProcessResponses', UtilModule.fixFooter);
Hi.addHook('postProcessResponses', UtilModule.fixPopupClick);
Hi.addHook('postProcessResponses', function() { $("#EDGE_CONNECT_PHASE").css("opacity", "1")} );
Hi.addHook('postProcessResponses', UtilModule.fixSingleCheckBoxes);
Hi.addHook('postProcessResponses', UtilModule.fixAccessibility);
Hi.addHook('postProcessResponses', UtilModule.runCardAnimations);
Hi.addHook('postProcessResponse',  UtilModule.wrapTablesOverflow);
Hi.addHook('postProcessResponse',  UtilModule.hideSinglePageTableMessages);
Hi.addHook('postProcessResponse',  UtilModule.attachRippleEffect);
Hi.addHook('postProcessResponse',  UtilModule.makeTableRowsClickable);
Hi.addHook('postProcessResponse',  SortableModule.makeSortable)

Hi.addHook('afterElemShown',       UtilModule.fixInlineDivs);
Hi.addHook('afterChangeTab',       UtilModule.fixFooter);


var TabModule = ( function() {
  function setup() {
    __attachClickHandlerToTabHeaders();
    __attachHoverHandlerToTabHeaders();
    __triggerUnsetTabGroups();
    setTimeout( function() {      
      __setupScrollingTabs()
    }, 500);
    
    $(window).on("resize", __checkForScrollingTabs); 
  };

  function __attachClickHandlerToTabHeaders() {
    $(".tc-tab-header:not([handler-added=true])").each(function(i,o) {
        $(o).attr("handler-added", "true")
            .on("click.TabModule", function(event) {
              //give time for standard code to run...
              var $that = $(this);
              setTimeout(function() {
                    UtilModule.triggerRippleEffect( event,  $that );
                    if ($that.is(".tc-tabs-vertical")) {
                      return;                    
                    }
                    __updateCurrentTabBar(event, $that.closest(".tc-tab-header-wrapper"))
                    __autoScrollTab( event, $that );                
              }, 100)
        });
    })
  };

  // show tooltip if text is truncated by ellipsis
  function __attachHoverHandlerToTabHeaders() {
  $(".tc-tab-header:not([hover-handler-added=true])").each(function(i,o) {
    $(o).attr("hover-handler-added", "true")
      .on("mouseenter.TabModule", function(event) {
        var $this = $(this);
        if(this.offsetWidth < this.scrollWidth && !this.hasAttribute('title')){
          $this.attr('title', $this.text());
          if ( "TT_Module" in window)
            TT_Module.showToolTip($this, $this.text());
          }
      })
      .on("mouseleave.TabModule", function(event) {
        if ("TT_Module" in window)
          TT_Module.destroyToolTip( $(this) );
        $(this).removeAttr('title');
      })
  })
  }


  function __autoScrollTab( event, $tabHeader ) {
    var $header_wrapper = $tabHeader.closest(".tc-tab-header-wrapper");
    var wrapperOffset  = $header_wrapper.position().left;
    var $tabSection     = $header_wrapper.closest(".tc-tab-section");
    var headerOffset    = $tabHeader.position().left;
    var headerWidth     = $tabHeader.outerWidth();

    if ((headerOffset + headerWidth + wrapperOffset) > $tabSection.width() ) {
      $tabSection.find(">.tc-scroll-tab-icon.icon-chevron-right").click();
    }
  };

  function __checkForScrollingTabs() {
    $(".tc-tab-section").each(function(i,o){
        var $tabSection = $(o);
        if ($tabSection.find(".tc-tab-header").length == 0)
          return;

        var $header_wrapper= $($tabSection.find(".tc-tab-header")[0].parentNode);
        var $tabL = $tabSection.find(">.tc-scroll-tab-icon.icon-chevron-left"),
            $tabR = $tabSection.find(">.tc-scroll-tab-icon.icon-chevron-right");
        
        __updateTabNavState($header_wrapper, $tabL, $tabR);
    });
  };

  function __setupScrollingTabs() {
  $(".tc-tabs-vertical").parent().addClass("tc-tab-header-wrapper")
  
    $(".tc-tab-section").each(function(i,o){
      var $tabSection = $(this);
      $(".tc-tab-header-selected").addClass("tc-tab-header-highlighted");

      var $header_wrapper = __configureHeaderWrapper($tabSection);
      if (!$header_wrapper || $header_wrapper.length == 0) 
        return;


      var $tabL = $tabSection.find(">.tc-scroll-tab-icon.icon-chevron-left"),
          $tabR = $tabSection.find(">.tc-scroll-tab-icon.icon-chevron-right");

      //create left and right buttons if necessary...
      if ($tabSection.find(">.tc-scroll-tab-icon").length == 0) {
        $tabL = $("<a class='tc-scroll-tab-icon tc-table-icon icon-chevron-left' style='display: none'><span></span></a>").appendTo($tabSection);
        $tabR = $("<a class='tc-scroll-tab-icon tc-table-icon icon-chevron-right' style='display: none'><span></span></a>").appendTo($tabSection);


        // Click handler for left/right tab buttons...
        $tabSection.find(".icon-chevron-left, .icon-chevron-right").on("click", function(e) {
          if ($(e.currentTarget).is(".tc-link-disabled")) {
            e.preventDefault();
            return false;
          }
          __moveTab($header_wrapper, e);
          __updateTabNavState($header_wrapper, $tabL, $tabR);
            
          e.preventDefault();
          e.stopPropagation();
          return false;

        })
        __attachSwipeDetectToHeaderWrapper($header_wrapper);
      }

      //__updateCurrentTabBar(null, $header_wrapper)
      __updateTabNavState($header_wrapper, $tabL, $tabR);
    })
  };

  function __configureHeaderWrapper($tabSection) {
    if ($tabSection.find(".tc-tab-header").length == 0)
      return;

    var $header_wrapper = $($tabSection.find(".tc-tab-header")[0].parentNode);
    if (!$header_wrapper.is(".tc-tab-header-wrapper")) {
      $header_wrapper
        .addClass("tc-tab-header-wrapper")
        .data("count", 0)
        .data("offset", 0)
        .after("<div class='tc-current-tab-bar' style='width:0px; display: none'></div>")
        .parent().css({"overflow": "hidden",
                      "position": "relative",
                      "width": "100%"})
    }
    var bar = $tabSection.parent().find(".tc-current-tab-bar");
    var currentTabHeader = $tabSection.find(".tc-tab-header-selected").eq(0);
    //if there isn't a current one, default to first...
    if (currentTabHeader.length == 0) {
      currentTabHeader = $tabSection.find(".tc-tab-header").eq(0)
                          .addClass("tc-tab-header-selected tc-tab-header-highlighted");
    }
    bar.css("left", currentTabHeader.position().left);
    bar.css("right", ( $header_wrapper.parent().outerWidth() - (currentTabHeader.position().left + currentTabHeader.outerWidth() ) ) )
    return $header_wrapper;
  }


  function __attachSwipeDetectToHeaderWrapper($header_wrapper)  {
    //$header_wrapper.draggable({
    //  axis: "x"
    //})
    $header_wrapper.swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
            if (direction =='right') 
                $(this).closest(".tc-tab-section").find(">.icon-chevron-left:visible").click();
            else if (direction =='left')
                $(this).closest(".tc-tab-section").find(">.icon-chevron-right:visible").click();
        event.stopPropagation();
        }
    });
  };

  function __moveTab($header_wrapper, event) {
    var isLeft = $(event.currentTarget).is(".icon-chevron-left");
    var count = isLeft ? $header_wrapper.data("count") - 1 : $header_wrapper.data("count");
    var currentOffset = parseInt($header_wrapper.data("offset") | 0, 10);
    var moveAmount = $header_wrapper.find(".tc-tab-header:eq("+ count+")").outerWidth();
    var newOffset = isLeft ? (currentOffset + moveAmount) : (currentOffset-moveAmount);

    $header_wrapper.add($header_wrapper.next()).css("transform", "translate3d("+ newOffset+"px, 0, 0)");
    $header_wrapper.data("count", isLeft ? count : ++count).data("offset", newOffset);

    //move the ripple box ...
  };

  function __updateTabNavState($header_wrapper, $left, $right) {
    var $tabSection = $header_wrapper.closest(".tc-tab-section")
    var currentOffset = $header_wrapper.data("offset");
    var $headers = $header_wrapper.find(".tc-tab-header");
    var count = $header_wrapper.data("count");

    var headerWidth = 0;
    $headers.each(function(headerIndex,headerObject) {
      headerWidth += $(headerObject).outerWidth();
    })
    $header_wrapper.data("header-width", headerWidth);

    if (headerWidth > $tabSection.width() || parseInt($header_wrapper.css("left"), 10) < 0) {
      $left.show(); 
      $right.show();
      
      count == 0 ? $left.addClass("tc-link-disabled").css("opacity", "1").find("span").css("opacity", "0.3") : 
                   $left.removeClass("tc-link-disabled").css("opacity", "1").find("span").css("opacity", "1")
      currentOffset + headerWidth < $tabSection.width() ? 
                  $right.addClass("tc-link-disabled").css("opacity", "1").find("span").css("opacity", "0.3") : 
                  $right.removeClass("tc-link-disabled").css("opacity", "1").find("span").css("opacity", "1");
    } else {
      $left.hide();
      $right.hide();
      $header_wrapper.css("transform", "translate3d(0, 0, 0)");
    }
  };

  function __updateCurrentTabBar(event, $header_wrapper) {
      //dont' do for nested tabs...
      if ($header_wrapper.closest(".tc-tab-pane").length == 1 ||
        $header_wrapper.length == 0   )
        return;

      var wrapperOffset = $header_wrapper.data("offset");
      var wrapperWidth  = $header_wrapper.parent().outerWidth();
      if ($header_wrapper.find(".tc-tab-header-selected").length == 0) {
        $header_wrapper.find(".tc-tab-header").eq(0).addClass("tc-tab-header-selected tc-tab-header-highlighted")
      }

      $header_wrapper.find(".tc-tab-header-highlighted").removeClass("tc-tab-header-highlighted");
      var headerOffset  = $header_wrapper.find(".tc-tab-header-selected").position().left;
      var headerWidth   = $header_wrapper.find(".tc-tab-header-selected").outerWidth();
      var classToAdd    = "";
      var currentTab    = $header_wrapper.data("current-tab") | 0;
      
      if (event) {
        var nextTab = $(event.currentTarget).index()
        classToAdd  = nextTab > currentTab ? "tc-move-right" : "tc-move-left";
        $header_wrapper.data("current-tab", nextTab);
      }

      var bar = $header_wrapper.parent().find(".tc-current-tab-bar")
          bar.show();
          bar.removeClass("tc-move-right tc-move-left")
          //remove width, but restore right...
          var currentHeader = $header_wrapper.find(".tc-tab-header").eq(currentTab);
          var currentRight = (wrapperWidth - (currentHeader.position().left + currentHeader.outerWidth()))
          bar.css("right", currentRight + "px" )
          bar.css("width", "");

          bar.addClass(classToAdd)
          bar.css({"left":  (headerOffset) + "px",
                   "right": (wrapperWidth - (headerOffset + headerWidth)) + "px"
          })
      
      //set the width after animation finishes so bar doesn't resize when window resized.  
      //should use promises?
      //hide the current tab marker, and just use a border once the animation has finished....
      setTimeout(function() {
        $header_wrapper.find(".tc-tab-header-selected").addClass("tc-tab-header-highlighted");

        $header_wrapper.parent()
           .find(".tc-current-tab-bar")
           .css("width", headerWidth + "px")
           .hide();
        
          
      }, 300)
  }
  //search for any tab groups which haven't be triggered.  Show first tab
  function __triggerUnsetTabGroups() {
    $(".tc-tab-header").parent().reverse().each(function(i,o) {
      if ($(o).find(">.tc-tab-header-selected").length == 0) {
        //$(o).find(">.tc-tab-header").first().click();
        $(o).find(">.tc-tab-header").first().addClass("tc-tab-header-selected")
        var id = $(o).find(">.tc-tab-header").first().attr("id")
        $("#Pane" + id).css("display", "block")
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    })
  }




  return {
    setup: setup,
  };
})();

Hi.addHook('postProcessResponses', TabModule.setup)

$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

var LockHeader = (function() {
  var supportsSticky = false;

    function setup() {
        $(window).on("scrollstart", function() { $("body").css("pointer-events", "none") }   )
        $(window).on("scroll", checkForLockHeaders);
        $(window).scrollEnd(function() { 
                                    $("body").css("pointer-events", "");
                                    if ($(window).scrollTop() == 0) {
                                        $(".tc-nav-col").css({"height": ""});
                                    }
                                    setTimeout(function(){
                                        $(".tc-nav-col").css({"transition": ""});
                                    }, 100)                                
                                }, 200)
        
        $(window).on("resize", function() {
            UtilModule.fixFooter();
            setTimeout(function() {
              $(".tc-nav-col").css("height","");
            }, 200);
        });

    supportsSticky = !!featureTest('position', 'sticky');
    }

    function featureTest( property, value, noPrefixes ) {
      // Thanks Modernizr!
      var prop = property + ':',
        el = document.createElement( 'test' ),
        mStyle = el.style;

      if( !noPrefixes ) {
        mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
      } else {
        mStyle.cssText = prop + value;
      }    
      return mStyle[ property ];
    }

    function checkForLockHeaders() {
      UtilModule.fixFooter();
      UtilModule.runCardAnimations();

      var scrollTop=$(window).scrollTop();
      var lockTopPos = 0;
      var headerLocked = $("html").is(".tc-header-locked");
      var headerHeight = $(".tc-header").height();


      //also lock the nav-col...
      var $nav = $(".tc-show-sidebar .tc-nav-col");
      if ($nav.length == 1){
        if (headerLocked || ($nav.length > 0 && $nav.position().top == 0) || scrollTop == 0) {
          $nav.css({
            //rely on default from class
            "height": headerLocked ? "" : (window.innerHeight) + "px",
            "top": "",
            "margin-top": ""    
          })
        } else {
          var moveAmount = Math.max(1, headerHeight - scrollTop)
          $nav.css({
            //move up, but stop at 0.
            "top":  moveAmount + "px",  
            "height": (window.innerHeight - moveAmount) + "px",
            "margin-top": "-1px"     
          })
        }
      }


      if (headerLocked) 
        lockTopPos = headerHeight;
      
      if ($("html").is(".tc-subheader-locked"))
        lockTopPos += $(".tc-subheader").height();

      //scroll the search bar if visible...
      if (!headerLocked && $(".tc-header").length > 0) {
        $(".tc-popup-fixed.show-popup").css("top", 
        $(".tc-header").offset().top + $(".tc-header").height() - scrollTop
        )
      }
    

      //now find any more and see if they are at the end of the stack of locked elements...
      $(".tc-lock-at-top").each( function(i,o) {
        var lockTop = $(o).offset().top - lockTopPos;
        var lockTop2 = $(o).data("lock-scroll-pos");
        if ($(o).is(".tc-lock-card-header")) lockTop -= scrollTop;

        if (lockTop2 &&scrollTop < lockTop2){
          $(o).removeClass("tc-lock-card-header")
              .css({
                "top": "",
                "position": ""
              })
              .parent().find(".tc-card-body")
                .css("padding-top", "");
           $(o).data("lock-scroll-pos", null);
        }
        else if (scrollTop > lockTop  && !$(o).is(".tc-lock-card-header") ) {
          $(o).addClass("tc-lock-card-header")
              .css({
                "top": lockTopPos + "px",     
        //"position": supportsSticky ? "sticky" : ""
              })
              .parent()
              .find(".tc-card-body")
                .css("padding-top", $(o).outerHeight(true)  + "px");
           $(o).data("lock-scroll-pos", scrollTop);
        }
      })



    };
    return  {
        setup: setup,
        checkForLockHeaders: checkForLockHeaders
    }
})();


//override connect default...
function createFloatingDiv(divId, parent)
{
  var floatDiv = document.createElement("div");
  floatDiv.setAttribute("id", divId);
  floatDiv.setAttribute("style", "z-index: 1000");
  parent.appendChild(floatDiv);

  return floatDiv;
}