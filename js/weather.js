$(document).ready(function() {
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=f8eca089b2dc20d458b0079a2d2dcd13', function(json) {
        
        $(".city").html('<h1>' + json['name'] + '</h1>');  
        $(".temperature").html('<h2>' + Math.floor(json['main'].temp) + '&deg <span id="temp-conversion">F</span></h2>');
        console.log(json['main'].temp);
        $(".result").html(JSON.stringify(json));
      }); 
    });
  } 

  $("#getFlickrResult").on("click", function(){
    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7489f6e27e5cfc416ebe333a830abc1e&tags=one%2C+cloud&content_type=1&media=photos&per_page=50&page=1&format=json&nojsoncallback=1_h', function(json) {
      $(".f-result").html(JSON.stringify(json));
    }); 
  });
});
