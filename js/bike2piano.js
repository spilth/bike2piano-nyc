//var citibikeUrl = "http://citibikenyc.com/stations/json/";
//var pianoUrl = "http://www.singforhope.org/map.json";

var citibikeUrl = "/json/citibike.json";
var pianoUrl = "/json/pianos.json";
var startLat = 40.7276754 
var startLong = -73.9931564

function handleCitiBike(response) {
  stations = response.stationBeanList;
  var length = stations.length;
  var station;
  var image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';

  for (var i = 0; i < length; i++) {
    station = stations[i];

    if (station.statusKey == 1) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(station.latitude, station.longitude),
        map: map,
        title: station.stationName,
        icon: image
      });

      marker.html = "Station: " + station.stationName;

      google.maps.event.addListener(marker, "click", function() {
        infowindow.setContent(this.html);
        infowindow.open(map, this);
      });
    }
  }
}

function handlePianos(response) {
  pianos = response;
  var length = pianos.length;
  var piano;
  var image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png';

  for (var i = 0; i < length; i++) {
    piano = pianos[i];

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(piano.lat, piano.long),
        map: map,
        title: piano.name,
        icon: image
    });
    marker.html = "Piano: " + piano.name;

    google.maps.event.addListener(marker, "click", function() {
      infowindow.setContent(this.html);
      infowindow.open(map, this);
    });

  }
}

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(startLat, startLong),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  var bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);

  infowindow = new google.maps.InfoWindow();

  var transitLayer = new google.maps.TransitLayer();

  $.getJSON(citibikeUrl, function (response) {
    handleCitiBike(response)
  });

  $.getJSON(pianoUrl, function (response) {
    handlePianos(response)
  });

  var control = document.createElement('div'); 
  control.style.padding = '5px';
  map.controls[google.maps.ControlPosition.RIGHT].push(control);

  var transitButton = document.createElement('div');
  transitButton.innerHTML = "Subway Lines";
  transitButton.style.backgroundColor = 'white';
  transitButton.style.borderStyle = 'solid';
  transitButton.style.borderWidth = '1px';
  transitButton.style.padding = '4px';
  transitButton.style.margin = '2px';
  transitButton.style.cursor = 'pointer';
  transitButton.style.textAlign = 'center';
  control.appendChild(transitButton);

  google.maps.event.addDomListener(transitButton, 'click', function() {
    transitLayer.setMap(map);
    bikeLayer.setMap(null);
  });

  var bikeButton = document.createElement('div');
  bikeButton.innerHTML = "Bike Lanes";
  bikeButton.style.backgroundColor = 'white';
  bikeButton.style.borderStyle = 'solid';
  bikeButton.style.borderWidth = '1px';
  bikeButton.style.padding = '4px';
  bikeButton.style.margin = '2px';
  bikeButton.style.cursor = 'pointer';
  bikeButton.style.textAlign = 'center';
  control.appendChild(bikeButton);

  google.maps.event.addDomListener(bikeButton, 'click', function() {
    bikeLayer.setMap(map);
    transitLayer.setMap(null);
  });
}
