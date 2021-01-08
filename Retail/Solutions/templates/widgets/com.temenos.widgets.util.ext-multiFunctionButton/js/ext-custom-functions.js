function toggleExpandingSectionCustom(argObj) {
	var $button = $("#" + argObj.id);
	if (argObj.ParentContextSelector != null && argObj.ParentContextSelector.length > 0){
		var $section = $button.closest(argObj.ParentContextSelector).find(argObj.IdToUpdate);
		if ($section.is(".tc-ex-sec-show")) {
			$section.css("height", $section.outerHeight());
			var time = $section.outerHeight() * 2;
			$section.transit({
				height: "232px" 
			}, time, "ease", function() {
				$section.addClass("tc-ex-sec-hide").removeClass("tc-ex-sec-show")
			})
			if (argObj.DefaultTextOnButton != "") {
				$button.find("span").text(argObj.DefaultTextOnButton);
			}
		} else {
			var time = $section.get(0).scrollHeight * 2
			$section.transit({
				height: $section.get(0).scrollHeight 
			}, time, "ease", function() {
				$section.addClass("tc-ex-sec-show").removeClass("tc-ex-sec-hide ext-sticky-accounts-sidebar")
					.css("height", "");
			})
			if (argObj.ClickedTextOnButton != "") {
					$button.find("span").text(argObj.ClickedTextOnButton);
			}	
		}
	}
}