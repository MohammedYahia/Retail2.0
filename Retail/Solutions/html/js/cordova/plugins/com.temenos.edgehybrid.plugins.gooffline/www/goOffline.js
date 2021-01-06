cordova.define("com.temenos.edgehybrid.plugins.gooffline.GoOffline", function(require, exports, module) {
var exec = require('cordova/exec');

module.exports = {

    goOffline : function(success, fail) {
        cordova.exec(success, fail, 'GoOffline', 'goOffline', [ "","" ]);
    }

};
});
