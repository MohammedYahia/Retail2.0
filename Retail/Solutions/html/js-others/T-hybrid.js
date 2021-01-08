//This is hook that is called before an AJAX call is performed.
function beforeAjaxPOSTRequest(url, async, parameters, ns, ajaxCaller, req) {
	showProgress();
	return true;
}

// This is hook that is called after making an AJAX call. 
// Note that this hook gets invoked multiple times, hence the logic for req.readyState
function afterAjaxPOSTRequest(async, req, ajaxCaller, ns, uid) {
	if (async) {
		if (req.readyState == 4) { 
			closeProgress();
		}
	} else {
		closeProgress(); 
	}			
	return true;
}

// This is a hook that is called before processing a form submit.
function beforeSubmit () {
	showProgress();
};

// This is a hook that is called when a new page is displayed.
function afterInitForm(ns) {
	document.addEventListener("deviceready", closeProgress, false);
	if ((typeof(window.external) !=='undefined') && (typeof(window.external.notify) !=='undefined')) {
        closeProgress();
    }           		
};

// Shows the progress dialog for hybrid
// Call with a "message" parameter only if you want to display a custom message in the progress dialog.
// You can choose to display the default message or to show no message at all.
// This is the new 5.4.1 version that comes with edgeConnect.
function showProgress(message) {
    // if (navigator.spinnerDialog) {
    if ((typeof(navigator) !=='undefined') && (typeof(navigator.spinnerDialog) !=='undefined')) {            
        if (message) {
            navigator.spinnerDialog.show(true, message);
        } else {
            // Call navigator.spinnerDialog.show(true) if you want to show also a message in the progress dialog.
        	// The message is configured in the hybrid message editor, under the key loading_wait 
            // Call navigator.spinnerDialog.show(false) if you don't want to show any message in the progress dialog
            navigator.spinnerDialog.show(false, null);
        }
    } else {
    	if ((typeof(window.external) !=='undefined') && (typeof(window.external.notify) !=='undefined')) {
            window.external.notify("UNIVERSAL_APPS_SHOW_PROGRESS_NOTIFY"+JSON.stringify({"showMessage":false, "message":message}));
        } else {
            console.log("no navigator.spinnerDialog");
        }
    }
};

// Closes the progess dialog for hybrid
// This is the new 5.4.1 version that comes with edgeConnect.
function closeProgress() {
    //if (navigator.spinnerDialog) {
    if ((typeof(navigator) !=='undefined') && (typeof(navigator.spinnerDialog) !=='undefined')) {            
        navigator.spinnerDialog.hide();
    } else {
    	if ((typeof(window.external) !=='undefined') && (typeof(window.external.notify) !=='undefined')) {
            window.external.notify("UNIVERSAL_APPS_CLOSE_PROGRESS_NOTIFY");
        } else {
            console.log("no navigator.spinnerDialog");
        }
    }
};      

// edgeConnect applies the current focus to the field that triggered the QLR event via its actiondata
// in mobile we would rather it didn't
function afterQLRResetCurrentFocus(p_service, p_element, p_innerOrOuter,
		p_text, p_actionFlag, p_actionData, p_ajaxCaller, p_dElement, ns) {
	var actionData = '' + p_actionData;
	if (actionData.length > 0) {
		var focusIndex = actionData.indexOf('focusOnCurrent(');
		if (focusIndex !== -1) {
			// TODO when the caller function implements the actiondata property
			//then we could use this method of knobbling the focusing - i.e. remove it from the 
			// eval'd string.
			var hookResp = {
				actionData : p_actionData.substring(0, focusIndex),
				continueAfterHook : false
			};
			//focusOncurrent relies on there being a CURRENT_FOCUS variable so lets knobble it
			setVariable('', "CURRENT_FOCUS", null);
			//we still need to set up the focus value however - otherwise the onblur will send us into a tail spin as 
			setUpFocusValue(ns, document.getElementById(p_element));
			// we may need to do this to force the native keyboard to disappear$('#' + p_element).blur();
			return hookResp;
		}
	}
	return true;
}
//This is hook that is called after the question validation. In some cases no AJAX is performed, hence we check here and we show the progress dialog only if there's going to be an AJAX call. 		
function progressAfterAjaxQuestionActionValidation(controllerName, ns, context,
		elem, elemId, disableInput, ignoreErrors, urlParams, sendRequest) {
	var hasUrlParams = urlParams && urlParams.value;
	if (hasUrlParams) {
		//Show the progress dialog only if there's going to be an AJAX call 
		showProgress();
	}
	return true;
};

//This is hook that is called after completing all AJAX calls 
function progressPostProcessResponse() {
	// if after an ajax call we determine that the form is submitting then no need to close the progress spinner
	if(gmode !== "REDISPLAY")
		{
			closeProgress();
		}
	return true;
}

var gmode
//This is hook that is called before processing a form submit. 
function progressBeforeSubmit(ns, mode) {
	gmode = mode;
	showProgress();
	return true;
};
//This is hook that is called when a new page is displayed. 
function progressAfterInitForm(ns) {
	document.addEventListener("deviceready", closeProgress, false);
};

// Shows the progress dialog for hybrid
// Call with a "message" parameter only if you want to display a custom message in the progress dialog.
// You can choose to display the default message or to show no message at all. 
/* Original TCMB version
function showProgress(message) {
	if (navigator.spinnerDialog) {
		if (message) {
			navigator.spinnerDialog.show(true, message);
		} else {

			//Call navigator.spinnerDialog.show(true)  if you want to show also a message in the progress dialog. The message is configured in the hybrid message editor, under the key loading_wait 
			//Call navigator.spinnerDialog.show(false) if you don't want to show any message in the progress dialog

			navigator.spinnerDialog.show(false, null);
		}
	} else {
		console.log("no navigator.spinnerDialog");
	}
};
*/
// Closes the progress dialog for hybrid 
/* Original TCMB version
function closeProgress() {
	if (navigator.spinnerDialog) {
		navigator.spinnerDialog.hide();
	} else {
		console.log("no navigator.spinnerDialog");
	}
};
*/
//	Register our interest in our functions being called by the edgeConnect Hook functions using Hookit  
if (Hi !== 'undefined') {
	Hi.addHook('afterAjaxQuestionActionValidation',	progressAfterAjaxQuestionActionValidation)
	.addHook('postProcessResponses', progressPostProcessResponse)
	.addHook('beforeSubmit', progressBeforeSubmit)
	.addHook('afterInitForm', progressAfterInitForm)
	.addHook("afterAjaxQuestionActionService",	afterQLRResetCurrentFocus)
	.addHook("beforeAjaxButtonActionService", progressBeforeSubmit);
} else {
	log("we were expecting Hookit global variable HI to have been declared please check Hookit has been loaded")
}