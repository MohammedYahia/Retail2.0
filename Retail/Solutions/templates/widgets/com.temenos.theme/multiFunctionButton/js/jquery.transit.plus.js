/*!
 * jQuery Transit - UI Animation & Transition for Awesome and Powerful Web-site design
 *
 * Added, Factored and Modified Feature
	* UI - slideUp, slideDown, slideToggle, show, hide, toggle, fadeIn, fadeOut, fadeToggle, fadeTo
	* .from and .fromTo methods
	* rotate with 3d perspective
	* Beta SHAKE animation, custom effect
	* toCircle animation, custom effect
 *
 *
 * THIS jQuery.Transit ADD-ON MAKED BY (@dalisoft, http://github.com/dalisoft)
 * (c) 2011-2014 Rico Sta. Cruz
 * (c) 2014 Dalisoft. ( UI Plug-in )
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 *
 * Updates by
 * http://github.com/dalisoft
 */

/* jshint expr: true */
;
(function (root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		factory(root.jQuery);
	}

}
	(this, function ($) {

	function showHideFx(name, duration, easing, callback, incWidth) {
		var $elem = this;
		var dims = getDims(this);
		var height = /slideDown|show/.test(name) ? dims.height : 0,
			width = incWidth ? name === 'show' ? "auto" : 0 : "auto",
			opacity = this.css("opacity");



		this.css({
			height: /slideDown/.test(name) ? 0 : dims.height,
			display: /slide(Down|Up)|show/.test(name) ? "block" : "",
			overflow: "hidden"
		})
		return this.transit({
			height : height,
			width : width,
			opacity : incWidth ? name === 'hide' ? 0 : 1 : opacity,
			overflow : 'hidden'
		}, duration, easing, function () {
			$elem.css({
				overflow : /slideDown|show/.test(name) ? '' : 'hidden',
				opacity : /slide(Down|Up)/.test(name) ? '' : name === 'show' ? 1 : 0,
				width : /slide(Down|Up)/.test(name) ? '' : name === 'show' ? width : 0,
				height: ""
			});
			if (callback) {
				callback.call($elem);
			}
		});
	}

	/*, $.each(['scaleIn', 'scaleOut'], function ( i, name ) {
		$.fn[ name ] = function ( duration, easing, callback ) {
		return this.transit({scale: name === 'scaleIn' ? 1 : 0 }, duration, easing, callback);
		}
	});
	
	$.each(['fadeIn', 'fadeOut'], function ( i, name ) {
		$.fn[ name ] = function ( duration, easing, callback ) {
		return this.transit({opacity: name === 'fadeIn' ? 1 : 0 }, duration, easing, callback);
		}
	});*/

	$.each(['slideDown', 'slideUp' /*, 'show', 'hide'*/], function ( i, name ) {
		$.fn[ name ] = function ( duration, easing, callback ) {
		showHideFx.call(this,  name, duration, easing, callback, /show|hide/.test(name));
		return this;
		}
	});

	/*$.fn.slideToggle = function ( duration, easing, callback ) {
		if ( this.height() === "0px" || this.css("display") === "none" ) {
		this.slideDown( duration, easing, callback );
		} else {
		this.slideUp( duration, easing, callback );
		}
		return this;
	}

	$.fn.toggle = function ( duration, easing, callback ) {
		if ( this.width() === "0px" || this.css("display") === "none" ) {
		this.show( duration, easing, callback );
		} else {
		this.hide( duration, easing, callback );
		}
		return this;
	}

	$.fn.fadeToggle = function ( duration, easing, callback ) {
		if ( this.css("opacity") === ("0" || 0) || this.css("display") === "none" ) {
		this.fadeIn( duration, easing, callback );
		} else {
		this.fadeOut( duration, easing, callback );
		}
		return this;
	}

	$.fn.fadeTo = function ( to, duration, easing, callback ) {
		return this.transit({opacity: to}, duration, easing, callback);
	}*/

	function getDims($elem) {
		var origPos = $elem.css("position");
		var origOpac = $elem.css("opacity");
		var origDisp = $elem.css("display");
		var origWidth = $elem.css("width");

		//make abs and opac - 
		$elem.css({opacity: "0",
	               position: "absolute",
	               width: "100%",
	           	   display: "block"})

		var dims = {width: $elem.outerWidth(), height: $elem.outerHeight()}

		$elem.css({opacity: origOpac,
	               position: origPos,
	               display: origDisp})
		return dims;
	}

	// function getStyle (elem, from) {
	// var a = {}, key;
	// 	for (key in from) {
	// 	var offset = { width: elem.offsetWidth, height: elem.offsetHeight, top: elem.offsetTop, left: elem.offsetLeft };
	// 	a[key] = /width|height|top|left/.test(key) ? offset[key] : $(elem).css(key);
	// 	}
	// return a;
	// }

	// $.fn.rotate = function ( x, y, z, otherEffects, duration, easing, callback ) {
	// var div = $("<div/>").css({perspective:600, width: this.width()}).html(this.clone());
	// 	this.before(div).remove();
	// 	div.children().transit($.extend(otherEffects || {}, {rotateX:x, rotateY:y, rotate:z}), duration, easing, callback);
	// 	return this;
	// }

	// $.fn.toCircle = function ( to, duration, easing, callback ) {
	// 	return this.transit($.extend(to || {}, {borderRadius:"50%"}), duration, easing, callback);
	// }

	// $.fn.shake = function ( duration, callback ) {
	// 	var d = duration / 5;
	// 	return this.transit({x:300}, d).transit({x:-300}, d).transit({x:200}, d).transit({x:-200}, d).transit({x:0}, callback);
	// }

	// $.fn.fromTo = function ( from, to, duration, easing, callback ) {
	// return this.transit(from, 0).transit(to, duration, easing, callback); 
	// }

	// $.fn.from = function ( from, duration, easing, callback ) {
	// 	return this.each(function(){
	// 		$(this).fromTo(from, getStyle(this, from), duration, easing, callback);
	// 	});
	// }
	
	$.fn.to = $.fn.transit;

	}));