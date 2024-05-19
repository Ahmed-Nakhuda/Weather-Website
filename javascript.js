window.addEventListener("load", () => {
    // Input fields
    let cityInput = document.getElementById("cityInput");
    let countryInput = document.getElementById("countryInput");
    let getWeatherButton = document.getElementById("getWeatherButton");

    // Current weather forecast
    let city = document.getElementById("city");
    let currentTemp = document.getElementById("currentTemp");
    let currentIcon = document.getElementById("currentIcon");
    let currentCondition = document.getElementById("currentCondition");
    let currentHumidity = document.getElementById("currentHumidity");
    let currentFeelsLike = document.getElementById("currentFeelsLike");
    let currentWindSpeed = document.getElementById("currentWindSpeed");
    let currentLow = document.getElementById("currentLow");
    let currentHigh = document.getElementById("currentHigh");

    // Hide the upcoming weather forecast
    let hide = document.getElementById("hide");
    hide.style.display = "none";

    
    // Array of weather data elements for the upcoming forecast
    let weatherDataElements = [
        {
            icon: document.getElementById("icon"),
            time: document.getElementById("time"),
            description: document.getElementById("description"),
            temp: document.getElementById("temp"),
            feelsLike: document.getElementById("feelsLike")
        },
        {
            icon: document.getElementById("icon2"),
            time: document.getElementById("time2"),
            description: document.getElementById("description2"),
            temp: document.getElementById("temp2"),
            feelsLike: document.getElementById("feelsLike2")
        },
        {
            icon: document.getElementById("icon3"),
            time: document.getElementById("time3"),
            description: document.getElementById("description3"),
            temp: document.getElementById("temp3"),
            feelsLike: document.getElementById("feelsLike3")
        },
        {
            icon: document.getElementById("icon4"),
            time: document.getElementById("time4"),
            description: document.getElementById("description4"),
            temp: document.getElementById("temp4"),
            feelsLike: document.getElementById("feelsLike4")
        },
        {
            icon: document.getElementById("icon5"),
            time: document.getElementById("time5"),
            description: document.getElementById("description5"),
            temp: document.getElementById("temp5"),
            feelsLike: document.getElementById("feelsLike5")
        }
    ];


    /**
     * Function to convert UTC time to local time
     * @param utcTime - The UTC time is in the format YYYY-MM-DD HH:MM:SS
     * @returns - The local time in the format HH:MM AM/PM
     */
    function convertUTCToLocal(utcTime) {
        let date = new Date(utcTime + ' UTC');
        let options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return date.toLocaleTimeString([], options);
    }

    
    /**
     * Function to process weather data for the upcoming forecast
     * @param forecast: The weather forecast data for a specific time slot
     * @param weatherElements: The HTML elements that will display the weather forecast data 
     */
    function processWeatherData(forecast, weatherElements) {
        weatherElements.icon.src = 'http://openweathermap.org/img/wn/' + forecast.weather[0].icon + '.png';
        weatherElements.time.innerHTML = convertUTCToLocal(forecast.dt_txt);
        weatherElements.description.innerHTML = forecast.weather[0].description;
        weatherElements.temp.innerHTML = 'Temperature: ' + forecast.main.temp + "&#8451";
        weatherElements.feelsLike.innerHTML = 'Feels Like: ' + forecast.main.feels_like + "&#8451";
    }


    /**
     * Function to fetch and display weather data for the current and upcoming forecast
     * @param lat: The latitude
     * @param lon: The longitude
     */
    function fetchWeatherData(lat, lon) {
        // Fetch the current weather forecast
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=22d07ca9f186c1bda493b1c7182b36ae&units=metric')
            .then(response => response.json())
            .then(currentData => {
                let currentTempData = currentData.main.temp;
                currentTemp.innerHTML = currentTempData + "&#8451";

                let currentIconData = currentData.weather[0].icon;
                currentIcon.src = 'http://openweathermap.org/img/wn/' + currentIconData + '.png';

                let currentConditionData = currentData.weather[0].description;
                currentCondition.innerHTML = "Conditions: " + currentConditionData;

                let humidityData = currentData.main.humidity;
                currentHumidity.innerHTML = "Humidity: " + humidityData + "%";

                let currentFeelsLikeData = currentData.main.feels_like;
                currentFeelsLike.innerHTML = "Feels like: " + currentFeelsLikeData + "&#8451";

                let windSpeedData = currentData.wind.speed;
                currentWindSpeed.innerHTML = "Wind speed: " + windSpeedData + "m/s";

                let currentlowData = currentData.main.temp_min;
                currentLow.innerHTML = "Low: " + currentlowData + "&#8451";

                let currentHighData = currentData.main.temp_max;
                currentHigh.innerHTML = "High: " + currentHighData + "&#8451";

                let cityData = currentData.name;
                let countryData = currentData.sys.country;
                city.innerHTML = cityData + ", " + countryData;
            });

        // Fetch the upcoming weather forecast - three hour forecast for the next 5 days API
        fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=22d07ca9f186c1bda493b1c7182b36ae&units=metric')
            .then(response => response.json())
            .then(data => {
                // Loop through the weather data array and process the weather data
                for (let i = 0; i < weatherDataElements.length; i++) {
                    processWeatherData(data.list[i], weatherDataElements[i]);
                }

                // Display the hidden upcoming weather forecast
                hide.style.display = "block";
            });
    }


    // Check if the browser supports geolocation
    if (navigator.geolocation) {
        // Get the current position of the user
        navigator.geolocation.getCurrentPosition((position) => {
            // Extract coordinates and fetch the current and upcoming weather forecast
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeatherData(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }


    // Fetch the weather data for the city and country the user inputs
    getWeatherButton.addEventListener('click', () => {
        // Geocoding API
        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.value + ',' + countryInput.value + '&limit=5&appid=22d07ca9f186c1bda493b1c7182b36ae')
            .then(response => response.json())
            .then(geolocationData => {
                // Extract coordinates and fetch the current and upcoming weather forecast
                let latData = geolocationData[0]['lat'];
                let lonData = geolocationData[0]['lon'];
                fetchWeatherData(latData, lonData);
            });
    });
});
