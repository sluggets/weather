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
      $(".windspeed").html('<h2>WIND ' + Math.floor(jzon['wind'].speed) + 'MPH ' + degreesToDirection(jzon['wind'].deg) + ' <i class="wi wi-wind wi-from-' + card + '"></i></h2>');
      $(".city").append('<h2><i id="w-icon" class="wi wi-owm-' + jzon['weather'][0].id + '"></i></h2>');

      // this determines the size of photo to get from flickr
      // and also the orientation that we need eg. landscape vs portrait
      var intVPWidth = window.innerWidth;
      var intVPHeight = window.innerHeight;
      // this weather icon variable will determine the photo search values
      var owIconID = jzon['weather'][0].icon; 

      // uses viewport width and height to determine portrait
      // or landscape. open weather icon id will determine what
      // keywords to search flickr for. returns photo url for background
      displayWeatherPhoto(intVPWidth, intVPHeight, owIconID);
    });

  } 


  $("#getFlickrResult").on("click", function(){
    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7489f6e27e5cfc416ebe333a830abc1e&tags=one%2C+cloud&content_type=1&media=photos&per_page=50&page=1&format=json&nojsoncallback=1_h', function(json) {
      //$(".f-result").html(JSON.stringify(json));
      console.log(json['photos']['photo']);
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

// adds to the DOM appropriate photo background
// also attributes flickr user on the page
function displayWeatherPhoto(intVPWidth, intVPHeight, owIconID)
{
    if (intVPWidth < intVPHeight)
    {
      var orientation = "portrait";
    }
    else    
    {
      var orientation = "landscape";
    }

    var flickrAPI = 'https://api.flickr.com/services/rest/'; 
    
    var tagString = owIconIdSwitch(owIconID);

    $.getJSON(flickrAPI, {
      "method"        :"flickr.photos.search",
      "api_key"       :"7489f6e27e5cfc416ebe333a830abc1e",
      "tags"          : tagString,
      "license"       :"1,2,3,4,5,6,7,8",
      "extras"        :"o_dims,url_l,url_m,license",
      "content_type"  :"1",
      "media"         :"photos",
      "per_page"      :"50",
      "page"          :"1",
      "format"        :"json",
      "nojsoncallback":"1"}, function(json) {
      //var photoArr = json['photos']['photo'];
      var arrLength =  json['photos']['photo'].length;   
      var filteredSet = json['photos']['photo'].filter(function(obj) {
            if (orientation == 'landscape')
            {
              if (obj.url_l || obj.url_m)
              {
                return (obj.o_width > obj.o_height)
              }
            }
            else
            {
              if (obj.url_l || obj.url_m)
              {
                return (obj.o_width < obj.o_height)
              }
            }

        });
        var ranNum = getRandomIntInclusive(0, filteredSet.length - 1)
        var flickrObj = filteredSet[ranNum];
        var licenseNum = flickrObj["license"];
        
        if (flickrObj['url_l'])
        {
          var imgUrl = "url(" + flickrObj['url_l'] + ")";
        }
        else if (flickrObj['url_m'])
        {
          var imgUrl = "url(" + flickrObj['url_m'] + ")";
          console.log(flickrObj['url_m']);
        }
        else
        {
          var imgUrl = "url(https://pixabay.com/static/uploads/photo/2016/01/05/12/15/sky-1122414_960_720.jpg)"; 
        }
        
        $("body").css("background-image", imgUrl);

        flickrUsr = flickrObj['owner'];  
        console.log(flickrUsr);
        appendAttribution(flickrUsr);
        appendLicense(licenseNum);
      });       
}

// uses a switch to build a tags string loosely
// based off of OpenWeather Icon descriptors
function owIconIdSwitch(owIconID)
{
  var tagString;
  switch (owIconID)
  {
    case "01d":
      tagString = 'clear,sunny,sky'; 
      break;
    case "01n":
      tagString = 'starry,night';  
      break;
    case "02d":
    case "03d":
    case "04d":
      tagString = 'cloudy,sky,clouds';
      break;
    case "02n":
    case "03n":
    case "04n":
      tagString = 'nighttime,night,clouds,cloudy';
      break;
    case "09d":
    case "10d":
      tagString = 'rainy,day,showers,rain';
      break;
    case "09n":
    case "10n":
      tagString = 'rainy,night,nightime,rain';
      break;
    case "13d":
    case "13n":
      tagString = 'snow,snowy,snowing';
      break;
    case "50d":
    case "50n":
      tagString = 'mist,fog,foggy,misty';
      break;
    default:
      tagString = 'skyline, sky'; 
      break;
  } 

  return tagString;
}

// grabs a random value given a minimum
// and a maximum
function getRandomIntInclusive(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// appends license info to page
function appendLicense(licenseNum)
{
  var flickrAPI = 'https://api.flickr.com/services/rest/'; 

  $.getJSON(flickrAPI, {
    "method"        :"flickr.photos.licenses.getInfo",
    "api_key"       :"7489f6e27e5cfc416ebe333a830abc1e",
    "format"        :"json",
    "nojsoncallback":"1"}, function(json) {
      var filteredLicense = json['licenses']['license'].filter(function(obj) 
      {
        return obj.id == licenseNum; 
      });
      $(".att-license").append('<p><a href="' + filteredLicense[0]['url'] + '">' + filteredLicense[0]['name'] + '</a><p>');
    
  });
  
}

// appends flickr user credit to page
function appendAttribution(flickrUsr)
{
  var flickrAPI = 'https://api.flickr.com/services/rest/'; 

  $.getJSON(flickrAPI, {
    "method"        :"flickr.people.getInfo",
    "user_id"            : flickrUsr,
    "api_key"       :"7489f6e27e5cfc416ebe333a830abc1e",
    "format"        :"json",
    "nojsoncallback":"1"}, function(json) {
      $(".att-license").append('<p>Photo by: <a href="' + json['person']['profileurl']['_content'] + '">' + json['person']['username']['_content'] + '</a></p>');
    console.log(json);
    
  });

}
