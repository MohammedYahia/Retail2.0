<script src="$$HTML_LOCATION$/js-others/custom_scripts.js"></script>

<script type="text/javascript" language="javascript">
//Check whether the checkbox with ID REMEMBER_ME_CHECKBOX is selected or not.
//If selected, check whether the cookie already exists using readCookie(). If not, create one using newCookie().
//If not selected, check whether the cookie already exists using readCookie(). If it does, delete it using eraseCookie().

function afterInitForm(ns) {

		setFocusToFirst(ns, null, null);
		$("#$$COMPONENT_ID_PREFIX$USER_NAME").val(readCookie("USER_NAME"));
		$("#$$COMPONENT_ID_PREFIX$REMEMBER_ME_CHECKBOX_0").prop("checked", readCookie("REMEMBER_ME"));
		
	return;
}
		
function afterSubmit(ns, p_mode, p_scrollToButton, p_id) { 

		
			eraseCookie("USER_NAME");
			$("#$$COMPONENT_ID_PREFIX$USER_NAME").val("");
			eraseCookie("REMEMBER_ME");
			
			return;
}

</script>