var gridpak = {

    $container: {},

    /**
     * DOM element to append the Gridpak too
     *
     */
    append: '.responsive-section',

    css: '',

    mq: {
        grid: { 
            "xs":  {
                "bp": [0, 567],
                "cols": 3,
                "gutter": 20
            },
            "sm": {
                "bp": [480, 767],
                "cols": 8,
                "gutter": 20
            },
            "md": {
                "bp": [768, 1023],
                "cols": 12,
                "gutter": 20
            },
            "lg": {
                "bp": [1024, 1279],
                "cols": 12,
                "gutter": 20
            },
			"xl": {
                "bp": [1280],
                "cols": 16,
                "gutter": 20
            }
        },
    },

    /**
     * Insert jQuery if it's not already there
     *
     * Checks for jQuery and includes it from Google CDN if not
     *
     */
    bootstrap: function() {
        var jquerySrc = './html/js-others/jquery.js',
            script = {},
            that = this;

        // Have they brought a knife to gunfight?
        if (typeof(window.jQuery) == 'undefined') {
            script = document.createElement('script');
            script.src= jquerySrc;
            // Insert it right after the opening body tag
            document.body.insertBefore(script, document.body.firstChild);
            setTimeout('gridpak.init()', 500);
        } else {
            $(function() { that.init(); });
        }
    },

    /**
     * Make our cols and set up resizing functions
     */
    init: function() {
		//mid point of row-part....
		$(".tc-row-part").each(function(i,o) {
			$(o).append("<div class='vertAlignMarker'></div>");
			$(o).append("<div class='vertAlignMarker vertAlignMarker-bottom'></div>");
		});
        var css = '<style type="text/css"> ' +
            '.highlight-padding { '+
                'background-image:linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(240, 255, 255, 1) 100%), '+
                'linear-gradient(to bottom, rgba(240, 122, 40, 0.79) 0%, rgba(240, 122, 40, 0.79) 100%);'+
                'background-clip: content-box, padding-box;'+
            '}'+

            '.gridpak { ' +
                'width:100%; ' +
                'height:100%; ' +
                'display:none; ' +
                'position:absolute; ' +
                'top:0;left:0; ' +
				'pointer-events: none;' + 
            '} ' +
            '.gridpak .gridpak_grid { ' +
                'height:100%; ' +
                'display:none; ' +
				'margin: 0px 10px;' + 
            '} ' +
            '.gridpak.gridpak-rowpart .gridpak_grid { ' +
				'margin: 0px' + 
            '} ' +
			'.responsive-section .responsive-section .gridpak .gridpak_grid { ' +
				'margin: 0px -10px;' + 
            '} ' +
            '.gridpak .gridpak_col { ' +
                '-moz-background-clip: padding; -webkit-background-clip: padding-box; background-clip: padding-box;' +
                'padding:0 10px; ' +
                '-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; ' +
                'display:block; ' +
                'float:left; ' +
                'height:100%; ' +
                
            '} ' +
            '.gridpak0 {box-shadow: 0px 0px 1px #D47Af2}' + 
            '.gridpak1 {box-shadow: 0px 0px 1px red}' + 
			'.responsive-section .responsive-section .gridpak_visible {' + 
				'background-color:rgba(255,0,0,0.4);' + 
				'color: red;' + 
				'box-shadow: inset 0px 0px 1px 1px red' + 
			'}' +
            '.gridpak .gridpak_visible { ' +
                'width:100%; ' +
                'height:100%; ' +
                'display:block; ' +
				'background-color:rgba(0,0,153,0.1); ' +
				'color: rgba(0,0,153,0.5);' + 
				'box-shadow: inset 0px 0px 1px 1px rgba(0,0,153,0.2);' + 
            '} '
            
            css += this.genMq();

            css += '</style> ';

		 $("body").append(css);

		this.toggleGrid();
		this.drawGrid();
    },

    genMq: function() {
        var css = "";
		var grids = this.mq.grid;
        var bps = Object.keys(grids)
        $(bps).each(function(i,o) {
            var gridDef = grids[o];
            var bp = gridDef.bp;
            css += '@media screen and (min-width: ' + bp[0] + 'px) ';
            if (bp.length == 2) 
                css += 'and (max-width: ' + bp[1] + 'px) ';
            
            css += '{' + 
                '.gridpak .gridpak_grid_' + i + ' { ' +
                    'display: block;' + 
                '}' + 
            '} ';

        });
        return css;
    },

	drawGrid: function() {
	    $('*[class*="rgrid"]').each(function(index,o) {
			var className = $(o).attr("class").split(" ");
			var cols = null;
			for (var i = 0; i < className.length; i++) {
				if (className[i].indexOf("rgrid") == 0) {
					cols = className[i].split("_");
					break;
				}
			}
			
			for (var i = 1; cols != null && i < cols.length; i++) {
                var depth = $(o).parents(".responsive-section").length;
				var rowPartStyle = $(o).is(".tc-row-part") ? " gridpak-rowpart" : "";
				var colHtml = "<div class='gridpak gridpak" + depth + rowPartStyle +"'><div class='gridpak_grid gridpak_grid_" + (i-1) + "'>";
				for (var col = 0; col < cols[i]; col++) {
					colHtml += '<div class="gridpak_col responsive-column col-1-' + cols[i] + '" ><div class="gridpak_visible" style="text-align: center"><b>' +  (col+1) + '</b></div></div>'
				}
				colHtml +=  "</div></div>";

				$(o).append(colHtml);
			}
		})
	},



     

     /**
      * Toggles the grids visibility with a keypress
      */
     toggleGrid: function() {
        var that = this;

        var toggleCount = 1;
        $(document).keyup(function(e) {
            if ($("html").is(".tc-show-grid") && e.altKey){
                if (e.keyCode == 71 ) {
                    $(".gridpak" + toggleCount++).toggle();
                    if ( $(".gridpak" + toggleCount ).length == 0) {
                        toggleCount = 0;
                    }
                } else if (e.keyCode == 80) {
                    $("[class*=card], .menufixedlinks a").toggleClass("highlight-padding");
                } else if (e.keyCode == 86){
					$(".vertAlignMarker").toggle();
                }
            }
            
        });
     },

 }


// Kick it off!
gridpak.bootstrap();
//add hook...
//Hi.addHook('postProcessResponse',                   gridpak.init)

