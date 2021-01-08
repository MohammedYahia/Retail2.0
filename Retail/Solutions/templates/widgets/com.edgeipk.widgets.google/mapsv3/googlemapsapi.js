window.geocoder = null;
window.com = window.com || {};
window.com.edgeipk = window.com.edgeipk || {};
window.com.edgeipk.widgets = window.com.edgeipk.widgets || {};
window.com.edgeipk.widgets.google = window.com.edgeipk.widgets.google || {};

window.com.edgeipk.widgets.google.Map = window.com.edgeipk.widgets.google.Map || {};


window.com.edgeipk.widgets.google.Map = function(instanceid) {
  this._instanceid = instanceid;
  this._map = null;
  this._marker = null;
  this.appZoom=1;
  this.search=false;
  this.sradius=0;
};

var infowindow;

window.com.edgeipk.widgets.google.Map.prototype.setDefaults = function(defaultLong,defaultLat,defaultZoom,enableNav,navStyle,enableMapTypes,initialMapType,mapTypes,mapTypeStyle,disabledClickZoom,draggable) {
  var position = new google.maps.LatLng(0,0);
  var zoom = 2;
  if (defaultLong.length > 0 && defaultLat.length > 0) {
    position = new google.maps.LatLng(1*defaultLat,1*defaultLong);
    zoom = ((defaultZoom==0)?2:defaultZoom);
  }
  var type = google.maps.MapTypeId.ROADMAP;
  if ("HYBRID" == initialMapType) {
    type = google.maps.MapTypeId.HYBRID;
  } else if ("SATELLITE" == initialMapType) {
    type = google.maps.MapTypeId.SATELLITE;
  } else if ("TERRAIN" == initialMapType) {
    type = google.maps.MapTypeId.TERRAIN;
  }
  var typeControlStyle = google.maps.MapTypeControlStyle.DEFAULT;
  if ("DROPDOWN_MENU" == mapTypeStyle) {
    typeControlStyle = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
  } else if ("HORIZONTAL_BAR" == mapTypeStyle) {
    typeControlStyle = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
  }
  var navControlStyle = google.maps.NavigationControlStyle.DEFAULT;
  if ("ANDROID" == navStyle) {
    navControlStyle = google.maps.NavigationControlStyle.ANDROID;
  } else if ("SMALL" == navStyle) {
    navControlStyle = google.maps.NavigationControlStyle.SMALL;
  } else if ("ZOOM_PAN" == navStyle) {
    navControlStyle = google.maps.NavigationControlStyle.ZOOM_PAN;
  }
  var myOptions = {
    zoom: 5,
    center: position,
    mapTypeId: type,
    disableDoubleClickZoom: ("true" == disabledClickZoom),
    draggable: ("true" == draggable),
    navigationControl: ("true" == enableNav),
    navigationControlOptions: {
      style: navControlStyle
    },
    mapTypeControl: ("true" == enableMapTypes),
    mapTypeControlOptions: {
      style: typeControlStyle
    }
  };
  this._map = new google.maps.Map(document.getElementById(this._instanceid + "-gmap"), myOptions);
};

window.com.edgeipk.widgets.google.Map.prototype.setPosition=function(myposition) {
				var that=this;
				var mynewposition = new google.maps.LatLng(myposition.coords.latitude,myposition.coords.longitude);
				//var haslatitude = $("input[id$='DSLatitude']").length > 0 && $("input[id$='DSLatitude']").val().length > 0? true:false;
				var haslatitude = $("#C1__DSLatitude").length > 0 && $("#C1__DSLatitude").val().length > 0? true:false;
				if (!haslatitude){
					//$("input[id$='DSLatitude']").val(mynewposition.lat());
					//$("input[id$='DSLongitude']").val(mynewposition.lng());
					$("#C1__DSLatitude").val(mynewposition.lat());
					$("#C1__DSLongitude").val(mynewposition.lng());
					
					if($("#C1__DSLoadAll").val() != 'Y')
					{
						$("#C1__BUT_SET_LOCATION").trigger('click');
					}

				}
				that._map.setCenter(mynewposition);
					
				if(that.boundsAsRadius !== undefined){
					that._map.fitBounds(convertToBounds(mynewposition, that.boundsAsRadius));
					
				}else {
					that._map.setZoom(that.appZoom);
				}
				
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': mynewposition}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							if (null == that._marker) {							
								that._marker = new google.maps.Marker({
									map: that._map, 
									title: results[1].formatted_address,
									position: mynewposition
								});							
							}
							else {
								that._marker.setPosition(mynewposition);
								that._marker.setTitle(results[1].formatted_address);
							}	
						}
					}		
				else {
				alert("Geocoder failed due to: " + status);
				}});

				if (that.search == "true") {
				
				var request = {
				location: mynewposition,
				radius: 1*that.sradius,
				types: [that.places]
				};
			
				var service;
						
				//that._service = new google.maps.places.PlacesService(that._map);
				
				var windowcontent;

		
				infowindow = new google.maps.InfoWindow();
				
				//that._service.nearbySearch(request, function(results, status) {	
				/*	if (status == google.maps.places.PlacesServiceStatus.OK) {	
					
						for (var i = 0; i < results.length; i++) {
						createMarker(that._map,results[i]);					
						}
					}
				});*/
				var windowcontent;
				infowindow = new google.maps.InfoWindow();
						for (var i = 0; i < that.locations.length; i++) {
						createMarkerLocation(that._map,that.locations[i]);
						
						}
				
				}			
		};


window.com.edgeipk.widgets.google.Map.prototype.getDirections = function (start,end) {
var directionsDisplay=new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom:7,
    center: start
  };
  var map=this._map;
  directionsDisplay.setMap(map);
var directionsService = new google.maps.DirectionsService();
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

window.com.edgeipk.widgets.google.Map.prototype.setLocation = function(appAddress,appLongitude,appLatitude,appZoom,geo,places,locations,sradius,search,boundsAsRadius) {
	
	var gotMarker = false;
	var that = this;
	var appAddressBlank = appAddress.replace(',','').replace(' ','').replace(',','').replace(' ','');
  
	this.appZoom=appZoom;
	this.search=search;
	this.sradius=sradius;
	this.places=places;
	this.boundsAsRadius=boundsAsRadius;
	this.locations=locations; 
	if($("#C1__DSLoadAll").val() == 'Y'){
		for (var i = 0; i < that.locations.length; i++) {	
			createMarkerLocation(that._map,that.locations[i]);
		}
	}
	

	
	if (geo == "true") {
		if(navigator.geolocation) {
			if (appLatitude.length > 0 && appLongitude.length > 0) {
				setMyPositionFromLongAndLat(that, appLatitude, appLongitude);
			}
			else {
				navigator.geolocation.getCurrentPosition( function(myposition){ that.setPosition(myposition)} , function(error) {
					//shouldn't we do some thing like this for error handling
					 switch(error.code) {
				        case error.PERMISSION_DENIED:
				            //alert("Your geolocation / GPS service is inactive. Please enable your geolocation services.");
							document.addEventListener("deviceready", onDeviceReadyDenied, false);
							function onDeviceReadyDenied() {
							function alertDismissed() {}
							navigator.notification.alert(
								'Your geolocation / GPS service is inactive. Please enable your geolocation services.',  // message
								alertDismissed,         // callback
								'Privacy Settings',            // title
								'OK'                  // buttonName
								);
								navigator.vibrate(2000);
								navigator.notification.beep(1);
							}
				            break;
				        case error.POSITION_UNAVAILABLE:
				            document.addEventListener("deviceready", onDeviceReadyUnavailable, false);
							function onDeviceReadyUnavailable() {
							function alertDismissed() {}
							navigator.notification.alert(
								'Your position could not be determined. Please enable your phone geolocation services.',  // message
								alertDismissed,         // callback
								'Privacy Settings',            // title
								'OK'                  // buttonName
								);
								navigator.vibrate(2000);
								navigator.notification.beep(1);
							}
				            break;
				        case error.TIMEOUT:
				            document.addEventListener("deviceready", onDeviceReadyTimeout, false);
							function onDeviceReadyTimeout() {
							function alertDismissed() {}
							navigator.notification.alert(
								'Your geolocation / GPS service has timed-out. Please make sure you have enabled your geolocation services.',  // message
								alertDismissed,         // callback
								'Privacy Settings',            // title
								'OK'                  // buttonName
								);
								navigator.vibrate(2000);
								navigator.notification.beep(1);
							}
				            break;
				        case error.UNKNOWN_ERROR:
				            document.addEventListener("deviceready", onDeviceReadyUnknown, false);
							function onDeviceReadyUnknown() {
							function alertDismissed() {}
							navigator.notification.alert(
								'Unknown error. Please try again.',  // message
								alertDismissed,         // callback
								'Error',            // title
								'OK'                  // buttonName
								);
								navigator.vibrate(2000);
								navigator.notification.beep(1);
							}
				            break;
				    }
					 // this is probably redundant now but what should we do on error - see above
					if (appLatitude.length > 0 && appLongitude.length > 0) {
						setMyPositionFromLongAndLat(appLatitude, appLongitude);
					}
					else {
						// TODO where is this function defined?
						handleNoGeolocation(browserSupportFlag); 
					}
				},{ timeout: 6000 });
			}
		}	
		else {
			alert("You are not existing!");
		}
	}
	
	else {
		if (appAddressBlank.length == 0) {
    // try app long lat
    if (appLatitude.length > 0 && appLongitude.length > 0) {
      gotMarker = true;
      // do nothing
    }
  } else {
    gotMarker = true;
  }
  
  appAddressBlank = appAddress.replace(',','').replace(' ','').replace(',','').replace(' ','');
  if (appAddressBlank.length > 0) {
    // get address real world position
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': appAddress}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
	appLongitude = results[0].geometry.location.lng;
	appLatitude = results[0].geometry.location.lat;

        that._map.setCenter(results[0].geometry.location);
	that._map.setZoom(appZoom);
        if (gotMarker) {
	  if (null == that._marker) {
            that._marker = new google.maps.Marker({
              map: that._map, 
	      title: appAddress,
              position: results[0].geometry.location
            });
	  } else {
	    that._marker.setPosition(results[0].geometry.location);
	    that._marker.setTitle(appAddress);
	  }
	  var mynewposition=results[0].geometry.location;
	  if (search == "true") {	

				var request = {
				location: mynewposition,
				radius: 1*sradius,
				types: [places]
				};
			
				var service;
						
				that._service = new google.maps.places.PlacesService(that._map);
				
				
				// var infowindow;
				var windowcontent;
				infowindow = new google.maps.InfoWindow();
				
				that._service.nearbySearch(request, function(results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
					
					
						for (var i = 0; i < results.length; i++) {	
								console.log(results[i]);
						createMarker(that._map,results[i]);
						
						}
					}
				});
				}
			// (index < locations.length) {	
				var windowcontent;
				infowindow = new google.maps.InfoWindow();
						for (var i = 0; i < locations.length; i++) {	
								console.log(locations[i]);
						createMarkerLocation(that._map,results[i]);
						
						}
					//}
				
				
        }
        //document.getElementById("$$ITEM.ID()$-gmapresult").innerHTML = "";
      } else {
      }
    });
  }
 }
};

function setMyPositionFromLongAndLat(map, appLatitude, appLongitude)
{
	
	var myposition={};myposition.coords={};
	myposition.coords.latitude=appLatitude;
	myposition.coords.longitude=appLongitude;
	map.setPosition(myposition);
}



      function createMarker(map,place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          selectedLocation: place[4]
        });
		iconFile = './templates/widgets/com.edgeipk.widgets.google/mapsv3/images/pin.png'; 
		marker.setIcon(iconFile) 
		
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
          $("input[id$='SELLocation']").val(place[4]);
        });
      };
	  	function createMarkerLocation(map,place) {  
			var i;
		marker = new google.maps.Marker({
        position: new google.maps.LatLng(place[1], place[2]),
        map: map,
		icon: './html/img/maps/'+place[3]+'.png',
        selectedLocation: place[4]
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() { 
		  infowindow.setContent(place[0]);
          infowindow.open(map, marker);
          $("input[id$='SELLocation']").val(marker.selectedLocation);
      }
      })(marker, i));
        };
		
		function GetGeoCode(){
          if (geocoder == null){
           geocoder = new google.maps.Geocoder();
          }
             geocoder.geocode( {'address': $("input[id$='SearchMapInput']").val() }, function(results, status) {
               if (status == google.maps.GeocoderStatus.OK) {

                  var searchLoc = results[0].geometry.location;
               var lat = results[0].geometry.location.lat();
                  var lng = results[0].geometry.location.lng();
                  var latlng = new google.maps.LatLng(lat, lng);
                  var bounds = results[0].geometry.bounds;
  if (bounds){
       window.globalMap.fitBounds(bounds);
      }
           
            }
              });
}


 $(function() {
	 	$("input[id$='SearchMapInput']").autocomplete({
         
           source: function(request, response) {

          if (geocoder == null){
           geocoder = new google.maps.Geocoder();
          }
             geocoder.geocode( {'address': request.term }, function(results, status) {
               if (status == google.maps.GeocoderStatus.OK) {

            	/*Removed as not needed and produces incorrect coordinates i.e. not the selected corodinates but the coordinates of the first result
            	 *returned with  
            	   
                  var searchLoc = results[0].geometry.location;
                  var lat = results[0].geometry.location.lat();
                  var lng = results[0].geometry.location.lng();
                  $("input[id$='DSLatitude']").val(lat);
                  $("input[id$='DSLongitude']").val(lng);
                  $("#C1__DSLatitude").val(lat);
                  $("#C1__DSLongitude").val(lng);
                  var latlng = new google.maps.LatLng(lat, lng);
                  var bounds = results[0].geometry.bounds; */				  
				  
				        if (results[0]) {
                         response($.map(results, function(loc) {
                        return {
                            label  : loc.formatted_address,
                            value  : loc.formatted_address,
                            bounds   : loc.geometry.bounds
                          }
                        }));
                        }

            }
              });
           },
           select: function(event,ui){
      var pos = ui.item.position;
      var lct = ui.item.locType;
      var bounds = ui.item.bounds;
      if($("#C1__DSLoadAll").val() != 'Y')
	  {
    	$("input[id$='MCLatitude']").val('');
    	$("input[id$='MCLongitude']").val('');
    	$("#C1__BUT_SET_LOCATION").trigger('click');
	  }
      /*if($("input[id$='DSLoadAll']").val() != 'Y')
    	  {
    	  	$("button[id$='BUT_SET_LOCATION']").trigger('click');
    	  }
      */
      if (bounds){
       window.globalMap.fitBounds(bounds);
      }
           }
         });
     }); 
 
 function convertToBounds(latLng, radius) {
	  return new google.maps.Circle({center: latLng, radius: radius}).getBounds();
	}
 
 function veiwDetails()
 {
	 $("button[id$='BUT_VIEW_DETAILS']").trigger('click');
 }