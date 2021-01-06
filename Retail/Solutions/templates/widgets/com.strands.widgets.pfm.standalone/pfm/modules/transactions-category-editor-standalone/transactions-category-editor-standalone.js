/**
 * pfm integration loader
 *
 * This is the initial file to require in the html. It configures the standalone-integration and
 * returns this object.
 *
 * @module modules/transactions-category-editor-standalone/transactions-category-editor-standalone-module
 */
define(["integration/integration",
		"utils/util",
		
		"pfm/modules/transactions-category-editor-standalone/transactions-category-editor-standalone-module",
		
		// other generic files
		"Handlebars",
		"utils/ajax-config",
		"css!ui/css/strands-core"],
	function (Integration, util) {
		Integration["version"] = "6.9.0-SNAPSHOT";
		Integration.dependencies = {
	"strands-ui": "git+ssh://git@stash.strands.com:7999/sf/strands-ui.git#develop"
};
		Integration.config = util.extend({}, Integration.config, {
	"environment": {
		"contextPath": "/api"
	}
});
		Integration.config.projectId = "pfm";
		
		Integration.config.modules = {
			"transactions-category-editor-standalone": {
	"id": "transactions-category-editor-standalone",
	"name": "transactions-category-editor-standalone",
	"item": "transactions-category-editor-standalone",
	"type": "module",
	"placeholder": "#sf-transactions-category-editor-standalone-placeholder",
	"module": "transactions-category-editor-standalone",
	"path": "pfm/modules/transactions-category-editor-standalone/transactions-category-editor-standalone",
	"itemPath": "pfm/modules/transactions-category-editor-standalone/transactions-category-editor-standalone-module"
}
		};
		

		window.pfm = Integration;

		return Integration;
	}
);
