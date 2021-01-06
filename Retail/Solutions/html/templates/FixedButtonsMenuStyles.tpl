<link rel="stylesheet" media="all" type="text/css" href="html/css/staticbuttonsmenu.css" />
<style type="text/css">
.menufixedbuttons {
	$%if ITEM.MenuWidth != ''$
		width:$$ITEM.MenuWidth$px;
	$%endif$
	min-height: $$ITEM.MenuHeight$px;

	font: $$ITEM.MenuStyle.font$;
	$%if ITEM.MenuStyle.font-size != ''$
		font-size: $$ITEM.MenuStyle.font-size$;
	$%endif$
	$%if ITEM.MenuStyle.font-weight != ''$
		font-weight: $$ITEM.MenuStyle.font-weight$;
	$%endif$
	$%if ITEM.MenuStyle.font-family != ''$
		font-family: $$ITEM.MenuStyle.font-family$;
	$%endif$
	$%if ITEM.MenuStyle.font-style != ''$
		font-style: $$ITEM.MenuStyle.font-style$;
	$%endif$

	margin: $$ITEM.MenuStyle.margin$;
	$%if ITEM.MenuStyle.margin-top != ''$
		margin-top: $$ITEM.MenuStyle.margin-top$;
	$%endif$
	$%if ITEM.MenuStyle.margin-bottom != ''$
		margin-bottom: $$ITEM.MenuStyle.margin-bottom$;
	$%endif$
	$%if ITEM.MenuStyle.margin-left != ''$
		margin-left: $$ITEM.MenuStyle.margin-left$;
	$%endif$
	$%if ITEM.MenuStyle.margin-right != ''$
		margin-right: $$ITEM.MenuStyle.margin-right$;
	$%endif$

	background: $$ITEM.MenuStyle.background$;
	$%if ITEM.MenuStyle.background-color != ''$
		background-color: $$ITEM.MenuStyle.background-color$;
	$%endif$
	$%if ITEM.MenuStyle.background-image != ''$
		background-image: url($$ITEM.MenuStyle.background-image$);
	$%endif$
	$%if ITEM.MenuStyle.background-position != ''$
		background-position: $$ITEM.MenuStyle.background-position$;
	$%endif$
	$%if ITEM.MenuStyle.background-repeat != ''$
		background-repeat: $$ITEM.MenuStyle.background-repeat$;
	$%endif$
}

.menufixedbuttons button, .menufixedbuttons input {
	height: $$ITEM.MenuItemHeight$px;
	color: $$ITEM.MenuItemStyle.color$;
	min-height: $$ITEM.MenuItemHeight$px;
	text-decoration: $$ITEM.MenuItemStyle.text-decoration$;

	padding: $$ITEM.MenuItemStyle.padding$;
	$%if ITEM.MenuItemStyle.padding-top != ''$
		padding-top: $$ITEM.MenuItemStyle.padding-top$;
	$%endif$
	$%if ITEM.MenuItemStyle.padding-bottom != ''$
		padding-bottom: $$ITEM.MenuItemStyle.padding-bottom$;
	$%endif$
	$%if ITEM.MenuItemStyle.padding-left != ''$
		padding-left: $$ITEM.MenuItemStyle.padding-left$;
	$%endif$
	$%if ITEM.MenuItemStyle.padding-right != ''$
		padding-right: $$ITEM.MenuItemStyle.padding-right$;
	$%endif$

	background: $$ITEM.MenuItemStyle.background$;
	$%if ITEM.MenuItemStyle.background-color != ''$
		background-color: $$ITEM.MenuItemStyle.background-color$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-image != ''$
		background-image: url($$ITEM.MenuItemStyle.background-image$);
	$%endif$
	$%if ITEM.MenuItemStyle.background-position != ''$
		background-position: $$ITEM.MenuItemStyle.background-position$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.MenuItemStyle.background-repeat$;
	$%endif$

	font: $$ITEM.MenuItemStyle.font$;
	$%if ITEM.MenuItemStyle.font-weight != ''$
		font-weight: $$ITEM.MenuItemStyle.font-weight$;
	$%endif$
	$%if ITEM.MenuItemStyle.font-family != ''$
		font-family: $$ITEM.MenuItemStyle.font-family$;
	$%endif$
	$%if ITEM.MenuItemStyle.font-size != ''$
		font-size: $$ITEM.MenuItemStyle.font-size$;
	$%endif$
	$%if ITEM.MenuItemStyle.font-style != ''$
		font-style: $$ITEM.MenuItemStyle.font-style$;
	$%endif$

	border-top: $$ITEM.MenuItemStyle.border$;
	$%if ITEM.MenuItemStyle.border-width != ''$
		border-top-width: $$ITEM.MenuItemStyle.border-width$;
	$%endif$
	$%if ITEM.MenuItemStyle.border-style != ''$
		border-top-style: $$ITEM.MenuItemStyle.border-style$;
	$%endif$
	$%if ITEM.MenuItemStyle.border-color != ''$
		border-top-color: $$ITEM.MenuItemStyle.border-color$;
	$%endif$

	text-align: left;
	border:0px;
}

.menufixedbuttons button:hover, .menufixedbuttons input:hover {
	color: $$ITEM.RolloverStyle.color$;
	text-decoration: $$ITEM.RolloverStyle.text-decoration$;

	background: $$ITEM.RolloverStyle.background$;
	$%if ITEM.RolloverStyle.background-color != ''$
		background-color: $$ITEM.RolloverStyle.background-color$;
	$%endif$
	$%if ITEM.RolloverStyle.background-image != ''$
		background-image: url($$ITEM.RolloverStyle.background-image$);
	$%endif$
	$%if ITEM.RolloverStyle.background-position != ''$
		background-position: $$ITEM.RolloverStyle.background-position$;
	$%endif$
	$%if ITEM.RolloverStyle.background-repeat != ''$
		background-repeat: $$ITEM.RolloverStyle.background-repeat$;
	$%endif$

	font: $$ITEM.RolloverStyle.font$;
	$%if ITEM.RolloverStyle.font-weight != ''$
		font-weight: $$ITEM.RolloverStyle.font-weight$;
	$%endif$
	$%if ITEM.RolloverStyle.font-family != ''$
		font-family: $$ITEM.RolloverStyle.font-family$;
	$%endif$
	$%if ITEM.RolloverStyle.font-size != ''$
		font-size: $$ITEM.RolloverStyle.font-size$;
	$%endif$
	$%if ITEM.RolloverStyle.font-style != ''$
		font-style: $$ITEM.RolloverStyle.font-style$;
	$%endif$
}

$%if ITEM.MenuStyle.border != ""$
.menufixedbuttons ul {
	border-left: $$ITEM.MenuStyle.border$;
	border-right: $$ITEM.MenuStyle.border$;
	border-bottom: $$ITEM.MenuStyle.border$;
}

.menufixedbuttons li {
	border-top: $$ITEM.MenuStyle.border$;
}

.menufixedbuttons ul ul {
	border: 0px; /* override for sub menus so they don't get the menu outer border style */
}
$%endif$

.menufixedbuttons li li {
	border: 0px; /* override for sub menus so they don't get the menu outer border style */
}

.menufixedbuttons li li button, .menufixedbuttons li li input {
	color: $$ITEM.SubMenuItemStyle.color$;
	padding-left: $%WRITE ##ITEM.MenuItemStyle.padding-left# + ##ITEM.MenuItemIndentation#$$%ENDWRITE$px;

	background: $$ITEM.SubMenuItemStyle.background$;
	$%if ITEM.SubMenuItemStyle.background-color != ''$
		background-color: $$ITEM.SubMenuItemStyle.background-color$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.background-image != ''$
		background-image: url($$ITEM.SubMenuItemStyle.background-image$);
	$%endif$
	$%if ITEM.SubMenuItemStyle.background-position != ''$
		background-position: $$ITEM.SubMenuItemStyle.background-position$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.SubMenuItemStyle.background-repeat$;
	$%endif$

	font: $$ITEM.SubMenuItemStyle.font$;
	$%if ITEM.SubMenuItemStyle.font-weight != ''$
		font-weight: $$ITEM.SubMenuItemStyle.font-weight$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.font-family != ''$
		font-family: $$ITEM.SubMenuItemStyle.font-family$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.font-size != ''$
		font-size: $$ITEM.SubMenuItemStyle.font-size$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.font-style != ''$
		font-style: $$ITEM.SubMenuItemStyle.font-style$;
	$%endif$
}

.menufixedbuttons .activeMenuLink > button, .menufixedbuttons .activeMenuLink > input {
	text-decoration: $$ITEM.SelectedItemStyle.text-decoration$;
	color: $$ITEM.SelectedItemStyle.color$;

	background: $$ITEM.SelectedItemStyle.background$;
	$%if ITEM.SelectedItemStyle.background-color != ''$
		background-color: $$ITEM.SelectedItemStyle.background-color$;
	$%endif$
	$%if ITEM.SelectedItemStyle.background-image != ''$
		background-image: url($$ITEM.SelectedItemStyle.background-image$);
	$%endif$
	$%if ITEM.SelectedItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.SelectedItemStyle.background-repeat$;
	$%endif$
	$%if ITEM.SelectedItemStyle.background-position != ''$
		background-position: $$ITEM.SelectedItemStyle.background-position$;
	$%endif$

	font: $$ITEM.SelectedItemStyle.font$;
	$%if ITEM.SelectedItemStyle.font-weight != ''$
		font-weight: $$ITEM.SelectedItemStyle.font-weight$;
	$%endif$
	$%if ITEM.SelectedItemStyle.font-family != ''$
		font-family: $$ITEM.SelectedItemStyle.font-family$;
	$%endif$
	$%if ITEM.SelectedItemStyle.font-size != ''$
		font-size: $$ITEM.SelectedItemStyle.font-size$;
	$%endif$
	$%if ITEM.SelectedItemStyle.font-style != ''$
		font-style: $$ITEM.SelectedItemStyle.font-style$;
	$%endif$
}

.menufixedbuttons li li li button, .menufixedbuttons li li li input {
	padding-left: $%WRITE ##ITEM.MenuItemStyle.padding-left# + 2*##ITEM.MenuItemIndentation#$$%ENDWRITE$px;
}

.menufixedbuttons li li li li button, .menufixedbuttons li li li li input {
	padding-left: $%WRITE ##ITEM.MenuItemStyle.padding-left# + 3*##ITEM.MenuItemIndentation#$$%ENDWRITE$px;
}

</style>