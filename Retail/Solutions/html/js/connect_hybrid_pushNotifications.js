/*
 * Copyright (c) TEMENOS HEADQUARTERS SA, All rights reserved.
 *
 * This source code is protected by copyright laws and international copyright treaties,
 * as well as other intellectual property laws and treaties.
 *  
 * Alteration, duplication or redistribution of this source code in any form 
 * is not permitted without the prior written authorisation of TEMENOS HEADQUARTERS SA.
 * 
 */

var pushNotification;

// this function must be called only on device ready as the cordova pushNotification plugin can't be used before
function initPushNotification(p_formName) {
	try 
	{ 
		pushNotification = window.plugins.pushNotification;
		console.log("registering " + device.platform);
		
		// try registering the device with the platform specific service in order to obtain an device identification key
		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
			var gcmRegistrationId = localStorage.getItem("GCM_REGISTRATION_ID");
			if (gcmRegistrationId == null) {
				pushNotification.register(successHandler, errorHandler, {"senderID":"@GCM_SENDER_ID@","ecb":"onNotification"}); // required for Android or Amazon devices!
			} else {
				el = document.createElement("input");
				el.type = "text";
				el.name = "GCM_REGISTRATION_ID";
				el.value = gcmRegistrationId
				el.style.display  = "none";
				document.forms[p_formName].appendChild(el);
			}
		} else {
			var deviceToken = localStorage.getItem("APNS_DEVICE_TOKEN");
			if (deviceToken == null) {
				pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"}); // required for iOS devices!
			} else {
				el = document.createElement("input");
				el.type = "text";
				el.name = "APNS_DEVICE_TOKEN";
				el.value = deviceToken
				el.style.display  = "none";
				document.forms[p_formName].appendChild(el);
			}
		}
	}
	catch(err)
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		alert(txt); 
	}
}

// Handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
		console.log("push-notification: " + e.alert);
        // showing an alert also requires the org.apache.cordova.dialogs plugin
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
		// playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

function jsonErrorHandler(e) {
}

// handle GCM notifications for Android
function onNotification(e) {
	console.log("EVENT -> RECEIVED:" + e.event);
    switch( e.event )
    {
        case 'registered': // when the device registration ended
			if ( e.regid.length > 0 )
			{	
				console.log("REGISTERED -> REGID:" + e.regid);
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				localStorage.setItem("GCM_REGISTRATION_ID", e.regid);
			}
			break;
		
        case 'message': // the registration was made before; now a message was received
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	if (e.foreground)
        	{
				console.log("--INLINE NOTIFICATION--");
				// on Android soundname is outside the payload. 
				// On Amazon FireOS all custom attributes are contained within payload
				var soundfile = e.soundname || e.payload.sound;
				// if the notification contains a soundname, play it.
				// playing a sound also requires the org.apache.cordova.media plugin
				var my_media = new Media("/android_asset/www/"+ soundfile);
				my_media.play();
			}
			else
			{// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart)
					console.log("--COLDSTART NOTIFICATION--");
				else
					console.log("--BACKGROUND NOTIFICATION--");
			}
				
			console.log("MESSAGE -> MSG: " + e.payload.message);
            //android only
			console.log("MESSAGE -> MSGCNT: " + e.payload.msgcnt);
            //amazon-fireos only
            console.log("MESSAGE -> TIMESTAMP: " + e.payload.timeStamp);
			break;
        
		case 'error':
			console.log("ERROR -> MSG:" + e.msg);
			break;

		default:
			console.log("EVENT -> Unknown, an event was received and we do not know what it is");
			break;
    }
}

function tokenHandler (result) {
	console.log("token: "+ result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
	localStorage.setItem("APNS_DEVICE_TOKEN", result);
}

function successHandler (result) {
	console.log("success:" + result);
}

function errorHandler (error) {
	console.log("error:" + error);
}
//document.addEventListener("deviceready", function(){initPushNotification()}, true);