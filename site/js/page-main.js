//TODOOne or more Classes (must use static methods and/or prototype methods)
//TODO Write testable code, use Jasmine unit tests
//TODO One or more timing functions
//TODO One or more fetch requests to a 3rd party API
//TODO Sets, updates, or changes local storage
//TODO Contains form fields, validates those fields

document.addEventListener("DOMContentLoaded", async () => {
  // if (!sessionStorage.getItem('allowPage2')) {
  //   window.location.href = 'index.html';
  //   return;
  // }

  // Helper function to get current time in [HH, MM] format

  function getTime() {
    const date = new Date();
    return [
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0"),
    ];
  }
  // ---- Class responsible for geolocation and weather fetching ----

  class Geolocation {
    constructor(selectedCity) {
      this.city = selectedCity;
      // API URL to get coordinates for the selected city
      this.geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${this.city}&count=1`;
      // Base URL for the weather API

      this.BASEURL = "https://api.open-meteo.com/v1/forecast";
      this.daily = "&daily=";
      this.hourly = "&hourly=";
      this.minutely = "&minutely_15=";
    }
    // Fetch coordinates (latitude, longitude) and country for the city

    async getCoordinates() {
      const res = await fetch(this.geoUrl);
      const data = await res.json();
      const country = data.results[0].country;
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      return [latitude, longitude, country];
    }
    // Fetch weather data for the selected city, enrich with country field

    async getWeather() {
      const [latitude, longitude, country] = await this.getCoordinates();
      const url = `${this.BASEURL}?latitude=${latitude}&longitude=${longitude}${this.hourly}temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m`;
      const res = await fetch(url);
      const data = await res.json();
      data.country = country;
      return data;
    }
  }
  // ---- Normalize city name taken from sessionStorage ----

  const normalizeCityName = () => {
    try {
      const selectedCity = sessionStorage.getItem("selectedCity");
      if (!selectedCity) {
        throw new Error("selected sity error");
      } // Capitalize first letter and lowercase the rest

      return (
        selectedCity.charAt(0).toUpperCase() +
        selectedCity.slice(1).toLowerCase()
      );
    } catch (error) {
      return "";
    }
  };
  // Create Geolocation instance for normalized city and fetch weather

  const newCity = new Geolocation(normalizeCityName());
  const response = newCity.getWeather().then(function (data) {
    // Use extended class to both render current weather and save history

    const fetchCurrentWheater = new localStorageForHistory(
      data,
      normalizeCityName()
    );
    // Render all current weather info to the page
    fetchCurrentWheater.fetchAll();
    // Save current weather to localStorage history

    fetchCurrentWheater.addLocalStorage();
  });
  // ---- Class to represent and render current weather card ----

  class CurrentWheater {
    constructor(response, cityName) {
      this.temperatureCelsius = response.current.temperature_2m;
      this.temperatureFahrenheit = this.#CToF(this.temperatureCelsius);
      this.cityName = cityName;
      this.country = response.country;
      this.lastUpdated = getTime();
      this.humidity = response.current.relative_humidity_2m;
    }
    // Main container element for current weather card

    selector = document.querySelector("#current-wheater-container");
    // Private method: convert Celsius to Fahrenheit with 1 decimal

    #CToF(celsium) {
      return ((celsium * 9) / 5 + 32).toFixed(1);
    }
    // Create and append "Last updated" time element

    addTime() {
      const lastUpdated = document.createElement("h4");
      const formattingTime = `${this.lastUpdated[0]} : ${this.lastUpdated[1]}`;
      lastUpdated.textContent = `Last updated at: ${formattingTime}`;
      lastUpdated.classList = "updated-time";
      this.selector.appendChild(lastUpdated);

      return lastUpdated;
    }
    // Create and append temperature elements in °C and °F

    addTemp() {
      const temp_c = document.createElement("p");
      const temp_f = document.createElement("p");

      temp_c.textContent = `${this.temperatureCelsius}' °C'`;
      temp_f.textContent = `${this.temperatureFahrenheit}' °F'`;

      this.selector.appendChild(temp_c);
      this.selector.appendChild(temp_f);

      return [temp_c, temp_f];
    }
    // Create and append location elements: country and city title

    addLocation() {
      const country = document.createElement("h2");
      const city = document.createElement("h3");

      country.classList = "country";

      country.textContent = this.country;

      city.classList = "city";
      city.textContent = `Current weather in ${this.cityName}:`;

      this.selector.appendChild(country);
      this.selector.appendChild(city);

      return [country, city];
    }
    // Create and append additional condition elements (e.g., humidity)

    addConditions() {
      const humidity = document.createElement("p");
      humidity.classList = "humidity";
      humidity.textContent = `Humidity ${this.humidity} %`;
      this.selector.appendChild(humidity);

      return humidity;
    }
    // Clear container and render all weather-related elements

    fetchAll() {
      this.selector.innerHTML = "";
      this.addLocation();
      this.addTime();
      this.addTemp();
      this.addConditions();
    }
  }
  // ---- Extended class: renders weather and stores history in localStorage ----

  class localStorageForHistory extends CurrentWheater {
    constructor(response, cityName) {
      super(response, cityName);
    }
    // Save current weather snapshot into "WheaterHistory" in localStorage

    addLocalStorage() {
      const historicalTime =
        JSON.parse(localStorage.getItem("WheaterHistory")) || [];
      historicalTime.push({
        city: this.cityName,
        time: `${this.lastUpdated[0]}:${this.lastUpdated[1]}`,
        C: this.temperatureCelsius,
        F: this.temperatureFahrenheit,
      });

      localStorage.setItem("WheaterHistory", JSON.stringify(historicalTime));
      console.log("historicalTime:", historicalTime);
      return historicalTime;
    }
  }
  // ---- Loading card class: manages loading spinner while fetching data ----

  class loadingCard {
    constructor() {
      this.card = this.addLoadingScreen();
      this.selector = document.querySelector("#current-wheater-container");
    }

    waitingDownload() {
      this.selector.classList.add("weather-card", "hidden");
    }

    addLoadingScreen() {
      const loadingScreen = document.createElement("div");
      loadingScreen.classList.add("loading-screen");
      const spinner = document.createElement("div");
      spinner.classList.add("spinner");
      const text = document.createElement("p");
      text.classList.add("loading-text");
      text.textContent = "Loading wheater...";

      loadingScreen.appendChild(spinner);
      loadingScreen.appendChild(text);

      document.body.appendChild(loadingScreen);

      return loadingScreen;
    }
    // Show loading screen and hide weather card

    show() {
      this.card.classList.remove("hidden");
      this.selector.classList.add("hidden");
    }
    // Hide loading screen and show weather card

    hide() {
      this.card.classList.add("hidden");
      this.selector.classList.remove("hidden");
    }
  }

  const loader = new loadingCard();

  //timer for loading wheater    // ---- Timer for showing loading animation ----

  const switchLoading = () => {
    loader.show();

    setTimeout(() => {
      loader.hide();
    }, 5000);
  };

  switchLoading();
});
