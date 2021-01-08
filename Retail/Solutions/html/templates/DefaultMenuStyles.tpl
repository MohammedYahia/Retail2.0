<style type="text/css">
/** MAIN MENU **/


#$$ITEM.ID()$ .default-menu {
	$%if ITEM.MenuWidth != ''$
		width:$$ITEM.MenuWidth$px;
	$%else$
		width: 100%;
	$%endif$
	$%if ITEM.MenuItemHeight != ''$
		height:$$ITEM.MenuItemHeight$px;
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

	$%if ITEM.MenuStyle.border != ''$
		border: $$ITEM.MenuStyle.border$;
	$%endif$
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

	$%if ITEM.MenuStyle.font != ''$
		font: $$ITEM.MenuStyle.font$;
	$%endif$
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

	$%if ITEM.MenuStyle.margin != ''$
		margin: $$ITEM.MenuStyle.margin$;
	$%endif$
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

#$$ITEM.ID()$  .default-menu li {
	width: $%WRITE ##ITEM.MenuItemWidth# + ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px;
	$%if PRESENTATIONTYPE.LAYOUTDIRECTION == 'rtl'$
        float: right;
	$%else$
        float: left;
	$%endif$
}

* html #$$ITEM.ID()$ .default-menu li {
	width: $$ITEM.MenuItemWidth$px;
}

.menuhoriz li:hover > ul {left:$%WRITE ##ITEM.MenuItemWidth# - 30$$%ENDWRITE$px;} /*30 is padding size*/
.menuhoriz > li:hover > ul {left:-30px;} /*needs to be here so it can override for first level children*/
.menuhoriz > li:hover > ul {top: $%WRITE ##ITEM.MenuItemHeight# - 10$$%ENDWRITE$px;}

#$$ITEM.ID()$ .default-menu li ul li a,
#$$ITEM.ID()$ .default-menu li ul li a:visited {
	border-width:0px $$ITEM.MenuItemStyle.border-width$ $$ITEM.MenuItemStyle.border-width$ $$ITEM.MenuItemStyle.border-width$;
	padding-top:$$ITEM.MenuItemStyle.border-width$;
}

/* a hack so that IE5.5 faulty box model is corrected */
* html #$$ITEM.ID()$  .default-menu a, * html .default-menu a:visited {
	/*STOP WRAPPING!!!!*/
	width: $%WRITE ##ITEM.MenuItemWidth# - 15 - 2 * ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px;
}

/* another hack for IE5.5 */
* html #$$ITEM.ID()$ .default-menu ul ul {
	top: $$ITEM.MenuItemHeight$px; /* menu item height */
}

/* position the third level flyout menu */
#$$ITEM.ID()$ .default-menu ul ul ul {
	left:$$ITEM.MenuItemWidth$px;
	width:$$ITEM.MenuItemWidth$px;
}

#$$ITEM.ID()$ .default-menu a,
#$$ITEM.ID()$ .default-menu a:visited {
	color: $$ITEM.MenuItemStyle.color$;
	text-decoration: $$ITEM.MenuItemStyle.text-decoration$;
	padding-left:15px; /*The width is dependent on this padding*/
	height: $%WRITE ##ITEM.MenuItemHeight# - 2 * ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px;
	line-height: $%WRITE ##ITEM.MenuItemHeight# - 2 * ##ITEM.MenuItemStyle.border-width#$$%ENDWRITE$px;

	$%if ITEM.MenuItemStyle.background-color != ''$
		background-color: $$ITEM.MenuItemStyle.background-color$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-image != ''$
		background-image: url($$ITEM.MenuItemStyle.background-image$);
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


/* retain the hover colors for each sublevel IE7 and Firefox etc */
#$$ITEM.ID()$ .default-menu > li:hover > a {
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

/** SUB MENU **/
#$$ITEM.ID()$ .default-menu li li a,
#$$ITEM.ID()$ .default-menu :hover a {
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

	$%if ITEM.SubMenuItemStyle.border-style != ''$
		border-style: $$ITEM.SubMenuItemStyle.border-style$;
	$%endif$
	$%if ITEM.SubMenuItemStyle.border-color != ''$
		border-color: $$ITEM.SubMenuItemStyle.border-color$;
	$%endif$
}

* html #$$ITEM.ID()$ .default-menu li li a:hover {
	color: $$ITEM.RolloverSubStyle.color$;
	text-decoration: $$ITEM.RolloverSubStyle.text-decoration$;
	position:relative;
	z-index: 10;
	$%if ITEM.RolloverSubStyle.background-color != ''$
		background-color: $$ITEM.RolloverSubStyle.background-color$;
	$%endif$
	$%if ITEM.RolloverSubStyle.background-image != ''$
		background-image: url($$ITEM.RolloverSubStyle.background-image$);
	$%endif$
	$%if ITEM.RolloverSubStyle.background-repeat != ''$
		background-repeat: $$ITEM.RolloverSubStyle.background-repeat$;
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

	$%if ITEM.RolloverSubStyle.border-style != ''$
		border-style: $$ITEM.RolloverSubStyle.border-style$;
	$%endif$
	$%if ITEM.RolloverSubStyle.border-color != ''$
		border-color: $$ITEM.RolloverSubStyle.border-color$;
	$%endif$
}

#$$ITEM.ID()$ .default-menu li :hover > a {
	border-width: $$ITEM.MenuItemStyle.border-width$;
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

	$%if ITEM.RolloverSubStyle.border-style != ''$
		border-style: $$ITEM.RolloverSubStyle.border-style$;
	$%endif$
	$%if ITEM.RolloverSubStyle.border-color != ''$
		border-color: $$ITEM.RolloverSubStyle.border-color$;
	$%endif$
}

#$$ITEM.ID()$ .default-menu .activeMenuLink > a {
	$%if ITEM.SelectedItemStyle.text-decoration != ''$
		text-decoration: $$ITEM.SelectedItemStyle.text-decoration$;
	$%endif$
	$%if ITEM.SelectedItemStyle.color != ''$
		color: $$ITEM.SelectedItemStyle.color$;
	$%endif$

	$%if ITEM.SelectedItemStyle.background != ''$
		background: $$ITEM.SelectedItemStyle.background$;
	$%endif$
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

	$%if ITEM.SelectedItemStyle.font != ''$
		font: $$ITEM.SelectedItemStyle.font$;
	$%endif$
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


/* position the third level flyout menu */
#$$ITEM.ID()$ .default-menu ul ul ul {
	left:$$ITEM.MenuItemWidth$px;
	width:$$ITEM.MenuItemWidth$px;
}

#$$ITEM.ID()$ .default-menu li a:hover ul {
	top: $%WRITE ##ITEM.MenuItemHeight# - 10$$%ENDWRITE$px;
}

#$$ITEM.ID()$ .default-menu li a:hover ul a:hover ul{
	left: $%WRITE ##ITEM.MenuItemWidth# - 50$$%ENDWRITE$px;
}

</style>
