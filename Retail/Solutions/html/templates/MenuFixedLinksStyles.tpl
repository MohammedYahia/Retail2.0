<link rel="stylesheet" media="all" type="text/css" href="html/css/staticlinksmenu.css" />
<style type="text/css">
.menufixedlinks{
	$%if ITEM.MenuWidth != ''$
		width:$$ITEM.MenuWidth$px;
	$%endif$
	min-height: $$ITEM.MenuHeight$px;

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

	border: $$ITEM.MenuStyle.border$;
	$%if ITEM.MenuStyle.border-width != ''$
		border-width: $$ITEM.MenuStyle.border-width$;
	$%endif$
	$%if ITEM.MenuStyle.border-style != ''$
		border-style: $$ITEM.MenuStyle.border-style$;
	$%endif$
	$%if ITEM.MenuStyle.border-color != ''$
		border-color: $$ITEM.MenuStyle.border-color$;
	$%endif$
	$%if ITEM.MenuStyle.border-top != ''$
		border-color: $$ITEM.MenuStyle.border-top$;
	$%endif$
	$%if ITEM.MenuStyle.border-bottom != ''$
		border-color: $$ITEM.MenuStyle.border-bottom$;
	$%endif$
	$%if ITEM.MenuStyle.border-left != ''$
		border-color: $$ITEM.MenuStyle.border-left$;
	$%endif$
	$%if ITEM.MenuStyle.border-right != ''$
		border-color: $$ITEM.MenuStyle.border-right$;
	$%endif$

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
}

.menufixedlinks ul{
	margin: 0px;
	padding-left: 0px;
}

.menufixedlinks ul ul{
	min-height: 0;
	background: none;
}

.menufixedlinks li{
	text-indent: 0pt;
	margin-left: 0px;
	
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

	background: $$ITEM.MenuItemStyle.background$;
	$%if ITEM.MenuItemStyle.background-color != ''$
		background-color: $$ITEM.MenuItemStyle.background-color$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-image != ''$
		background-image: url($$ITEM.MenuItemStyle.background-image$);
	$%endif$
	$%if ITEM.MenuItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.MenuItemStyle.background-repeat$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-position != ''$
		background-position: $$ITEM.MenuItemStyle.background-position$;
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
}

.menufixedlinks li li{
	border: none;

	$%if ITEM.SubMenuItemStyle.background-color != ''$
		background-color: $$ITEM.SubMenuItemStyle.background-color$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.background-image != ''$
		background-image: url($$ITEM.SubMenuItemStyle.background-image$);
	$%endif$
	$%if ITEM.SubMenuItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.SubMenuItemStyle.background-repeat$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.background-position != ''$
		background-position: $$ITEM.SubMenuItemStyle.background-position$;
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
}

.menufixedlinks .activeMenuLink a {
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

.menufixedlinks a, .menufixedlinks a:active{
	color: $$ITEM.MenuItemStyle.color$;
	padding: $$ITEM.MenuItemStyle.padding$;
	height: $$ITEM.MenuItemHeight$px;
	line-height: $$ITEM.MenuItemHeight$px;
	text-decoration: $$ITEM.MenuItemStyle.text-decoration$;
}

.menufixedlinks a:hover {
	text-decoration: $$ITEM.RolloverStyle.text-decoration$;
	color: $$ITEM.RolloverStyle.color$;

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
	text-decoration: $$ITEM.RolloverStyle.text-decoration$;

	$%if ITEM.RolloverStyle.background-color != ''$
		background-color: $$ITEM.RolloverStyle.background-color$;
	$%endif$
	$%if ITEM.RolloverStyle.background-image != ''$
		background-image: url($$ITEM.RolloverStyle.background-image$);
	$%endif$
	$%if ITEM.RolloverStyle.background-repeat != ''$
		background-repeat: $$ITEM.RolloverStyle.background-repeat$;
	$%endif$
	$%if ITEM.RolloverStyle.background-position != ''$
		background-position: $$ITEM.RolloverStyle.background-position$;
	$%endif$
}

.menufixedlinks li a{
	padding-left: $$ITEM.MenuItemStyle.padding-left$;
}

.menufixedlinks li li a{
	padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 1 + ##ITEM.MenuItemStyle.padding-left#$$%ENDWRITE$px;
}

.menufixedlinks li li li a{
	padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 2 + ##ITEM.MenuItemStyle.padding-left#$$%ENDWRITE$px;
}

.menufixedlinks li li li li a{
	padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 3 + ##ITEM.MenuItemStyle.padding-left#$$%ENDWRITE$px;
}

</style>