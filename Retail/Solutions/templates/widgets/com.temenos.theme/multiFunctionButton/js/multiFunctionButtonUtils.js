//override of edge default, as this widget can remove the inline onclick handler....

function getLinks(p_document, p_includeDisabled, ns) {
	var numLinks = p_document.links.length;
	var linx = new Array();
	for (var i = 0; i < numLinks; i++) {
		//not worrying about namespace here. TODO this may need doing sometime......
		var events = $._data(p_document.links[i], "events");
		var hasEvents = events != null;
		if (
			hasEvents &&
			events.click != null &&
			(typeof disabled == "undefined" || (p_includeDisabled || !disabled))
		) {
			linx.push(p_document.links[i]);
		} else {
			with (p_document.links[i]) {
				var isOnClickDefined =
					typeof onclick != "undefined" && onclick != null;
				if (
					(isOnClickDefined || getAttribute("onclick") != null) &&
					(typeof disabled == "undefined" ||
						(p_includeDisabled || !disabled))
				) {
					var onclickString = isOnClickDefined
						? onclick.toString()
						: "";
					var onclickAttrib = getAttribute("onclick") || "";
					if (
						ns == "" ||
						hasNS(onclickString) ||
						hasNS(onclickAttrib)
					) {
						linx.push(p_document.links[i]);
					}
				}
			}
		}
	}
	return linx;
}

function hasNS(str, ns) {
	return str.indexOf("'" + ns + "'") > -1 || str.indexOf('"' + ns + '"') > -1;
}

function performedDefaultButtonActionOnLinks(
	p_comp,
	p_defaultButton,
	p_elements,
	ns,
	p_doEvenWhenHidden
) {
	var buttonClickedCheck = "buttonClicked('" + p_defaultButton + "'";
	var buttonClickedOfflineCheck =
		"buttonClickedOffline('" + removeSpaces(p_defaultButton) + "'";
	var buttonClickedCheckDbl = 'buttonClicked("' + p_defaultButton + '"';
	var buttonClickedOfflineCheckDbl =
		'buttonClickedOffline("' + removeSpaces(p_defaultButton) + '"';

	for (var i = 0; i < p_elements.length; i++) {
		var onclickInd = p_elements[i].onclick;
		var oldClickAttr = $(p_elements[i]).attr("onoldclick");
		var oldonclickInd =
			typeof oldClickAttr !== typeof undefined && oldClickAttr !== false;
		if (onclickInd || oldonclickInd) {
			var onclickString = onclickInd
				? p_elements[i].onclick.toString()
				: oldClickAttr;
			if (
				onclickString.indexOf(buttonClickedCheck) > -1 ||
				onclickString.indexOf(buttonClickedOfflineCheck) > -1 ||
				onclickString.indexOf(buttonClickedCheckDbl) > -1 ||
				onclickString.indexOf(buttonClickedOfflineCheckDbl) > -1
			) {
				if (p_doEvenWhenHidden || !isHidden(p_elements[i])) {
					p_comp.onblur();
					if (onclickInd) {
						execute(
							p_elements[i],
							"onclick",
							DEFAULT_BUTTON_ACTION_TRIGGER
						);
					} else {
						$(p_elements[i]).click();
					}
				}
				return true;
			}
		}
	}
	return false;
}

function setClassOnElement(selector, clazz) {
	$("[id*=" + selector.substring(1) + "]").addClass(clazz);
}

$(window).resize(function() {
	try {
		$(".tc-ui-dialog").dialog("option", "position", "center");
	} catch (e) {
		//in case dialog has not been initialised...
	}
});

function hidePopup(argObj) {
	var $button = $("#" + argObj.id);
	if ("TT_Module" in window) TT_Module.destroyToolTip($button);

	var $dialog = $button.closest(".tc-popup-dialog");
	$dialog.dialog("close");
}
function showPopup(argObj) {
	var $button = $("#" + argObj.id);
	var $parent = argObj.ParentContextSelector
		? $button.closest(argObj.ParentContextSelector)
		: $("body");
	var $section = $parent.find(argObj.IdToUpdate);
	var $sectionParent = $section.parent();
	var modal = $section.is(".tc-popup-modal");
	var title = $section.find(".tc-popup-title").text();

	$section.dialog({
		title: title,
		dialogClass:
			"tc-ui-dialog tc-global-font " +
			argObj.ClassToAdd +
			(modal ? " tc-modal" : ""),
		draggable:
			navigator.userAgent.toLowerCase().indexOf("android") > -1
				? false
				: argObj.ClassToAdd.indexOf("tc-no-drag") < 0,
		resizable:
			navigator.userAgent.toLowerCase().indexOf("android") > -1
				? false
				: argObj.ClassToAdd.indexOf("tc-no-resize") < 0,
		position: { my: "center", at: "center", of: window },
		modal: modal,
		width: "auto",
		height: "auto",
		autoOpen: true,
		open: function() {
			$(this)
				.attr("data-orig-parent", $sectionParent.attr("id"))
				.parent()
				.appendTo("#EDGE_CONNECT_PROCESS");
			//redraw any carousels...
			$(this)
				.find(".swiper-container")
				.each(function(i, o) {
					window["swiper_" + o.id].update(true);
				});
			$(window).trigger("resize");
		},
		close: function() {
			$(this).appendTo($("#" + $(this).attr("data-orig-parent")));
			$(this).dialog("destroy");
		},
		show: function() {
			$(this).fadeIn("fast");
		},
		hide: function() {
			$(this).fadeOut("fast");
		},
		resize: function(event, ui) {
			$(this).css({
				width: "",
				height: ""
			});
		}
	});
}

function toggleExpandingSection(argObj) {
	var $button = $("#" + argObj.id);
	if (
		argObj.ParentContextSelector != null &&
		argObj.ParentContextSelector.length > 0
	) {
		var $section = $button
			.closest(argObj.ParentContextSelector)
			.find(argObj.IdToUpdate);
		if ($section.is(".tc-ex-sec-show")) {
			$section.css({
				height: $section.outerHeight(),
				overflow: "hidden"
			});
			var time = $section.outerHeight() * 2;
			$section.transit(
				{
					height: "0px"
				},
				time,
				"ease",
				function() {
					$section
						.addClass("tc-ex-sec-hide")
						.removeClass("tc-ex-sec-show");
					$section.closest(".tc-detail-section").css("z-index", "");
				}
			);
		} else {
			var time = $section.get(0).scrollHeight * 2;
			$section.closest(".tc-detail-section").css("z-index", 10);
			$section.transit(
				{
					height: $section.get(0).scrollHeight
				},
				time,
				"ease",
				function() {
					$section
						.addClass("tc-ex-sec-show")
						.removeClass("tc-ex-sec-hide")
						.css({
							height: "",
							overflow: ""
						});
				}
			);
		}
	}
}

function setFocusToSearch(argObj) {
	// hide any other popups...
	$(".tc-header-icon-on, .tc-icon-on")
		.not("#" + argObj.id)
		.removeClass("tc-header-icon-on tc-icon-on");
	$(".tc-popup.show-popup")
		.not(".tc-popup-fixed")
		.removeClass("show-popup")
		.css("transform", "");

	if (!$(argObj.IdToUpdate).is(".show-popup")) $(".tc-search-input").focus();
	else $(window).focus();
}

function getElsToUpdate(argObj) {
	// work out the id with component prefix injectected...
	var tmpIdArr = [];
	$(argObj.IdToUpdate.split(",")).each(function(i, o) {
		var selector = $.trim(o).replace("#", "#" + argObj.COMPONENT_ID_PREFIX);
		tmpIdArr.push(selector);
	});
	var IdToUpdateWithCompPrefix = tmpIdArr.join(", ");

	var $elsToUpdate = $(IdToUpdateWithCompPrefix);
	var $button = $("#" + argObj.id);
	if (
		argObj.ParentContextSelector != null &&
		argObj.ParentContextSelector.length > 0
	) {
		$elsToUpdate = $button
			.closest(argObj.ParentContextSelector)
			.find(IdToUpdateWithCompPrefix);
	}
	return $elsToUpdate;
}

function postFlyout() {}

function hideFlyout(argObj) {
	postFlyout();
	var $elsToUpdate = getElsToUpdate(argObj);
	$(".tc-popup.show-popup")
		.removeClass("show-popup")
		.css("transform", "");

	//if it is in a dialog, then we hide that...
	var $button = $("#" + argObj.id);
	$(".tc-header-icon-on").not($button).removeClass('tc-header-icon-on')
	if ($button.closest(".tc-popup-dialog").length == 1) {
		hidePopup(argObj)
	} 
	argObj.event.stopPropagation();
	argObj.event.preventDefault();
}

function preFlyoutMove() {
	$("html").removeClass("tc-show-sidebar");
}

function moveToButton(argObj) {
	preFlyoutMove();
	var $event = argObj.event;
	var rtl = $("html").attr("dir") == "rtl";
	var $button = $("#" + argObj.id);
	var buttonTop = $button.offset().top;
	var $offsetParent = $button.offsetParent();
	var buttonPos = $offsetParent.is(".tc-card, .tc-table-wrapper")
		? $button.position().left - 25
		: $button.position().left;
	var offsetParam = rtl ? "left" : "right";

	if ($button.closest("td").length > 0) {
		e = $.Event("click");
		e.pageX = $button.offset().left + $button.outerWidth() / 2;
		e.pageY = $button.offset().top + $button.outerHeight() / 2;
		if ($button.closest("tr").find(".tc-default-table-action").length > 0) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
		$button.closest("td").trigger(e);
	}

	var $elsToUpdate = getElsToUpdate(argObj);

	//close any open popups
	$(".tc-header-icon-on, .tc-icon-on")
		.not("#" + argObj.id)
		.removeClass("tc-header-icon-on tc-icon-on");
	$(".tc-popup.show-popup")
		.not($elsToUpdate)
		.removeClass("show-popup")
		.css("transform", "");

	var scale =
		$elsToUpdate[0].parentNode.getBoundingClientRect().width /
		$elsToUpdate[0].parentNode.offsetWidth;
	$elsToUpdate.offset({
		top:
			buttonTop +
			($elsToUpdate.is(".tc-card-header-popout-general") ||
			$button.is(".tc-header-icon")
				? $button.outerHeight(true) - 8
				: 0)
	});

	try {
		if (typeof currentPickerId == "string")
			$("#" + currentPickerId).spectrum("hide");
	} catch (e) {}

	//now set the position of the popup
	if (rtl) {
		$elsToUpdate.css(offsetParam, buttonPos + 10);
	} else {
		var horizAdjust = $button.is(".tc-header-icon") ? 0 : 9;
		var currentOffset = parseInt($elsToUpdate.css("right"), 10);
		$elsToUpdate
			.css("left", "")
			.css("right", "")
			.css(
				offsetParam,
				(currentOffset +
					($elsToUpdate[0].getBoundingClientRect().right -
						$button[0].getBoundingClientRect().right)) *
					scale
			);
		$elsToUpdate.each(function(i, o) {
			$(o).css(
				"transform",
				$(o).css("opacity") == 1 ? "" : "scale(" + 1 / scale + ")"
			);
		});

		//check it is all on screen
		setTimeout(function() {
			// off the left edge
			if ($elsToUpdate.offset().left < 0) {
				var right = parseInt($elsToUpdate.css("right"), 10);
				$elsToUpdate.css(
					"right",
					(right + $elsToUpdate.offset().left - 20) / scale
				);
			}

			//if off the bottom - move up...
			var overflow =
				$elsToUpdate[0].getBoundingClientRect().bottom -
				$(window).height();
			if (overflow > 0) {
				var currentOffset = parseInt($elsToUpdate.css("right"), 10);

				//don't move above top of page, so 0 is min value...
				$elsToUpdate
					.offset({
						top: Math.max(
							0,
							buttonTop +
								$button.outerHeight(true) -
								overflow / scale
						)
					})
					.css(
						offsetParam,
						(currentOffset + $button.outerWidth()) * scale
					);
			} else {
			}
		}, 500);
	}
}