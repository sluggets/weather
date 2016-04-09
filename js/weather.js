$(document).ready(function() {
  
  // display zip code entry in case user denies
  // geolocation permission or ignores it
  $(".zip-entry").css("display", "block");

  // if geolocation is accepted by user/availabe, use it!
  if (navigator.geolocation)
  {
    // passes geo coordinates to OpenWeather API
    navigator.geolocation.getCurrentPosition(function(position) {
      $(".zip-entry").css("display", "none");
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      displayWeather(lat, lon);
    });

  } 
  else
  {
    // browser doesn't support geolocation
    $(".zip-entry").css("display", "block");
  }

  $(document).on('click', '#temp-conversion', function() {
    var currentTemp =  document.getElementById("temp").textContent;
    var tempType = document.getElementById("temp-conversion").textContent;

    fahrToCel(tempType, currentTemp);
  });

  // mini portfolio navigation
  $('#ab').click(function(){
    $('#about').toggle(600);
  });
 
  $('#pr').click(function(){
    $('#projects').toggle(600);
  });

  $('#ti').click(function(){
    $('#timpic').toggle(600);
  });

  $('button').click(function(){
    var zipVal =  document.getElementById("zipcode").value;
        
    if (zipVal.length !== 5)
    {
      document.getElementById("zipLabel").textContent = "PLEASE enter a 5 digit U.S. zip code only";
    }
    else
    {
      document.getElementById("zipLabel").textContent = "THANK YOU!";
      displayWeather(zipVal);
    }

  });  

  $('.footer').css('text-shadow', '0px 0px 8px black');
  
});

// displays weather called with geolocation or zip code
function displayWeather()
{
  $(".zip-entry").css("display", "none");
  var openWeatherApi = 'http://api.openweathermap.org/data/2.5/weather';
  
  if (arguments.length === 2)
  {
    var lat = arguments[0];
    var lon = arguments[1];
    var apiParams = {
      "lat":        lat,
      "lon":        lon,
      "units":      "imperial",
      "appid":      "f8eca089b2dc20d458b0079a2d2dcd13"}; 
  }
  else
  {
    var zipcode = arguments[0];
    var apiParams = {
      "zip":        zipcode + ",us",
      "units":      "imperial",
      "appid":      "f8eca089b2dc20d458b0079a2d2dcd13"}; 
  }

  $.getJSON(openWeatherApi, apiParams, function(json) {
    // handle api error
    if (json['cod'] !== 200)
    {
      $(".city").html('<h1>Sorry, technical error try again another time!</h1>'); 
    }

     // just a test to see if API begins returning
     // wind direction again
     for (var prop in json["wind"])
     {
       console.log("obj." + prop + " = " + json['wind'][prop]);
     }
    // puts weather data into DOM 
    $(".city").html('<h1>' + json['name'].toUpperCase() + '</h1>');  
    $(".temperature").html('<h2><span id="temp">' + Math.floor(json['main'].temp) + '</span>&deg <span id="temp-conversion">F</span></h2>');
    $(".description").html('<h2>' + json['weather'][0].description.toUpperCase() + '</h2>');
    $(".humidity").html('<h2>HUMIDITY ' + json['main'].humidity + '%</h2>');
    // stores weather direction into var
    if (json['wind'].deg)
    {
      var deg = json['wind'].deg;
    }
    else
    {
      var deg = 283;
    }
    
    var card = degreesToDirection(deg).toLowerCase();
    // puts windspeed into DOM, uses Wind Icon for direction
    $(".windspeed").html('<h2>WIND ' + Math.floor(json['wind'].speed) + 'MPH ' + degreesToDirection(deg) + ' <i class="wi wi-wind wi-from-' + card + '"></i></h2>');
    $(".city").append('<h2><i id="w-icon" class="wi wi-owm-' + json['weather'][0].id + '"></i></h2>');

    // this determines the size of photo to get from flickr
    // and also the orientation that we need eg. landscape vs portrait
    var intVPWidth = window.innerWidth;
    var intVPHeight = window.innerHeight;

    // weather icon variable used for flickr photo search keywords
    var owIconID = json['weather'][0].icon; 

    // uses viewport width and height to determine portrait
    // or landscape. open weather icon id will determine what
    // keywords to search flickr for. 
    // builds appropriate weather photo into DOM
    // puts photo attribution and license infor into DOM
    displayWeatherPhoto(intVPWidth, intVPHeight, owIconID);
  }); 

}

/* function from stackoverflow
 http://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words*/
// translates wind degrees into alpha direction abbreviation
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
    
    // search string of keywords based on weather
    // to be sent to flickr API
    var tagString = owIconIdSwitch(owIconID);

    $.getJSON(flickrAPI, {
      "method"        :"flickr.photos.search",
      "api_key"       :"7489f6e27e5cfc416ebe333a830abc1e",
      "tags"          : tagString,
      "tag_mode"      :"all",
      "license"       :"1,2,3,4,5,6,7,8",
      "extras"        :"o_dims,url_l,url_m,license",
      "content_type"  :"1",
      "media"         :"photos",
      "per_page"      :"50",
      "page"          :"1",
      "format"        :"json",
      "nojsoncallback":"1"}, function(json) {
      var arrLength =  json['photos']['photo'].length;   
      var filteredSet = json['photos']['photo'].filter(function(obj) {
            // whether landscape or portrait
            // uses large version of photo first
            // then medium size if large not available
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
        }
        else
        {
          // default photo
          var imgUrl = "url(../img/landsky2.jpg)"; 
        }
        
        $("body").css("background-image", imgUrl);

        flickrUsr = flickrObj['owner'];  
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
      tagString = 'sunny,sky'; 
      break;
    case "01n":
      tagString = 'stars,night,sky';  
      break;
    case "02d":
    case "03d":
    case "04d":
      tagString = 'cloudy,sky,clouds';
      break;
    case "02n":
    case "03n":
    case "04n":
      tagString = 'night,clouds,sky';
      break;
    case "09d":
    case "10d":
      tagString = 'showers,rain,sky';
      break;
    case "09n":
    case "10n":
      tagString = 'night,sky,rain';
      break;
    case "13d":
    case "13n":
      tagString = 'snow,sky';
      break;
    case "50d":
    case "50n":
      tagString = 'mist,fog';
      break;
    default:
      tagString = 'sky'; 
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
      $("#lic").append('Photo License: <a href="' + filteredLicense[0]['url'] + '">' + filteredLicense[0]['name'] + '</a> - ');
    
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
      $("#att").append('Photo by Flickr user <a href="' + json['person']['profileurl']['_content'] + '">' +  json['person']['username']['_content'] + '</a>');
    
  });

}

// converts Fahrenheit to Celsius and vice versa
// puts conversion into DOM
function fahrToCel(tempType, currentTemp)
{
  var intTemp = parseInt(currentTemp);
  if (tempType == 'F')
  {
    var newTemp = Math.round((intTemp - 32) * 5 / 9); 
    tempType = 'C';
  }
  else
  {
    var newTemp = Math.round(((intTemp * 9) / 5) + 32); 
    tempType = 'F';
  }

  document.getElementById("temp").textContent = newTemp;
  document.getElementById("temp-conversion").textContent = tempType;
} 
