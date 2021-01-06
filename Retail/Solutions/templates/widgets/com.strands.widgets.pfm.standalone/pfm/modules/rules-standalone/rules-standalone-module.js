/**
 * Transaction Edit module
 *
 * @module modules/transactions-edit/transactions-edit-module
 */
define([
	"modules/rules/rules-module",
	"utils/util",
	"jQuery"
], function(Rules, util, $) {

	var RulesExt = Rules.extend({
		initialize: function() {
			this._super.apply(this, arguments);
			this.moduleContainer = $("#sf-rules-module-placeholder");
			this.contextConfig.$popupContainer = $("#sf-rules-module-placeholder");

		},

		_cancel: function () {
			this.trigger("cancel");
			this.publish("backToTransaction");
		}


	}, {
		ID: "rules-standalone"
	});
	RulesExt.type = "module";
	RulesExt.itemId = "rules-standalone";
	RulesExt.id = "rules-standalone";
	return RulesExt;

});
