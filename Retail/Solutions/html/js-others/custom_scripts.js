function newCookie(name,value,days) {
 if (days) {
   var date = new Date();
   date.setTime(date.getTime()+(days*24*60*60*1000));
   var expires = "; expires="+date.toGMTString(); 
 }
 else var expires = "";
   
 document.cookie = name+"="+value+expires+"; path=/"; 
}

function readCookie(name) {
  var cookieName = name + "=";
  var nuller = '';
  if (document.cookie.indexOf(cookieName) == -1)
    return nuller;

  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(cookieName) == 0) return c.substring(cookieName.length,c.length); 
  }
  return null; 
}

function eraseCookie(name) {
//Erasing a cookie is simple. You just need to set its expiry date in the past.
	newCookie(name,"",-1);
}