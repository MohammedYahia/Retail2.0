<link rel="stylesheet" media="all" type="text/css" href="html/css/verticalmenu.css" />
<style type="text/css">
/** MAIN MENU **/
.menuvert {
	position:relative;
	z-index: 10;
	min-height: $$ITEM.MenuMinHeight$px;
	$%if ITEM.MenuItemWidth != ''$
		width: $%WRITE ##ITEM.MenuItemWidth# + ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px; /* width + (borderwidth x 2) */
	$%endif$

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
		border-top: $$ITEM.MenuStyle.border-top$;
	$%endif$
	$%if ITEM.MenuStyle.border-bottom != ''$
		border-bottom: $$ITEM.MenuStyle.border-bottom$;
	$%endif$
	$%if ITEM.MenuStyle.border-left != ''$
		border-left: $$ITEM.MenuStyle.border-left$;
	$%endif$
	$%if ITEM.MenuStyle.border-right != ''$
		border-right: $$ITEM.MenuStyle.border-right$;
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

.menuvert ul {
	$%if ITEM.MenuItemWidth != ''$
		width: $%WRITE ##ITEM.MenuItemWidth# + 2*##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px; /* width + (borderwidth x 2) */
	$%endif$
}

/** MAIN MENU **/
.menuvert ul li {
	height: $%WRITE ##ITEM.MenuItemHeight# + ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px;
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
}

/** MAIN MENU **/
/* style the links */
.menuvert a, .menuvert a:visited {
	height: $$ITEM.MenuItemHeight$px;
	line-height: $$ITEM.MenuItemHeight$px;
	width: $%WRITE ##ITEM.MenuItemWidth# - ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px;
	color: $$ITEM.MenuItemStyle.color$;
	text-decoration: $$ITEM.MenuItemStyle.text-decoration$;
	
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

	border: $$ITEM.MenuItemStyle.border$;
	$%if ITEM.MenuItemStyle.border-width != ''$
		border-width: $$ITEM.MenuItemStyle.border-width$;
	$%endif$
	$%if ITEM.MenuItemStyle.border-style != ''$
		border-style: $$ITEM.MenuItemStyle.border-style$;
	$%endif$
	$%if ITEM.MenuItemStyle.border-color != ''$
		border-color: $$ITEM.MenuItemStyle.border-color$;
	$%endif$
}

/** MAIN MENU **/
/* hack for IE5.5 */
* html .menuvert a, * html .menuvert a:visited {
	width: $$ITEM.MenuItemWidth$px;
}

/** MAIN MENU **/
/* style the link hover IE6 */
* html .menuvert a:hover {
	color: $$ITEM.RolloverStyle.color$;
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

	$%if ITEM.RolloverStyle.border-style != ''$
		border-style: $$ITEM.RolloverStyle.border-style$;
	$%endif$
	$%if ITEM.RolloverStyle.border-color != ''$
		border-color: $$ITEM.RolloverStyle.border-color$;
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

/* retain the hover colors for each sublevel IE7 and Firefox etc */
.menuvert > ul > li:hover > a {
	color: $$ITEM.RolloverStyle.color$;
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

	bbborder: $$ITEM.RolloverStyle.border$;
	$%if ITEM.RolloverStyle.border-width != ''$
		bbborder-width: $$ITEM.RolloverStyle.border-width$;
	$%endif$
	$%if ITEM.RolloverStyle.border-style != ''$
		border-style: $$ITEM.RolloverStyle.border-style$;
	$%endif$
	$%if ITEM.RolloverStyle.border-color != ''$
		border-color: $$ITEM.RolloverStyle.border-color$;
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

/** SUB MENU **/
/* hide the sub levels and give them a positon absolute so that they take up no room */
.menuvert li ul {
	left:$%WRITE ##ITEM.MenuItemWidth# - 50$$%ENDWRITE$px; /*Main Menu width - 30(padding) - 20(overlap) */
}

.menuvert li li a {
	color: $$ITEM.SubMenuItemStyle.color$;
	text-decoration: $$ITEM.SubMenuItemStyle.text-decoration$;

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

	$%if ITEM.SubMenuItemStyle.border-width != ''$
		bbborder: $$ITEM.SubMenuItemStyle.border$;
		bbborder-width: $$ITEM.SubMenuStyle.border-width$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.border-style != ''$
		border-style: $$ITEM.SubMenuItemStyle.border-style$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.border-color != ''$
		border-color: $$ITEM.SubMenuItemStyle.border-color$;
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

* html .menuvert li li a:hover {
	color: $$ITEM.RolloverSubStyle.color$;
	text-decoration: $$ITEM.RolloverSubStyle.text-decoration$;
	
	$%if ITEM.RolloverSubStyle.background-color != ''$
		background-color: $$ITEM.RolloverSubStyle.background-color$;
	$%endif$
	$%if ITEM.RolloverSubStyle.background-image != ''$
		background-image: url($$ITEM.RolloverSubStyle.background-image$);
	$%endif$
	$%if ITEM.RolloverSubStyle.background-repeat != ''$
		background-repeat: $$ITEM.RolloverSubStyle.background-repeat$;
	$%endif$
	$%if ITEM.RolloverSubStyle.background-position != ''$
		background-position: $$ITEM.RolloverSubStyle.background-position$;
	$%endif$

	$%if ITEM.RolloverSubStyle.border != ''$
		bbborder: $$ITEM.RolloverSubStyle.border$;
		bbborder-width: $$ITEM.RolloverSubStyle.border-width$;
	$%endif$
	$%if ITEM.RolloverSubStyle.border-style != ''$
		border-style: $$ITEM.RolloverSubStyle.border-style$;
	$%endif$
	$%if ITEM.RolloverSubStyle.border-color != ''$
		border-color: $$ITEM.RolloverSubStyle.border-color$;
	$%endif$

	font: $$ITEM.RolloverSubStyle.font$;
	$%if ITEM.RolloverSubStyle.font-weight != ''$
		font-weight: $$ITEM.RolloverSubStyle.font-weight$;
	$%endif$
	$%if ITEM.RolloverSubStyle.font-family != ''$
		font-family: $$ITEM.RolloverSubStyle.font-family$;
	$%endif$
	$%if ITEM.RolloverSubStyle.font-size != ''$
		font-size: $$ITEM.RolloverSubStyle.font-size$;
	$%endif$
	$%if ITEM.RolloverSubStyle.font-style != ''$
		font-style: $$ITEM.RolloverSubStyle.font-style$;
	$%endif$
}

.menuvert li :hover > a {
	color: $$ITEM.RolloverSubStyle.color$;
	text-decoration: $$ITEM.RolloverSubStyle.text-decoration$;
	
	$%if ITEM.RolloverSubStyle.background-color != ''$
		background-color: $$ITEM.RolloverSubStyle.background-color$;
	$%endif$
	$%if ITEM.RolloverSubStyle.background-image != ''$
		background-image: url($$ITEM.RolloverSubStyle.background-image$);
	$%endif$
	$%if ITEM.RolloverSubStyle.background-repeat != ''$
		background-repeat: $$ITEM.RolloverSubStyle.background-repeat$;
	$%endif$
	$%if ITEM.RolloverSubStyle.background-position != ''$
		background-position: $$ITEM.RolloverSubStyle.background-position$;
	$%endif$

	$%if ITEM.RolloverSubStyle.border != ''$
		bbborder: $$ITEM.RolloverSubStyle.border$;
		bbborder-width: $$ITEM.RolloverSubStyle.border-width$;
	$%endif$
	$%if ITEM.RolloverSubStyle.border-style != ''$
		border-style: $$ITEM.RolloverSubStyle.border-style$;
	$%endif$
	$%if ITEM.RolloverSubStyle.border-color != ''$
		border-color: $$ITEM.RolloverSubStyle.border-color$;
	$%endif$

	font: $$ITEM.RolloverSubStyle.font$;
	$%if ITEM.RolloverSubStyle.font-weight != ''$
		font-weight: $$ITEM.RolloverSubStyle.font-weight$;
	$%endif$
	$%if ITEM.RolloverSubStyle.font-family != ''$
		font-family: $$ITEM.RolloverSubStyle.font-family$;
	$%endif$
	$%if ITEM.RolloverSubStyle.font-size != ''$
		font-size: $$ITEM.RolloverSubStyle.font-size$;
	$%endif$
	$%if ITEM.RolloverSubStyle.font-style != ''$
		font-style: $$ITEM.RolloverSubStyle.font-style$;
	$%endif$
}

.menuvert .activeMenuLink > a {
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

</style>
