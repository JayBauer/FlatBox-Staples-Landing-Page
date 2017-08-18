const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 33
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f2e5d4"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5dac6"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5c6c6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e4d7c6"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fbfaf7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#acbcc9"
      }
    ]
  }
];

// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
    result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
      return entities[char];
    });
    result += strings[i];
  }
  return result;
}

function initMap() {
  var locations = getData('assets/etc/stores.csv');

  var markers = new Array();
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(43.6567919, -79.4609316),
    styles: mapStyle
  });

  const apiKey = 'AIzaSyD6AMIeEo4FM3c83_SDX1OTAmGDYyXWNmE';
  const infoWindow = new google.maps.InfoWindow();

  var currentLocation;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      var currentLocationMark = new google.maps.Marker({
        id:-1,
        position:currentLocation,
        map:map,
        title:'You are here',
        icon:'assets/images/map/marker-yellow.png'
      });
      var content = `You are here.`;
      google.maps.event.addListener(currentLocationMark, 'click', (function (currentLocationMark, i) {
        return function() {
          infoWindow.setContent(content);
          infoWindow.open(map, currentLocationMark);
          map.setCenter(currentLocation);
        }
      })(currentLocationMark, -1));
      infoWindow.setContent(content);
      infoWindow.open(map, currentLocationMark);
      map.setCenter(currentLocation);
      map.setZoom(11);
      $('#map-locator p').replaceWith('<p>You have been successfully located!</p>');
    });
  }

  for (var i = 0; i < locations.length; i++) {
    const val = locations[i];
    const uuid = val[0];
    const lat = val[1];
    const lng = val[2];
    const name = val[3];
    const address = val[4];
    const city = val[5];
    const province = val[6];
    const postal = val[7];
    const phone = val[8];
    const position = new google.maps.LatLng(lat,lng);

    var directions = 'https://www.google.com/maps/dir/?api=1&destination='+lat+','+lng;
    if (!navigator.geolocation) {
      directions += '&origin=';
    }
    const content = sanitizeHTML`
      <div class="map-infoWindow">
        <p><i class="fa fa-home"></i><b>Address:</b><br />${name}<br />${address}<br />${city} ${province}</p>
        <p><i class="fa fa-phone"></i><b>Phone:</b> ${phone}</p>
        <p><a href="${directions}" target="_blank"><i class="fa fa-arrow-right"></i> <b>Directions</b></a></p>
        <!--<p><img src="https://maps.googleapis.com/maps/api/streetview?size=150x120&location=${lat},${lng}&key=${apiKey}"></p>-->
      </div>
    `;

    const listItem = sanitizeHTML`
      <b>${name}</b><br />
      <i class="fa fa-home"></i><span><b>Address:</b> ${address}, ${city}, ${province} ${postal}</span><br />
      <i class="fa fa-phone"></i><span><b>Phone:</b> ${phone}</span><br />
      <i class="fa fa-arrow-right"><span></i><a href="${directions}" target="_blank">Directions</a></span>
    `;
    $('#map-panel ul').append('<li class="marker-link" data-markerid="'+uuid+'" href="#">'+listItem+'</li>');

    const marker = new google.maps.Marker({
      id:uuid,
      position:position,
      map:map,
      title:name,
      icon:"assets/images/map/marker-blue.png"
    });
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function() {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
        map.setCenter(position);
      }
    })(marker, i));
    markers.push(marker);
  }

  $('.marker-link').on('click', function () {
    google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
    return false;
  });
}

window.initMap = initMap;
