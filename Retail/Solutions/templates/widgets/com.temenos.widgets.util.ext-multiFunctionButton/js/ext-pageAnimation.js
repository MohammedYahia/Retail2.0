$(function() {
    var defaultAnimType = "easeInOutCubic";
    var defaultAnimSpeed = 500;
    var origAnimSpeed;
    var origStyle = "";

    var animSpeed = 1000;
    var animType = "swing";


    var idToUpdate = "C1__EDGE_CONNECT_PROCESS";
    var idToAnimate = "C1__EDGE_CONNECT_PHASE";
    var panelCount = 1;
    
    var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    var inAnim = false;

    function beforeAnimation(controllerName, ns, context, btn, disableInput, buttonId) {
		if ("TT_Module" in window) TT_Module.hideTooltips();
		

        if (inAnim) return false;
        var buttonClass     = "" + $("#" + buttonId).attr("class");

        isScrollDown        = buttonClass.indexOf("ecAnimScrollDown") > -1 ? true : false;
        isScrollUp          = buttonClass.indexOf("ecAnimScrollUp") > -1 ? true : false;
        isLeft              = buttonClass.indexOf("ecAnimLeft") > -1 ? true : false;
        isRight             = buttonClass.indexOf("ecAnimRight") > -1 ? true : false;        
        isOffLeftFadeIn     = buttonClass.indexOf("ecAnimOffLeftFadeIn") > -1 ? true : false;
        isFadeOutInLeft     = buttonClass.indexOf("ecAnimFadeOutInLeft") > -1 ? true : false;
        isFadeOutFadeIn     = buttonClass.indexOf("ecAnimFadeOutFadeIn") > -1 ? true : false;
        isOverlayFromTop    = buttonClass.indexOf("ecAnimOverlayFromTop") > -1 ? true : false;
        isOverlayFromLeft   = buttonClass.indexOf("ecAnimOverlayFromLeft") > -1 ? true : false;
        isOverlayFromBottom = buttonClass.indexOf("ecAnimOverlayFromBottom") > -1 ? true : false;
        isOverlayFromRight  = buttonClass.indexOf("ecAnimOverlayFromRight") > -1 ? true : false;
        isFlipForwards      = buttonClass.indexOf("ecAnimFlipForward") > -1 ? true : false;
        isFlipBackwards     = buttonClass.indexOf("ecAnimFlipBackward") > -1 ? true : false;
        isFlipVertTop       = buttonClass.indexOf("ecAnimFlipTop") > -1 ? true : false;
        isFlipVertBottom    = buttonClass.indexOf("ecAnimFlipBottom") > -1 ? true : false;
        isSRDG              = buttonClass.indexOf("ecAnimCubeRotateTop") > -1 ? true : false;
        isSRLG              = buttonClass.indexOf("ecAnimCubeRotateLeft") > -1 ? true : false;
        isSRRG              = buttonClass.indexOf("ecAnimCubeRotateRight") > -1 ? true : false;
        isSRUG              = buttonClass.indexOf("ecAnimCubeRotateBottom") > -1 ? true : false;
        isRemoveToTop       = buttonClass.indexOf("ecAnimRemoveToTop") > -1 ? true : false;
        isRemoveToLeft      = buttonClass.indexOf("ecAnimRemoveToLeft") > -1 ? true : false;
        isRemoveToBottom    = buttonClass.indexOf("ecAnimRemoveToBottom") > -1 ? true : false;
        isRemoveToRight     = buttonClass.indexOf("ecAnimRemoveToRight") > -1 ? true : false;
        isTurnPageNext      = buttonClass.indexOf("ecAnimTurnPageNext") > -1 ? true : false;
        isTurnPagePrev      = buttonClass.indexOf("ecAnimTurnPagePrevious") > -1 ? true : false;


        if (isSRUG || isSRRG  || isSRLG || isSRDG  || isScrollUp ||  isScrollDown || isLeft  || isRight || isOffLeftFadeIn || isFadeOutInLeft || isFadeOutFadeIn || isFlipForwards || isFlipBackwards|| isFlipVertTop || isFlipVertBottom ||
             isOverlayFromTop || isOverlayFromLeft || isOverlayFromBottom || isOverlayFromRight || 
             isRemoveToTop    || isRemoveToLeft    || isRemoveToBottom    || isRemoveToRight    ||
             isTurnPageNext   || isTurnPagePrev) {
            inAnim=true;

			idToUpdate  = $("#" + buttonId).closest("[id$=EDGE_CONNECT_PROCESS]").attr("id");
			idToAnimate = $("#" + buttonId).closest("[id$=EDGE_CONNECT_PHASE]").attr("id");

            var buttonClass = $("#" + buttonId).attr("class")
            var animClassStart =  buttonClass.indexOf("ecAnim");
            var animClass      =  buttonClass.indexOf(" ", animClassStart) > 0 ?  buttonClass.substring(animClassStart, buttonClass.indexOf(" ", animClassStart)) : buttonClass.substring(animClassStart) ;
            var animParams     = animClass.split("_");
            animType  =  (animParams.length > 1) ? animParams[1] : defaultAnimType;
            animSpeed =  (animParams.length > 2) ? animParams[2] : defaultAnimSpeed;
        }
        else
            inAnim = false;

        return true;
    }


    var oldContentId = "";

    function setupCurrentContainer() {
        oldContentId = "DELETE_ME";
        var oldWidth =  $("#" + idToAnimate).width();
    		var oldHeight = $("#" + idToAnimate).height();
    		var oldContainerWidth  = $("#" + idToUpdate).width();
    		var oldContainerHeight = $("#" + idToUpdate).height();
        $("<div id='"+oldContentId+"' style='width:" +oldContainerWidth + "px; height:"+oldContainerHeight+"px'></div>").insertBefore("#" + idToUpdate);
        $("#" + oldContentId).append( $("#" + idToUpdate + ">div") );
        $("#" + oldContentId + " #" + idToAnimate).css({"width": oldWidth + "px",
														"height": oldHeight + "px",
														"position": "absolute"});
    }
    function setupNewContainer(text, style) {
        if (!style) style = "";
        //create style attribute if neccessary...
        var endNewContainerTagIndex = text.indexOf(">");
        if (text.indexOf("style=") > endNewContainerTagIndex) {
            text = text.slice(0, endNewContainerTagIndex) + " style=\"\"" + text.slice(endNewContainerTagIndex);
        }

        // styles on main updated process
		var oldContainerWidth  = $("#" + idToUpdate).width();
        var styleIndex = text.indexOf("style=\"");
        var styleEndIndex = text.indexOf("\"", styleIndex + 7);
        text = text.slice(0, styleIndex + 7) + text.slice(styleEndIndex);
        text = text.slice(0, styleIndex + 7) + "position: absolute; width: " + oldContainerWidth + "px;top: 0px; " + style  + text.slice(styleIndex + 7);
        return text;

    }
    function setupAnimSection(text, styles, transform) {
        // styles on animated section
      	var $text = $(text);
      	var $elemToAnimate = $text.find("#" + idToAnimate);
      	$elemToAnimate.css(styles)
      	setTransform($elemToAnimate, transform);
        return $text.prop('outerHTML');;
    }

    function afterAnimationResponseReceived(service, element, innerOrOuter, text, actionFlag, actionData, ajaxCaller, dElement, ns) {
        
        origAnimSpeed = animSpeed;
        if (element == idToUpdate && innerOrOuter == "OUTER") {
            
            //bail out if not one of our special buttons...
            if (!inAnim)
                return true;

            if (isLeft || isRight || isScrollDown || isScrollUp || isOverlayFromTop || isOverlayFromLeft || isOverlayFromRight || isOverlayFromBottom) {
                 setupCurrentContainer();
                text = setupNewContainer(text, "z-index: 20");

                //work out where to put new anim section
                var offsetX = 0, offsetY = 0;
                if (isLeft || isRight  || isOverlayFromLeft || isOverlayFromRight)
                    offsetX =  (isLeft||isOverlayFromLeft ? "-": "") + $(window).width()  + "px";
                if (isScrollDown || isScrollUp || isOverlayFromTop || isOverlayFromBottom)
                    offsetY = (isScrollDown||isOverlayFromTop ? "-": "") + $(window).height() + "px";

                 text = setupAnimSection(text, {"opacity": "1"}, "translate3d(" + offsetX + ","+offsetY+ ",0)");
            }
            else if (isOffLeftFadeIn || isFadeOutFadeIn) {
                setupCurrentContainer();
                text = setupNewContainer(text);
                text = setupAnimSection(text, {"opacity": "0"}, (isOffLeftFadeIn ? "scale(0.8)" : "") + ";  ")
            }
            else if (isFadeOutInLeft) {
                setupCurrentContainer();
                text = setupNewContainer(text);
                text = setupAnimSection(text, "", "translate3d(-" + $(window).width() + "px,0,0); " )
            }
            else if (isRemoveToTop || isRemoveToLeft || isRemoveToRight || isRemoveToBottom) {
                setupCurrentContainer();
                text = setupNewContainer(text);
                //the anim section is not the one that moves, but has to be behind the current section
                text = setupAnimSection(text, {"z-index": "-1", "position": "relative"}, "");
	        } 
            else if (isFlipForwards || isFlipBackwards || isFlipVertTop || isFlipVertBottom) {
                setupCurrentContainer();

                var h = "height:" + $("#" + idToAnimate).height()+ "px;";
                var w = "width:"  + $("#" + idToAnimate).width ()+ "px;";
                var flip = '<div class="flip-container" style="' + h + w + '">' + 
                           '   <div class="flipper" style="' + h + '">' + 
                           '      <div id="oldContent" class="front DELETE_ME" style="' + h + w + '"></div>'+
                           '      <div id="newContent" class="back ' + (isFlipVertTop || isFlipVertBottom ? " vert" : "") + '"  style="' + h + w + '"></div>'+
                           '   </div>'+
                           '</div>';

                $(flip).insertBefore( $("#" + idToAnimate) )
                $("#oldContent").append( $("#" + idToAnimate) );

                text = setupNewContainer(text);
                //we'll move anim into new content after it has arrived...
            }
            else if (isTurnPageNext || isTurnPagePrev) {
                $("#" + idToUpdate).wrap("<div id='flipbook' class='sample-flipbook' style='margin: auto;width:1000px; height:" + $("#" + idToUpdate).height() + "px'></div>");
                $("#" + idToUpdate).attr("id", "DELETE_ME");
                if (isTurnPageNext)
                    $("#flipbook").append("<div id=" + idToUpdate + "></div>");
                else
                    $("#flipbook").prepend("<div id=" + idToUpdate + "></div>");

                var styleIndex = text.indexOf("style=\"");
                var styleEndIndex = text.indexOf("\"", styleIndex + 7);
                origStyle = text.substring(styleIndex + 7, styleEndIndex);

                text = text.slice(0, styleIndex + 7) + text.slice(styleEndIndex);
                text = text.slice(0, styleIndex + 7) + "display: static; " + text.slice(styleIndex + 7);
            }                      
            else if (isSRDG || isSRLG || isSRRG || isSRUG ) {
                setupCurrentContainer();
                var cube= '<div id="viewport" style="background-color:' + $("body").css("background-color") + ' ">' + 
                          '    <div id="container">' + 
                          '      <div id="cube" class="cube">' +
                          '        <div class="face primary DELETE_ME"   id="oldContent" ></div>' +
                          '        <div class="face secondary" id="newContent" ></div>' +
                          '      </div>' +
                          '    </div>'+
                          '</div>';
                $(cube).insertBefore("#" + idToAnimate);
                resizeCube();
                $("#oldContent").append( $("#" + idToAnimate) );

                //$("#newContent").append( "<div id='" + idToUpdate  + "'></div>"  );
                text = setupNewContainer(text);

            }
            else {
                console.log("Hmmm - not sure: ");
                return true;
            }
            
            
            //add height to the text...
            var styleIndex = text.indexOf("style=\"");
            text = text.slice(0, styleIndex + 7) + "height: " +  $(window).height() + "px; " + text.slice(styleIndex + 7);
            return {continueAfterHook: true, text: text, dElement: $("#" + idToUpdate)[0] };
        }
        return true;
    }

    function resizeCube() {
        setTransform( $("#container"),      "translateZ(-" + cubeHeight() / 2 + "px)" );
        setTransform( $(".face.primary"),   "translateZ(" + cubeHeight() / 2 + "px)" );

        if (isSRDG)
            setTransform( $(".face.secondary"), "rotateX(-90deg) translateZ(" + cubeHeight() / 2 + "px) " );
        else if (isSRLG)
            setTransform( $(".face.secondary"), "rotateY(-90deg) translateZ(" + cubeHeight() / 2 + "px) " );
        else if (isSRRG)
            setTransform( $(".face.secondary"), "rotateY(90deg) translateZ(" + cubeHeight() / 2 + "px) " );
        else if (isSRUG)
            setTransform( $(".face.secondary"), "rotateX(90deg) translateZ(" + cubeHeight() / 2 + "px) " );


        $(".cube").css("width", ($("#" + idToAnimate).width()) + "px" );
        $("#viewport, .cube").css("height", ($("#" + idToAnimate).height()) + "px" );
    }


    function cubeHeight() {
	    return $("#" + idToAnimate).height();
    }
    function setTransform($o, val) {
            $o.css({
              '-webkit-transform' : val,
              '-moz-transform'    : val,
              '-ms-transform'     : val,
              '-o-transform'      : val,
              'transform'         : val
            });
    }

    function doAnimation(service, element, innerOrOuter, text, actionFlag, actionData, ajaxCaller, dElement, ns) {
        if (element == idToUpdate && innerOrOuter == "OUTER") {  
            
            //bail out if not one of our special buttons...
            if (!inAnim)
                return;


            $("html,body").css("overflow", "hidden");

            if (isSRDG || isSRLG || isSRRG || isSRUG) {
                 var $origParent = $("#" + idToUpdate + " #" + idToAnimate).parent();
                 $("#" + idToUpdate + " #" + idToAnimate).appendTo( $("#newContent") )

                 animSpeed = 3000;
                 $("#container").addClass("srg");
                 var delay = 500;
                 setTimeout(function() {
                     setTransform( $("#container"),      "translateZ(-" + cubeHeight() + "px)" );
                 }, delay);

                 setTimeout(function() {
                    if (isSRDG)
                        setTransform( $("#cube"),        "rotateX(90deg) translateZ(0)" );
                    else if (isSRLG) 
                        setTransform( $("#cube"),        "rotateY(90deg) translateZ(0)" );
                    else if (isSRRG) 
                        setTransform( $("#cube"),        "rotateY(-90deg) translateZ(0)" );
                    else if (isSRUG) 
                        setTransform( $("#cube"),        "rotateX(-90deg) translateZ(0)" );
                 }, delay + 700);
                 
                 setTimeout( function() {
                    setTransform( $("#container"),   "translateZ(-" + cubeHeight()/2 + "px)" );
                 }, delay + 1400);
                 
                 setTimeout ( function () {
                    TRIGGERED_REASON.push(AJAX_RESPONSE_TRIGGER);
                    $("#newContent #" + idToAnimate).appendTo( $origParent )
					         $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "", "height": ""})    
                    $("#DELETE_ME, .DELETE_ME").remove();
                    TRIGGERED_REASON.pop();
                    
                    $("#viewport").remove();
                    $("html,body").css("overflow", "");
                    inAnim = false;
                 }, delay + 2000);
            }
            else if (isTurnPageNext || isTurnPagePrev) {
                try {
                    $('.sample-flipbook').turn({
                        acceleration: true,
                        display: "single",
                        duration: animSpeed,
                        elevation: 50,
                        gradients: true,
                        page: isTurnPageNext ? 1 : 2,
                        when: {
                            end: function() {
                                $("#" + idToUpdate).attr("style", origStyle).insertBefore($("#flipbook"));
                                $("#flipbook").remove();
                                $("html,body").css("overflow", "");
                                inAnim = false;
                            }
                        }
                    });
                    if (isTurnPageNext)
                        $("#flipbook").turn("next");
                    else 
                        $("#flipbook").turn("previous");
                } catch (e) {
                    console.log(e);
                }
            }
            else if (isFlipForwards || isFlipBackwards || isFlipVertTop || isFlipVertBottom) {
                var $origParent = $("#" + idToUpdate + " #" + idToAnimate).parent();
                $("#" + idToUpdate + " #" + idToAnimate).appendTo( $("#newContent") )
                $("#" + idToUpdate).css("opacity", "1");
                var action = "rotate";
                if (isFlipVertTop)         action += "X(180deg)";
                else if (isFlipVertBottom) action += "X(-180deg)";
                else if (isFlipForwards)   action += "Y(-180deg)";
                else                       action += "Y(180deg)";


                $("#newContent").closest(".flipper").transition({
                    transform: action
                }, animSpeed, animType, function() {
                    TRIGGERED_REASON.push(AJAX_RESPONSE_TRIGGER);
                    //move new content out of flipper back to orig parent
                    $("#newContent #" + idToAnimate).appendTo( $origParent )
                    $("#DELETE_ME, .DELETE_ME").remove();
                    $("html,body").css("overflow", "");
                    TRIGGERED_REASON.pop();
                    $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "", "height": ""})                      
                    inAnim = false;
                });   
            }
            else if (isLeft || isRight || isScrollDown || isScrollUp || 
	              isOverlayFromTop || isOverlayFromLeft  || isOverlayFromRight || isOverlayFromBottom) {
                 
                var offsetX = 0, offsetY = 0;
                if (isLeft || isRight  || isOverlayFromLeft || isOverlayFromRight)
                    offsetX =  (isLeft||isOverlayFromLeft ? "-": "") + $(window).width() ;
                if (isScrollDown || isScrollUp || isOverlayFromTop || isOverlayFromBottom)
                    offsetY = (isScrollDown||isOverlayFromTop ? "-": "") + $(window).height() ;
                

                //only animate orig section if scroll type, not overlay...
                if (isLeft || isRight || isScrollDown || isScrollUp) {
                    $("#" + oldContentId + " #" + idToAnimate).transition({
                        x: offsetX * -1,
                        y: offsetY * -1
                    }, animSpeed, animType); 
                }
                $("#" + idToUpdate  + " #" + idToAnimate).transition({
                    x:0,
                    y:0
                }, animSpeed, animType, function() {
                    $("#DELETE_ME, .DELETE_ME").remove();
                    $("html,body").css("overflow", "");
                    $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "","height": "", "transform": ""})
                    inAnim = false;
                });
            }
            else if (isFadeOutFadeIn) {
                $("#" + oldContentId + " #" + idToAnimate).animate({
                    opacity: 0
                }, animSpeed, "swing", function() {
                    //now fade in new content...
                    $("#" + idToUpdate + " #" + idToAnimate).animate({
                        opacity: 1
                    }, animSpeed, "swing", function() {
                        $("#DELETE_ME, .DELETE_ME").remove();
                        $("html,body").css("overflow", "");
                        $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "","height": ""})
                        inAnim = false;
                    });                
                });
            }
            else if (isFadeOutInLeft) {
                //setTransform( $("#" + oldContentId),      "scale(1)" );
                $("#" + oldContentId + " #" + idToAnimate).transition({
                    opacity: 0,
                    scale: 0.8
                }, animSpeed, "ease");
                $("#" + idToUpdate + " #" + idToAnimate).transition({
                    opacity: 1,
                    x: 0,
                }, animSpeed, animType, function() {
                    $("#DELETE_ME, .DELETE_ME").remove();
                    $("html,body").css("overflow", "");
                    $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "","height": ""})
                    inAnim = false;
                });
            }
            else if (isOffLeftFadeIn) {
                $("#" + oldContentId + " #" + idToAnimate).transition({
                    x: "-" + $(window).width(),
                    opacity: 0
                }, animSpeed, animType); 
                $("#" + idToUpdate  + " #" + idToAnimate).transition({
                    opacity: 1,
                    scale: 1,
                    y:0
                }, animSpeed, "ease", function() {
                    $("#DELETE_ME, .DELETE_ME").remove();
                    $("html,body").css("overflow", "");
                    $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "","height": ""})
                    inAnim = false;
                });
            }
            else if (isRemoveToTop  || isRemoveToBottom || isRemoveToLeft || isRemoveToRight) {
                var xOffset = 0, yOffset = 0;

                if (isRemoveToRight || isRemoveToLeft) {
                    xOffset = (isRemoveToLeft ? "-" : "") +  $(window).width() + "px"
                } else {
                    yOffset = (isRemoveToTop ? "-" : "") +  $(window).height() + "px"
                }

                $("#" + oldContentId + " #" + idToAnimate).transition({
                    transform:  'translate3d(' + xOffset + ',' +  yOffset + ', 0)'
                }, animSpeed, animType, function() {
                    $("#DELETE_ME, .DELETE_ME").remove();
                    $("html,body").css("overflow", "");
                    $("#" + idToUpdate  + ",#" + idToAnimate).css({"position": "","width": "","height": ""})
                    inAnim = false;
                });
	        }            
        }
        
        animSpeed = origAnimSpeed;
    }

	Hi.addHook('beforeAjaxButtonActionService', beforeAnimation)
      .addHook('afterAjaxButtonActionService', afterAnimationResponseReceived)
      .addHook('postProcessAjaxButtonActionService', doAnimation)
});
