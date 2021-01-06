/**
 * pfm integration loader
 *
 * This is the initial file to require in the html. It configures the standalone-integration and
 * returns this object.
 *
 * @module modules/rules-standalone/rules-standalone-module
 */
define(["integration/integration",
		"utils/util",
		
		"pfm/modules/rules-standalone/rules-standalone-module",
		
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
			"rules-standalone": {
	"id": "rules-standalone",
	"name": "rules-standalone",
	"item": "rules-standalone",
	"type": "module",
	"placeholder": "#sf-rules-standalone-placeholder",
	"module": "rules-standalone",
	"path": "modules/rules-standalone/rules-standalone",
	"itemPath": "modules/rules-standalone/rules-standalone-module"
}
		};
		

		window.pfm = Integration;

		return Integration;
	}
);
