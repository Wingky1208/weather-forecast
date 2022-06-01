//Assigning a API key to a variable
var APIKey = "827fa2ef2df7295113879504968816c7";

//set variable
var cityNameEl = document.querySelector("#city-name");
var todayWeatherEl = document.querySelector("#today-weather");
var currentIconEl = document.querySelector("#current-icon");
var currentTempEl = document.querySelector("#temperature");
var currentHumidityEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind-speed");
var currentUVEl = document.querySelector("#uv-index");
var searchEl = document.querySelector("#search-button");
var cityEl = document.querySelector("#search-city");
var fiveDayEl = document.querySelector("#fiveday-weather")
var historyEl = document.querySelector("#history");
var searchHistory = [];




//get weather information with API
function getWeather(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=metric";
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            todayWeatherEl.classList.remove("d-none");
            //get the day,month, year
            console.log(data);
            var currentDate = new Date(data.dt * 1000);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            console.log(currentDate);

            cityNameEl.innerHTML = data.name + "  " + month + '/' + day + '/' + year;


            //get icon, temp,humidity,wind-speed
            var weatherIcon = data.weather[0].icon;
            currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png")
            currentTempEl.innerHTML = "temperature: " + data.main.temp + " &#176C";
            currentHumidityEl.innerHTML = "humidity: " + data.main.humidity + " %";
            currentWindEl.innerHTML = "wind speed: " + data.wind.speed + " MPH";

            //get UV index
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";
            fetch(UVQueryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    currentUVEl.innerHTML = "UV index: " + data[0].value;
                    if (data[0].value < 4) {
                        currentUVEl.classList.add("bg-success ");
                    }
                    else if (data[0].value < 8) {
                        currentUVEl.classList.add("bg-warning");
                    }
                    else {
                        currentUVEl.classList.add("bg-danger");
                    }

                });

            //get 5 day forecast
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey + "&units=metric";
            fetch(forecastURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    fiveDayEl.classList.remove("d-none");

                    var forecastEls = document.querySelectorAll(".forecast");


                    for (i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";
                        var index = i * 8 + 4;
                        var forecastDate = new Date(data.list[index].dt * 1000);
                        var forecastDay = forecastDate.getDate();
                        var forecastMonth = forecastDate.getMonth() + 1;
                        var forecastYear = forecastDate.getFullYear();
                        var forecastDateEl = document.createElement("p");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);

                        //get icon, temp,humidity,wind-speed for forecast 5 days
                        var forecastWeatherEl = document.createElement("img");

                        forecastWeatherEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.list[index].weather[0].icon + "@2x.png");
                        forecastEls[i].append(forecastWeatherEl);

                        var forecastTemp = document.createElement("p");
                        forecastTemp.innerHTML = "temperature: " + data.list[index].main.temp + " &#176C";
                        forecastEls[i].append(forecastTemp);

                        var forecastHumidity = document.createElement("p");
                        forecastHumidity.innerHTML = "humidity: " + data.list[index].main.humidity + " %";
                        forecastEls[i].append(forecastHumidity);

                        var forecastWind = document.createElement("p");
                        forecastWind.innerHTML = "wind speed: " + data.list[index].wind.speed + " MPH";
                        forecastEls[i].append(forecastWind);

                    }
                });


        })
}




searchEl.addEventListener("click", function () {
    var searchTerm = cityEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
})

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-grey");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}






// function renderSearchHistory() {
//     historyEl.innerHTML = "";
//     for (var i = 0; i < searchHistory.length; i++) {
//         var historyItem = document.createElement("p");

//         historyItem.setAttribute("value", searchHistory[i]);
//         historyItem.addEventListener("click", function () {
//             getWeather(historyItem.value);
//         })

//         historyEl.append(historyItem)

//     }
// }
