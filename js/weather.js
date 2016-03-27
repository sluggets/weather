$(document).ready(function() {
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      /*$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=f8eca089b2dc20d458b0079a2d2dcd13', function(json) {
        
        $(".city").html('<h1>' + json['name'] + '</h1>');  
        $(".temperature").html('<h2>' + Math.floor(json['main'].temp) + '&deg <span id="temp-conversion">F</span></h2>');
        $(".description").html('<h2>' + json['weather'][0].description + '</h2>');
        console.log(json['main'].temp);
        $(".result").html(JSON.stringify(json));
      });*/ 
      // ALL OF THE BELOW WILL NEED TO GO INTO THE API CALL ABOVE WHEN DONE
      var jzon = {"coord":{"lon":-90.58,"lat":41.52},"weather":[{"id":701,"main":"Mist","description":"mist","icon":"50d"}],"base":"cmc stations","main":{"temp":40.96,"pressure":1015,"humidity":81,"temp_min":39.2,"temp_max":42.8},"wind":{"speed":12.75,"deg":280,"gust":9.8},"clouds":{"all":90},"dt":1459083660,"sys":{"type":1,"id":991,"message":0.0043,"country":"US","sunrise":1459079514,"sunset":1459124602},"id":4853423,"name":"Davenport","cod":200}
      $(".city").html('<h1>' + jzon['name'].toUpperCase() + '</h1>');  
      $(".temperature").html('<h2>' + Math.floor(jzon['main'].temp) + '&deg <span id="temp-conversion">F</span></h2>');
      $(".description").html('<h2>' + jzon['weather'][0].description.toUpperCase() + '</h2>');
      $(".humidity").html('<h2>HUMIDITY ' + jzon['main'].humidity + '%</h2>');
      var card = degreesToDirection(jzon['wind'].deg).toLowerCase();
      $(".windspeed").html('<h2>WIND ' + Math.floor(jzon['wind'].speed) + 'MPH ' + degreesToDirection(jzon['wind'].deg) + '<span id="w-di"><i class="wi wi-wind wi-from-' + card + '"></i></span></h2>');
      $(".city").append('<h2><i id="w-icon" class="wi wi-owm-' + jzon['weather'][0].id + '"></i></h2>');
    });
  } 

  $("#getFlickrResult").on("click", function(){
    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7489f6e27e5cfc416ebe333a830abc1e&tags=one%2C+cloud&content_type=1&media=photos&per_page=50&page=1&format=json&nojsoncallback=1_h', function(json) {
      $(".f-result").html(JSON.stringify(json));
    }); 
  });
});

/* function from stackoverflow
 http://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words*/
function degreesToDirection(degrees)
{
  var val = Math.floor((degrees / 22.5) + 0.5);
  var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
             "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
} 
