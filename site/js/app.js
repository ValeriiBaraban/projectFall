function sessionStorage() {
  const data = sessionStorage.getItem('page-main.html');
  


};
function getTime() {
  const date = new Date();
  return [date.getHours(), date.getMinutes()];
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

// async function look(data) {
//     const res = await data;
//      console.log(res);
// }
// look(newCity.getWeather());
const dataNow = getTime();

const selectedCity = 'Shoreline'
const newCity = new Geolocation(selectedCity);
const response = (newCity.getWeather())
  .then(function(data) {
    const currentWheater = new CurrentWheater(data, selectedCity, dataNow)
    ;
    // currentWheater.addLocation();
    // currentWheater.addTemp();
    // currentWheater.addConditions();
    currentWheater.fetchAll();

  });

  class CurrentWheater {
  constructor(response, cityName, dataNow) {
    this.temperatureCelsius = response.current.temperature_2m;
    this.temperatureFahrenheit = this.#CToF(this.temperatureCelsius);
    this.cityName = cityName;
    this.country = response.country;
    this.lastUpdated = dataNow;
    // this.condition = response.current.condition;//text,icon,code
    this.humidity = response.current.relative_humidity_2m;
    // this.windDir = response.current.wind_dir;
};

  #selector = document.querySelector('#current-wheater-container');

  #CToF (celsium) {
    return (celsium * 9 / 5 + 32).toFixed(1);
  };

  addTime() {
      const lastUpdated = document.createElement('h4');
      const formattingText = `${this.lastUpdated[0]} : ${this.lastUpdated[1]}`;
      lastUpdated.textContent = `Last updated at: ${formattingText}`;
      this.#selector.appendChild(lastUpdated);
      return [lastUpdated]  
  }

  addTemp() {
    const temp_c = document.createElement('p');
    const temp_f = document.createElement('p');

    temp_c.textContent = this.temperatureCelsius + ' °C';
    temp_f.textContent = this.temperatureFahrenheit + ' °F';


    this.#selector.appendChild(temp_c);
    this.#selector.appendChild(temp_f);

    return [temp_c, temp_f];
  };

    addLocation() {
        const country = document.createElement('h2');
        const city = document.createElement('h3');

        country.textContent = this.country;
        city.textContent = `Current weather in ${this.cityName}:`;

        this.#selector.appendChild(country);
        this.#selector.appendChild(city);


        return [country, city];
    };

    addConditions() {
        const cond = document.createElement('div');

        const humidity = document.createElement('p');
        humidity.textContent = this.humidity + "%";
        // const text = document.createElement('p');
        // text.textContent = this.condition.text;
        
        // const icon = document.createElement('img');
        // icon.src = `https:${this.condition.icon}`;

        // cond.appendChild(text);
        // cond.appendChild(icon);

        // this.#selector.appendChild(cond);
        this.#selector.appendChild(humidity);
    };
    
    fetchAll() {
        this.addLocation();
        this.addTime();

        this.addTemp();
        this.addConditions();
    }
};


