Hi.addHook('afterAjaxPOSTRequest',  checkForAuthRedirect);

function checkForAuthRedirect(async, req, ajaxCaller, ns, uid){
  if (req.status == 302){ 	
    if ( req.statusText != "" ) window.location = req.statusText;
    else requestLogoff();
  }
}
function requestTimeout(){
  window.location = "Timeout";
}
function requestLogoff(){
  window.location = "Logoff";
}
function requestChangePassword(){
  window.location = "ChangePassword";
}
function requestResetPassword(){
  window.location = "ResetPassword";
}
function requestMultiTabs(){
  window.location = "html/multiTabs.html"
}
function getContextForPrefix(ctxt) {
	if (!ctxt){
		return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
	}
	return ctxt;
}

function initialiseMultiSessionCheck(interval, expires){
	// This method shouldn't run for Hybird APP
	if(getOSName() == 'Browser'){//If app is opened in browser, this code will execute
		var ctxt = getContextForPrefix(null);
		// We could be conditional - not sure we ever open an extra window etc
		// add a hook so we can remove the local storage flag when we close
		$(window).on('beforeunload onbeforeunload', function(){
			removeStorage(ctxt+"OverallAuthStatus");
		});
		
		validateTabInterval = window.setInterval(validateTab, interval*1000, ctxt, true, expires);
		// if this is valid then update the auth status
		if (validateTab(ctxt, true)){
			updateSessionAuthStatus();
			return true;
		}
    }else{
        return false;
    }
}


function getOSName(){
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if (/android/i.test(userAgent))
	  return 'Android'
	else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
	  return 'iOS'
	else
	  return 'Browser'
 }

function validateTab(ctxt, store, expires) {
	var ctxt = getContextForPrefix(ctxt);
	if (!window.name) {
		/**
		 * it is no more used.
		 * @Math.random() that cannot withstand cryptographic attacks
		*/
		//window.name = Math.random().toString();
		
		var generateArray = new Uint32Array(1);
		var crypto = window.crypto || window.msCrypto;
		var cryptoValue = crypto.getRandomValues(generateArray);
		var generatedNumber = cryptoValue/4294967295;	// let's have a number between 0 and 1
				
		window.name = generatedNumber.toString();
	}
	// Check if we have a stored window name
	var currentLocalStorage = getStorage(ctxt+"OverallAuthStatus");
	if (!currentLocalStorage || window.name === currentLocalStorage) {
		// only store if we have a timer, eg we've properly logged on
		if (store){
			// nothing stored yet or the same - update to this window
			setStorage(ctxt+"OverallAuthStatus", window.name, expires);
		}
	} else if (window.name !== currentLocalStorage) {
		// we have a different tab
		if (store) window.clearTimeout(validateTabInterval);
		requestMultiTabs();
		return false;
	}
	return true;
}
function setSessionAuthStatusLoggingOn(){
	// called from Authentication.ifp, update status to logging on
	sessionStorage.setItem("AuthStatus", "LoggingOn");
}
function updateSessionAuthStatus(){
	if ( sessionStorage && sessionStorage.length > 0 ){
		var authStatus = sessionStorage.getItem("AuthStatus");
		if ( authStatus === "LoggingOn" ){
			// we've completed a logon so update the status
			sessionStorage.setItem("AuthStatus", "LoggedOn");
			return;
		}
		else if ( authStatus === "LoggedOn" ){
			// logged on no problem
			return;
		}
	} 
	// anything else means either no session storage or unrecognisable then just logoff with a message
	// window.location = "TabClosure";
	requestLogoff();
}

function removeStorage(name) {
    try {
        localStorage.removeItem(name);
        localStorage.removeItem(name + '_expiresIn');
    } catch(e) {
        console.log('removeStorage: Error removing key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
        return false;
    }
    return true;
}
function getStorage(key) {
    var now = Date.now();  //epoch time, lets deal only with integer
    // set expiration for storage
    var expiresIn = localStorage.getItem(key+'_expiresIn');
    if (expiresIn===undefined || expiresIn===null) { expiresIn = 0; }

    if (expiresIn < now) {// Expired
        removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch(e) {
            console.log('getStorage: Error reading key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
            return null;
        }
    }
}
function setStorage(key, value, expires) {
    if (expires===undefined || expires===null) {
        expires = (24*60*60);  // default: seconds for 1 day
    } else {
        expires = Math.abs(expires); //make sure it's positive
    }

    var now = Date.now();  //millisecs since epoch time, lets deal only with integer
    var schedule = now + expires*1000; 
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch(e) {
        console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
        return false;
    }
    return true;
}