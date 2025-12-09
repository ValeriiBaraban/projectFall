//TODOOne or more Classes (must use static methods and/or prototype methods)
//TODO Write testable code, use Jasmine unit tests
//TODO One or more timing functions
//TODO One or more fetch requests to a 3rd party API
//TODO Sets, updates, or changes local storage
//TODO Contains form fields, validates those fields


//TODO add 12 hours format
function getTime() {
  const date = new Date();
  return [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')];
} 


class ConstrucorBaseUrl {
    constructor(params) {
        this.BASEURL = 'https://api.open-meteo.com/v1/forecast';
        //&hourly=temperature_2m,relative_humidity_2m,pressure_msl,windspeed_10m,cloudcover,visibility&daily=sunrise,sunset,uv_index_max&timezone=auto
    }   //https://api.open-meteo.com/v1/forecast?latitude=47.60&longitude=-122.33&current_weather=true

};

class Geolocation {

    constructor(selectedCity) {
        this.city = selectedCity;
        this.geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${this.city}&count=1`;
        this.BASEURL = 'https://api.open-meteo.com/v1/forecast';
        this.daily = '&daily=';
        this.hourly = '&hourly=';
        this.minutely = '&minutely_15=';
    }

    async getCoordinates() {
        const res = await fetch(this.geoUrl);
        const data = await res.json();
        const country = data.results[0].country;
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        return [latitude, longitude, country];
    };

    async getWeather() {
        const [latitude, longitude, country] = await this.getCoordinates();
        const url = `${this.BASEURL}?latitude=${latitude}&longitude=${longitude}${this.hourly}temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m`;
        //`${this.BASEURL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,showers,snowfall,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,surface_pressure,visibility,is_day&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        data.country = country;
        return data;
    }
}


const dataNow = getTime();
const selectedCity = 'Shoreline'
const newCity = new Geolocation(selectedCity);
const response = (newCity.getWeather())
  .then(function(data) {
    const fetchCurrentWheater = new localStorageForHistory(data, selectedCity);
    // currentWheater.addLocation();
    // currentWheater.addTemp();
    // currentWheater.addConditions();
    fetchCurrentWheater.fetchAll();
    fetchCurrentWheater.addLocalStorage();


  });
  
  class CurrentWheater {
  constructor(response, cityName) {
    this.temperatureCelsius = response.current.temperature_2m;
    this.temperatureFahrenheit = this.#CToF(this.temperatureCelsius);
    this.cityName = cityName;
    this.country = response.country;
    this.lastUpdated = getTime();//dataNow;

    // this.condition = response.current.condition;//text,icon,code
    this.humidity = response.current.relative_humidity_2m;
    // this.windDir = response.current.wind_dir;
};

  selector = document.querySelector('#current-wheater-container');

  #CToF (celsium) {
    return (celsium * 9 / 5 + 32).toFixed(1);
  };
  waitingDownload() {
      selector.classList.add('weather-card hidden');
  }

  addTime() {
      const lastUpdated = document.createElement('h4');
      const formattingTime = `${this.lastUpdated[0]} : ${this.lastUpdated[1]}`;
      lastUpdated.textContent = `Last updated at: ${formattingTime}`;
      lastUpdated.classList = 'updated-time';
      this.selector.appendChild(lastUpdated);

      return lastUpdated;
  }

  addTemp() {
    const temp_c = document.createElement('p');
    const temp_f = document.createElement('p');

    temp_c.textContent = `${this.temperatureCelsius} + ' °C'`;
    temp_f.textContent = `${this.temperatureFahrenheit} + ' °F'`;


    this.selector.appendChild(temp_c);
    this.selector.appendChild(temp_f);

    return [temp_c, temp_f];
  };

    addLocation() {
        const country = document.createElement('h2');
        const city = document.createElement('h3');

        country.classList = 'country';
        country.textContent = this.country;

        city.classList = 'city';
        city.textContent = `Current weather in ${this.cityName}:`;

        this.selector.appendChild(country);
        this.selector.appendChild(city);


        return [country, city];
    };

    addConditions() {
        //const cond = document.createElement('div');

        const humidity = document.createElement('p');
        humidity.classList = 'humidity';
        humidity.textContent = `Humidity ${this.humidity} %`;
        // const text = document.createElement('p');
        // text.textContent = this.condition.text;
        
        // const icon = document.createElement('img');
        // icon.src = `https:${this.condition.icon}`;

        // cond.appendChild(text);
        // cond.appendChild(icon);

        // this.#selector.appendChild(cond);
        this.selector.appendChild(humidity);
    };
    
    fetchAll() {
        this.addLocation();
        this.addTime();
        this.addTemp();
        this.addConditions();
        waitingDownload();
    }
};

class localStorageForHistory extends CurrentWheater {
  constructor(response, cityName) {
    super(response, cityName);
  };

  addLocalStorage() {
    const historicalTime = JSON.parse(localStorage.getItem('WheaterHistory')) || [];
    historicalTime.push({
//TODO replace time formatting
//TODO add autoupdater
      'city': this.cityName,
      'time': `${this.lastUpdated[0]}:${this.lastUpdated[1]}`,
      'C' : this.temperatureCelsius,
      'F' : this.temperatureFahrenheit,
    });

    localStorage.setItem('WheaterHistory', JSON.stringify(historicalTime));
    console.log(historicalTime);
    return historicalTime;


  };
};

const getZipCity = async () => {
  const res = await fetch('/site/delivery_zipcode_physical_city.json');

  const file = await res.json();
  sessionStorage.setItem('zipCity', JSON.stringify(file));
  //console.log(file);
};


const searchInFile = async () => {
  await getZipCity();
  const data = JSON.parse(sessionStorage.getItem('zipCity'));
  const getZip = data.filter((item) => item.physical_city.toLowerCase() === 'shoreline');
  const getCity = data.filter((item) => item.delivery_zipcode === 98155);

  console.log(getZip);
  console.log(getCity);
}
searchInFile();