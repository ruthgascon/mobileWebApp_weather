var dataPage = window.location.pathname.split('/')[2];
var horaLocal;

$(document).ready(function () {
	clearMessages();
	if (dataPage === "Index.html") {
		$("#message").click(function () {
			window.location.href = 'weather.html';
		});

	} else if (dataPage === "weather.html") {
		var dataJson = JSON.parse(localStorage.getItem('x'));
		var nameCity = dataJson.name;
		var kindWeather = dataJson.weather[0].main;
		var temperature = Math.round(dataJson.main.temp);
		var humidity = dataJson.main.humidity;
		var tempMax = dataJson.main.temp_max;
		var tempMin = dataJson.main.temp_min;
		var latitud = dataJson.coord.lat;
		var longitud = dataJson.coord.lon;
		var sunset;
		currentlocaltime('time', latitud, longitud); // CALL FUNCTION TO GET LOCAL TIME AND PRINT IT

		// FUNCION PARA TENER HORA DE SUNSET

		function horaSunset (){
			$.getJSON('https://api.sunrise-sunset.org/json?lat='+latitud+'&lng='+longitud+'&formatted=0', function () {
			}).done(function (sunsetAPI) {
				console.log ("THIS IS THE SUNSET API:")
				console.log (sunsetAPI);
				sunset = sunsetAPI.results.sunset;
				console.log ("hora sunset: " + sunset);
			});
		}
		horaSunset ();

		function setbackground(hora) { //FUNCION PARA MOSTRAR UN BACKROUND O OTRO
			if (hora) {
				console.log("ES DE DIA: hora local es: " + hora + " y la hora de la puesta es: " + sunset);
				$('.mainContainer2').css("background-image", "url(../images/" + nameCity + ".jpg)");
			} else {
				console.log("ES DE NOCHE: hora local es: " + hora + " y la hora de la puesta es: " + sunset);
				$('.mainContainer2').css("background-image", "url(../images/" + nameCity + "_night" + ".jpg)");
			}
		};

		$("#city").append("<h3>" + nameCity + "</h3>").addClass("myCityName");
		$("#mainWeather").append("<p>" + kindWeather + "</p>");
		$("#weatherIcon").append('<img src="../icons/' + kindWeather + '.svg"/ id="image">');

		$("#image").on( "error", function(){
			$("#weatherIcon").html('<img src="../icons/wi-alien.svg"/>');
		} );



		$("#temperature").append("<p>" + temperature + "ºC" + "</p>")
		$("#otherData").append("<p><strong>Humidity: </strong>" + humidity + "</p>").append("<p> High: " + tempMax + "</p>").append("<p> Low: " + tempMin + "</p>")
		setTimeout(function () {
			$('.mainContainer2').show();
			$('.mainContainerLoad').hide();
		}, 1500);
	}

	/////////*ENTER DATA WITH RETURN KEY*/////////
	$('input[type=text]').on('keydown', function (e) {
		if (e.which == 13) {
			e.preventDefault();
			enterEvent();
		}
	});

	function enterEvent() {
		if (event.keyCode == 13) {
			validateInput();
		}
	};

	/////////////*VALIDATE INPUT*/////////////
	function validateInput() {
		localStorage.clear();
		var cityInput = $("#mySearchingInput").val();
		var country, city;
		clearMessages();
		$("#messageValidating").show();
		if (cityInput != "") {
			$.getJSON('http://api.openweathermap.org/data/2.5/weather?APPID=b2c2f1f227e719ecfe946d5ae5df7394&units=metric&q=' + cityInput, function () {}).done(function (data) {
				localStorage.setItem("x", JSON.stringify(data));
				city = data.name;
				country = data.sys.country;
				setTimeout(function () {
					clearMessages();
					$("#messageCity").show();
					$("#actualMessCity").html(city + ": " + country);
				}, 200);
			})
				.fail(function () {
				setTimeout(function () {
					clearMessages();
					$("#messageNoResults").show();
				}, 200);
			})
		} else {
			clearMessages();
			$("#messageError").show();
		}
	};

	/////////////*CLEAR MESSAGES*/////////////
	function clearMessages() {
		$("#messageCity").hide();
		$("#messageValidating").hide();
		$("#messageNoResults").hide();
		$("#messageError").hide();
	}

	/////////////*SET TIME*/////////////

	function currentlocaltime(divid, loc1, loc2) {

		var apikey = 'AIzaSyDXOy8IWEF8FpdCkZVgw8TIefPqfW360-E';
		var daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
		//	debugger;
		//	localStorage.clear();
		var container = document.getElementById(divid)
		var targetDate = new Date() // Current date/time of user computer
		var timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
		var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc1 + "," + loc2 + '&timestamp=' + timestamp + '&key=' + apikey;
		var xhr = new XMLHttpRequest() // create new XMLHttpRequest2 object
		xhr.open('GET', apicall) // open GET request
		//	localStorage.clear();
		xhr.onload = function () {
			if (xhr.status === 200) { // if Ajax request successful
				var output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
				console.log(output.status) // log API return status for debugging purposes
				if (output.status == 'OK') { // if API reports everything was returned successfully
					var offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
					var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of target location
					var finalTime = localdate.toLocaleTimeString(); // SET LOCAL STORAGE to get LOCAL TIME
					//					localStorage.setItem("y", JSON.stringify(finalTime));
					console.log (localdate);
					setbackground(localdate);
					var refreshDate = new Date() // get current date again to calculate time elapsed between targetDate and now
					var millisecondselapsed = refreshDate - targetDate // get amount of time elapsed between targetDate and now
					localdate.setMilliseconds(localdate.getMilliseconds() + millisecondselapsed) // update localdate to account for any time elapsed
					setInterval(function () {
						localdate.setSeconds(localdate.getSeconds() + 1);
						container.innerHTML = localdate.toLocaleTimeString() + ' (' + daysofweek[localdate.getDay()] + ')';

					}, 1000)

				}
			} else {
				alert('Request failed.  Returned status of ' + xhr.status)
			}
		}
		xhr.send() // send request
	}

});