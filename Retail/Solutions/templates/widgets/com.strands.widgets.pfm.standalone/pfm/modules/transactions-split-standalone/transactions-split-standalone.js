/**
 * pfm integration loader
 *
 * This is the initial file to require in the html. It configures the standalone-integration and
 * returns this object.
 *
 * @module modules/transactions-split-standalone/transactions-split-standalone-module
 */
define(["integration/integration",
		"utils/util",
		
		"pfm/modules/transactions-split-standalone/transactions-split-standalone-module",
		
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
			"transactions-split-standalone": {
	"id": "transactions-split-standalone",
	"name": "transactions-split-standalone",
	"item": "transactions-split-standalone",
	"type": "module",
	"placeholder": "#sf-transactions-split-standalone-placeholder",
	"module": "transactions-split-standalone",
	"path": "modules/transactions-split-standalone/transactions-split-standalone",
	"itemPath": "modules/transactions-split-standalone/transactions-split-standalone-module"
}
		};
		

		window.pfm = Integration;

		return Integration;
	}
);
