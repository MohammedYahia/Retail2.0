cordova.define("com.temenos.edgehybrid.plugins.spinner.SpinnerDialog", function(require, exports, module) {
var exec = require('cordova/exec');

module.exports = {

    show : function(showMessage, message) {
    	cordova.exec(null, null, 'SpinnerDialog', 'show', [showMessage, message]);
    },

    hide : function(success, fail) {
        cordova.exec(success, fail, 'SpinnerDialog', 'hide', [ "","" ]);
    }

};
});
