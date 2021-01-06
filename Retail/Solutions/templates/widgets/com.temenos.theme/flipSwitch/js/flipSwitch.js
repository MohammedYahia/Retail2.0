var FlipSwitch = (function() {
	function init(args) {
		$("#" + args.id).off("click").on("click", function(e) {
				
			if ($(e.target).is(":checked")) {
				args.onJS.apply();
				$("html").addClass(args.onClass).removeClass(args.offClass);			
			} 
			else {
				args.offJS.apply();
				$("html").addClass(args.offClass).removeClass(args.onClass);
			}

			setTimeout(function() {
				args.qlr(e);
				args.checkHidden();
			}, 500)	
		})
	}

	return {
		init: init
	}
})();
