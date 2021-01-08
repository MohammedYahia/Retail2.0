// Title: Tigra Tree
// Description: See the demo at url
// URL: http://www.softcomplex.com/products/tigra_menu_tree/
// Version: 1.1
// Date: 11-12-2002 (mm-dd-yyyy)
// Notes: This script is free. Visit official site for further details.

function treeMenuObject (parentId, a_ns, a_name, a_items, a_template, p_cId) {

	this.a_tpl      = a_template;
	this.a_config   = a_items;
	this.a_name     = a_name;
	this.o_root     = this;
	this.a_index    = [];
	this.o_selected = null;
	this.n_depth    = -1;
	this.a_ns       = a_ns;
	
	var o_icone = new Image(),
		o_iconl = new Image();
	o_icone.src = a_template['icon_e'];
	o_iconl.src = a_template['icon_l'];
	a_template['im_e'] = o_icone;
	a_template['im_l'] = o_iconl;
	for (var i = 0; i < 64; i++)
		if (a_template['icon_' + i]) {
			var o_icon = new Image();
			a_template['im_' + i] = o_icon;
			o_icon.src = a_template['icon_' + i];
		}
	
	this.toggle = function (n_id) {	var o_item = this.a_index[n_id]; o_item.open(o_item.b_opened, p_cId); };
	this.select = function (n_id, triggeredByOnclick, p_cId) { return this.a_index[n_id].select(null, triggeredByOnclick, p_cId); };
	this.mout   = function (n_id) { this.a_index[n_id].upstatus(true); };
	this.mover  = function (n_id) { this.a_index[n_id].upstatus(); };

	this.a_children = [];
	for (var i = 0; i < a_items.length; i++)
		new tree_item(this, i, p_cId);

	this.n_id = trees.length;
	trees[this.n_id] = this;
	
	for (var i = 0; i < this.a_children.length; i++) {
		parentObj = document.getElementById(parentId);
		//nasty hack - as this seems to be called multiple times
        if (parentObj.getElementsByTagName('table').length == 0) {
			parentObj.innerHTML = this.a_children[i].init(p_cId) + parentObj.innerHTML;
		}
		
		this.a_children[i].open(null, p_cId);
	}
}
function tree_item (o_parent, n_order, p_cId) {

	this.n_depth  = o_parent.n_depth + 1;
	this.a_config = o_parent.a_config[n_order + (this.n_depth ? 3 : 0)];
	if (!this.a_config) return;

	this.o_root    = o_parent.o_root;
	this.o_parent  = o_parent;
	this.n_order   = n_order;
	this.b_opened  = !this.n_depth;

	this.n_id = this.o_root.a_index.length;
	this.o_root.a_index[this.n_id] = this;
	o_parent.a_children[n_order] = this;

	this.a_children = [];
	for (var i = 0; i < this.a_config.length - 3; i++)
		new tree_item(this, i, p_cId);

	this.get_icon = item_get_icon;
	this.open     = item_open;
	this.select   = item_select;
	this.init     = item_init;

	this.upstatus = item_upstatus;
	this.is_last  = function () { return this.n_order == this.o_parent.a_children.length - 1; };
}

var treeMenuState = new Object();
function item_open (b_close, p_cId) {
	var o_idiv = get_element('i_div' + this.o_root.n_id + '_' + this.n_id);
	if (!o_idiv) return;
	
	if (!o_idiv.innerHTML) {
		var a_children = [];
		for (var i = 0; i < this.a_children.length; i++)
			a_children[i]= this.a_children[i].init(p_cId);
		o_idiv.innerHTML = a_children.join('');
	}
	o_idiv.style.display = (b_close ? 'none' : 'block');
	
	this.b_opened = !b_close;
	var o_jicon = document.images['j_img' + this.o_root.n_id + '_' + this.n_id],
		o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
	if (o_jicon) o_jicon.src = this.get_icon(true);
	if (o_iicon) o_iicon.src = this.get_icon();
	this.upstatus();
}

function loopUpAndSetMenuState(menuId, clickedItem, closing)
{
	var state = "";
	var menuRowId = "";
	var id = clickedItem.id;
	var menuInd = id.substring(5, id.lastIndexOf("_"));
	id = id.substring(id.lastIndexOf("_")+1);
	state = findParentWithIdAttr(clickedItem, menuInd, id);
	//RTC 958143: add to the tree menu state the information of menu item id and row instance
	menuRowId = findParentMenuWithIdAttr(clickedItem);
	treeMenuState[menuId] = state + "_" + menuRowId;
}

function findParentWithIdAttr(elem, menuInd, path)
{
	var localPath = path;
	var prnt = elem.parentNode;
	while (prnt != null && !prnt.id)
	{
		prnt = prnt.parentNode;
	}

	if (prnt != null)
	{
		var parentInd = prnt.id;
		parentInd = parentInd.substring(parentInd.lastIndexOf("_")+1);
		if (parentInd > 0)
		{
			if (localPath.length > 0)
			{
				localPath = "|"+path;
			}
			localPath = parentInd+localPath;
			localPath = findParentWithIdAttr(document.getElementById("i_txt"+menuInd+"_"+parentInd), menuInd, localPath);
		}
	}
	return localPath;
}

//RTC 958143: function to return the menu item id and the current row instance
function findParentMenuWithIdAttr(elem)
{
	var prnt = elem.parentNode;
	var parentInd = prnt.id;
	while (prnt != null && (prnt.id.indexOf("MNU_") == -1) )
	{
		prnt = prnt.parentNode;
	}

	if (prnt != null)
	{
		var parentInd = prnt.id;
	}
	return parentInd;
}

function item_select (b_deselect, triggeredByOnclick, cId) {
	if (this.a_config[2] != "false")
	{
		if (!b_deselect) {
			var o_olditem = this.o_root.o_selected;
			this.o_root.o_selected = this;
			if (o_olditem) o_olditem.select(true);
		}
		var o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
		if (o_iicon) o_iicon.src = this.get_icon();
		var div = get_element('i_txt' + this.o_root.n_id + '_' + this.n_id);
		div.style.fontWeight = b_deselect ? 'normal' : 'bold';
		
		this.upstatus();

		if (div.id.substring(div.id.lastIndexOf("_")+1) != "0") //false for tree root node
		{
			var treeName = this.o_root.a_name;
			loopUpAndSetMenuState(treeName, div);
		}

		if (triggeredByOnclick)
		{
			//Send to server
			var mode = this.a_config[1];
			sendMenuState(treeMenuState, mode, this.o_root.a_ns, cId);
		}
	}
	return Boolean(this.a_config[1]) && this.a_config[2];
}

function item_upstatus (b_clear) {
	window.setTimeout('window.status="' + (b_clear ? '' : this.a_config[0] + (this.a_config[1] ? ' ('+ this.a_config[1] + ')' : '')) + '"', 10);
}

function item_init (p_cId) {
	var a_offset = [],
		o_current_item = this.o_parent;
	for (var i = this.n_depth; i > 1; i--) {
		a_offset[i] = '<img src="' + this.o_root.a_tpl[o_current_item.is_last() ? 'icon_e' : 'icon_l'] + '" border="0" align="absbottom">';
		o_current_item = o_current_item.o_parent;
	}
	
	return '<table cellpadding="0" cellspacing="0" border="0"><tr><td nowrap>' + (this.n_depth ? a_offset.join('') + (this.a_children.length
		? '<a href="javascript: trees[' + this.o_root.n_id + '].toggle(' + this.n_id + ')" onmouseover="trees[' + this.o_root.n_id + '].mover(' + this.n_id + ')" onmouseout="trees[' + this.o_root.n_id + '].mout(' + this.n_id + ')"><img src="' + this.get_icon(true) + '" border="0" align="absbottom" name="j_img' + this.o_root.n_id + '_' + this.n_id + '"></a>'
		: '<img src="' + this.get_icon(true) + '" border="0" align="absbottom">') : '') 
		+ '<a href="#" target="' + this.o_root.a_tpl['target'] + '" onclick="return trees[' + this.o_root.n_id + '].select(' + this.n_id + ', true, \''+p_cId+'\')" ondblclick="trees[' + this.o_root.n_id + '].toggle(' + this.n_id + ')" onmouseover="trees[' + this.o_root.n_id + '].mover(' + this.n_id + ')" onmouseout="trees[' + this.o_root.n_id + '].mout(' + this.n_id + ')" class="t' + this.o_root.n_id + 'i" id="i_txt' + this.o_root.n_id + '_' + this.n_id + '"><img src="' + this.get_icon() + '" border="0" align="absbottom" name="i_img' + this.o_root.n_id + '_' + this.n_id + '" class="t' + this.o_root.n_id + 'im">' + this.a_config[0] + '</a></td></tr></table>' + (this.a_children.length ? '<div id="i_div' + this.o_root.n_id + '_' + this.n_id + '" style="display:none"></div>' : '');
}

function item_get_icon (b_junction) {
	return this.o_root.a_tpl['icon_' + ((this.n_depth ? 0 : 32) + (this.a_children.length ? 16 : 0) + (this.a_children.length && this.b_opened ? 8 : 0) + (!b_junction && this.o_root.o_selected == this ? 4 : 0) + (b_junction ? 2 : 0) + (b_junction && this.is_last() ? 1 : 0))];
}

var trees = [];
get_element = document.all ?
	function (s_id) { return document.all[s_id]; } :
	function (s_id) { return document.getElementById(s_id); };
