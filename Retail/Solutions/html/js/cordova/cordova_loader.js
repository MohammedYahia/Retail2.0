// require this script before your document is done loading
if (!window.edgeCordovaLoaded) {
	//window.edgeCordovaLoaded is a flag used for loading only once the cordova library
	function isWindowsPhone() {
		return navigator.userAgent.match(/Windows Phone/);
	} 
	
	;(function () {
		var isDroid = navigator.userAgent.match(/Android.*edgeConnectSmartHybrid/);
		var isiOS = navigator.userAgent.match(/(iPhone|iPod|iPad).*edgeConnectSmartHybrid/);
		var isWP = isWindowsPhone();
		var droidScripts = [
		"html/js/cordova/cordova_android.js"
		];
		var iosScripts = [
		"html/js/cordova/cordova_ios.js"
		];
		var wpScripts = [
		"html/js/cordova/cordova_wp.js"
		];
		
		if (isDroid) droidScripts.forEach(loadScript);
		if (isiOS) iosScripts.forEach(loadScript);
		if (isWP) wpScripts.forEach(loadScript);
		window.edgeCordovaLoaded = true;
		function loadScript(src) {
			var line = '<script type="text/javascript" charset="utf-8" src="' + src + '"></script>';
			document.writeln(line);
		}
	})();
}
