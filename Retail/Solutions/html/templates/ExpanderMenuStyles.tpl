<link rel="stylesheet" media="all" type="text/css" href="html/css/expandermenu.css" />
<style type="text/css">
.leftMenu {
	$%if ITEM.MenuWidth != ''$
		width:$$ITEM.MenuWidth$px;
	$%endif$
	min-height: $$ITEM.MenuMinHeight$px;
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

/*Expanded MI*/
.leftMenu li a { 
	height: $$ITEM.MenuItemHeight$px;
	line-height: $$ITEM.MenuItemHeight$px;
	color: $$ITEM.ExpandedItemStyle.color$;
	padding: $$ITEM.CollapsedItemStyle.padding$;
	$%if ITEM.CollapsedItemStyle.padding-right != ''$
		padding-right: $$ITEM.CollapsedItemStyle.padding-right$;
	$%endif$
	$%if ITEM.CollapsedItemStyle.padding-top != ''$
		padding-top: $$ITEM.CollapsedItemStyle.padding-top$;
	$%endif$
	$%if ITEM.CollapsedItemStyle.padding-bottom != ''$
		padding-bottom: $$ITEM.CollapsedItemStyle.padding-bottom$;
	$%endif$

	$%if ITEM.ExpandedItemStyle.background-color != ''$
		background-color: $$ITEM.ExpandedItemStyle.background-color$;
	$%endif$
	$%if ITEM.ExpandedItemStyle.background-image != ''$
		background-image: url($$ITEM.ExpandedItemStyle.background-image$);
	$%endif$
	$%if ITEM.ExpandedItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.ExpandedItemStyle.background-repeat$;
	$%endif$
	/*
	$%if ITEM.ExpandedItemStyle.background-position != ''$
		background-position: $$ITEM.ExpandedItemStyle.background-position$;
	$%endif$
	*/
	font: $$ITEM.ExpandedItemStyle.font$;
	$%if ITEM.ExpandedItemStyle.font-weight != ''$
		font-weight: $$ITEM.ExpandedItemStyle.font-weight$;
	$%endif$
	$%if ITEM.ExpandedItemStyle.font-family != ''$
		font-family: $$ITEM.ExpandedItemStyle.font-family$;
	$%endif$
	$%if ITEM.ExpandedItemStyle.font-size != ''$
		font-size: $$ITEM.ExpandedItemStyle.font-size$;
	$%endif$
}

.leftMenu li div { 
 font-size: $$ITEM.MenuItemStyle.font-size$;
}

.leftMenu li a:hover {
	color: $$ITEM.RolloverStyle.color$;
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
}

.leftMenu li.collapsed a {
	color: $$ITEM.CollapsedItemStyle.color$;
	$%if ITEM.CollapsedItemStyle.background-color != ''$
		background-color: $$ITEM.CollapsedItemStyle.background-color$;
	$%endif$
	$%if ITEM.CollapsedItemStyle.background-image != ''$
		background-image: url($$ITEM.CollapsedItemStyle.background-image$);
	$%endif$
	$%if ITEM.CollapsedItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.CollapsedItemStyle.background-repeat$;
	$%endif$
	$%if ITEM.CollapsedItemStyle.background-position != ''$
		background-position: $$ITEM.CollapsedItemStyle.background-position$;
	$%endif$
	
	font: $$ITEM.CollapsedItemStyle.font$;
	$%if ITEM.CollapsedItemStyle.font-weight != ''$
		font-weight: $$ITEM.CollapsedItemStyle.font-weight$;
	$%endif$
	$%if ITEM.CollapsedItemStyle.font-family != ''$
		font-family: $$ITEM.CollapsedItemStyle.font-family$;
	$%endif$
	$%if ITEM.CollapsedItemStyle.font-size != ''$
		font-size: $$ITEM.CollapsedItemStyle.font-size$;
	$%endif$
}

.leftMenu li.collapsed a:hover {
	color: $$ITEM.RolloverStyle.color$;
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
}

/*must be here to override above styles for leaf nodes*/
.leftMenu li a.leafNode {
	color: $$ITEM.MenuItemStyle.color$;
	$%if ITEM.MenuItemStyle.background-color != ''$
		background-color: $$ITEM.MenuItemStyle.background-color$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-image != ''$
		background-image: url($$ITEM.MenuItemStyle.background-image$);
	$%else$
		background-image: none;
	$%endif$
	$%if ITEM.MenuItemStyle.background-repeat != ''$
		background-repeat: $$ITEM.MenuItemStyle.background-repeat$;
	$%endif$
	$%if ITEM.MenuItemStyle.background-position != ''$
		background-position: $$ITEM.MenuItemStyle.background-position$;
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
}

.leftMenu li a.leafNode:hover {
	color: $$ITEM.RolloverStyle.color$;
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
}

.leftMenu .activeMenuLink > div > a {
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

/* Background positions and paddings */
.leftMenu ul li a {
 padding-left: $$ITEM.MenuItemIndentation$px;/*indentation x2 (might be indentation x 1 + imagewidth...) */
}
.leftMenu ul ul li a {
 padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 2$$%ENDWRITE$px; /*indentation x3 */
 background-position: $%WRITE ##ITEM.MenuItemIndentation# + 4$$%ENDWRITE$px 50%; /*First value (14px) should be the indentation plus the width of the image*/
}
.leftMenu ul ul ul li a {
 padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 3$$%ENDWRITE$px; /*indentation x4 */
 background-position: $%WRITE ##ITEM.MenuItemIndentation# * 2 + 4$$%ENDWRITE$px 50%; /*First value (24px) should be the indentation*2 plus the width of the image*/
}
.leftMenu ul ul ul ul li a {
 padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 4$$%ENDWRITE$px; /*indentation x5 */
 background-position: $%WRITE ##ITEM.MenuItemIndentation# * 3 + 4$$%ENDWRITE$px 50%; /*First value (34px) should be the indentation*3 plus the width of the image*/
}
.leftMenu ul ul ul ul ul li a {
 padding-left: $%WRITE ##ITEM.MenuItemIndentation# * 5$$%ENDWRITE$px; /*indentation x6 */
 background-position: $%WRITE ##ITEM.MenuItemIndentation# * 4 + 4$$%ENDWRITE$px 50%; /*First value (44px) should be the indentation plus the width of the image*/
}
</style>