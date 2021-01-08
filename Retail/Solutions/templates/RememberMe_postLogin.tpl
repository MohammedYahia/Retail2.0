<script src="$$HTML_LOCATION$/js-others/custom_scripts.js"></script>

<script type="text/javascript" language="javascript">
//Check whether the checkbox with ID REMEMBER_ME_CHECKBOX is selected or not.
//If selected, check whether the cookie already exists using readCookie(). If not, create one using newCookie().
//If not selected, check whether the cookie already exists using readCookie(). If it does, delete it using eraseCookie().

		if("$$Login[1].SaveID$" == "Y"){
			newCookie("USER_NAME", "$$Login[1].UserID$",5);							
			newCookie("REMEMBER_ME", "$$Login[1].SaveID$",5);
		}else {
			eraseCookie("USER_NAME");
			$("#$$COMPONENT_ID_PREFIX$USER_NAME").val("");
			eraseCookie("REMEMBER_ME");
		}

</script>