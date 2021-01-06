<link  href="html/css/jquery.qtip.min.css" rel="stylesheet" type="text/css" />
<style>
.qtip {
    font-size: 1rem;
    line-height: normal;
    opacity: 1;
    
}
.qtip-hidden {
    opacity: 0 !important;
    transition: all 0.25 ease-in-out;
}
.qtip-tip {
    xdisplay: none !important;
}
.qtip-content:empty {
    display: none;
}
</style>

<script src="html/js-others/jquery.qtip.min.js"></script>

<script type="text/javascript">
var TT_Module = (function() {
    function destroyToolTip( $elem ) {
        $elem.qtip("destroy", true);
    };

    function showToolTip( $elem, event ) {
        if ($elem.is(".MVGroupLinearTable"))
                return;

            //no tooltip for disabled buttons/links...
        if ($elem.is(":disabled") || $elem.is("a:not([href]")) {
            $elem.attr("title", "")
            return;
        }
        $%IF BROWSER_FEATURES.touch == "N"$
            $elem.qtip({
                overwrite: false, // Don't overwrite tooltips already bound
                content: {
                    text: function(event, api) {
                        // Retrieve content from custom attribute of the $('.selector') elements.
                        var text = $(this).attr("tooltip");
                        
    					if (!text || text.length == 0) {
                            text = "" + $(this).attr("title");
                        }

    					if (!text || text.length == 0) {
                            if ($(this).attr("oldtitle") != null) {
                                text = "" + $(this).attr("oldtitle");
                            }
    					}
                        return (text.length == 0) ? null:text;
                    }
                },
                show: {
                    event: event.type, // Use the same event type as above
                    ready: true,
                    delay: 500, // Show immediately - important!
                },
                style: {
                    classes: 'qtip-dark tc-rounded-1 tc-light tc-fs-m2',
                    tip: false
                },
                position: {
                    my: 'top left',  // Position my top left...
                    at: 'bottom center', // at the bottom right of...
                    viewport: $(window),
                    adjust:{screen:true, resize:true}
                },
                events: {
                	show : function (event, api) {
                    	if( api.target["0"].clientLeft == 0 && api.target["0"].clientWidth == 0 ) {
                    		event.preventDefault()
						} 

                        //if no text, then hide qtip
                        var title    = $(api.elements.target[0]).attr("title"),
                            oldtitle = $(api.elements.target[0]).attr("oldtitle");
                        if ( (title == null || title.length == 0)  && (oldtitle == null || oldtitle.length == 0) ) {
                            event.preventDefault()
                        }
					}      
                }
            });
        $%ENDIF$
    };

    function hideTooltips() {
        $(".qtip").hide();
    };

    return ({
        showToolTip: showToolTip,
        destroyToolTip: destroyToolTip,
        hideTooltips: hideTooltips

    })
})();


$(function() {
    Hi.addHook('postProcessResponse', TT_Module.hideTooltips);
    if (navigator.userAgent.toLowerCase().indexOf("android") < 0){
        $("[title]").not("a, img, input").attr("title", "");
        $('#EDGE_CONNECT_PROCESS').on('mouseenter', 'a[title], img[title], input[title]', function (event) {
            TT_Module.showToolTip($(this), event);
        });        
    }
})
</script>
