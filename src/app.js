function formatDate(timestamp) {
    let date = new Date(timestamp);
  
    let weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let weekDay = weekDays[date.getDay()];
  
    return `${weekDay} ${formatHours(timestamp)}`;
  }
  
  function formatHours(timestamp) {
    let date = new Date(timestamp);
  
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
  
    return `${hours}:${minutes}`;
  }
  
  function displayRealTemp(response) {
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;
  
    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
  
    let descriptionElement = document.querySelector("#weather-description");
    descriptionElement.innerHTML = response.data.weather[0].description;
  
    let weatherIconElement = document.querySelector("#weather-icon");
    let iconElement = response.data.weather[0].icon;
    weatherIconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${iconElement}@2x.png`
    );
    weatherIconElement.setAttribute("alt", response.data.weather[0].description);
  
    let tempElement = document.querySelector("#temp");
    celsiusCurrentTemp = Math.round(response.data.main.temp);
    if (defaultUnit.classList.contains("active-unit")) {
      tempElement.innerHTML = celsiusCurrentTemp;
    } else {
      tempElement.innerHTML = Math.round(celsiusCurrentTemp * 1.8 + 32);
    }
  
    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.main.humidity;
  
    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  }
  
  function displayForecast(response) {
    let forecastData = response.data.list;
    let hourlyTemperatures = [];
    let hourlyLabels = [];
  
    for (let index = 0; index < forecastData.length; index++) {
      let forecast = forecastData[index];
      let temperature = forecast.main.temp;
      let timestamp = forecast.dt * 1000;
      let formattedHour = formatHours(timestamp);
  
      hourlyTemperatures.push(temperature);
      hourlyLabels.push(formattedHour);
    }
  
    let chartData = {
      labels: hourlyLabels,
      datasets: [
        {
          label: 'Hourly Temperature',
          data: hourlyTemperatures,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ]
    };
  
    let chartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  
    let temperatureChart = new Chart(document.getElementById('temperature-chart'), {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }
  
  function search(city) {
    let apiKey = "5ce165099db98eb1a4172c9b8eea4597";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    axios.get(apiUrl).then(displayRealTemp);
  
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
    axios.get(apiUrl).then(displayForecast);
  }
  
  let searchedCity = document.querySelector("#submit-btn");
  searchedCity.addEventListener("click", function (event) {
    event.preventDefault();
  
    let cityInput = document.querySelector("#searched-city");
  
    search(cityInput.value);
  });
  
  let currentLocation = document.querySelector("#location-btn");
  currentLocation.addEventListener("click", function (event) {
    event.preventDefault();
  
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
  
      let apiKey = "5ce165099db98eb1a4172c9b8eea4597";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
      axios.get(apiUrl).then(displayRealTemp);
  
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
      axios.get(apiUrl).then(displayForecast);
    });
  });
  
  function displayTempInFahrenheit(event) {
   
  }
  let changeUnitToF = document.querySelector("#fahrenheit");
  changeUnitToF.addEventListener("click", displayTempInFahrenheit);
  
  function displayTempInCelsius(event) {
    
  }
  let changeUnitToC = document.querySelector("#celsius");
  changeUnitToC.addEventListener("click", displayTempInCelsius);
  
  let celsiusCurrentTemp = null;
  
  let defaultUnit = document.querySelector(".active-unit");
  
  search("Delhi");
  