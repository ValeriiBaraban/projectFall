//TODOOne or more Classes (must use static methods and/or prototype methods)
//TODO Write testable code, use Jasmine unit tests
//TODO One or more timing functions
//TODO One or more fetch requests to a 3rd party API
//TODO Sets, updates, or changes local storage
//TODO Contains form fields, validates those fields

document.addEventListener('DOMContentLoaded', async () => {
  // if (!sessionStorage.getItem('allowPage2')) {
  //   window.location.href = 'index.html';
  //   return;
  // }
//TODO add 12 hours format
function getTime() {
  const date = new Date();
  return [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')];
} 

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
        const res = await fetch(url);
        const data = await res.json();
        data.country = country;
        return data;
    }
}

const normalizeCityName = () => {
    const selectedCity = sessionStorage.getItem('selectedCity'); //get input str from index.html
    const normalizedStr = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1).toLowerCase();
    return normalizedStr;
}

const newCity = new Geolocation(normalizeCityName());
const response = (newCity.getWeather())
  .then(function(data) {
    const fetchCurrentWheater = new localStorageForHistory(data, normalizeCityName());
    
    fetchCurrentWheater.fetchAll();
    fetchCurrentWheater.addLocalStorage();
    
    
  });
  
  class CurrentWheater {
  constructor(response, cityName) {
    this.temperatureCelsius = response.current.temperature_2m;
    this.temperatureFahrenheit = this.#CToF(this.temperatureCelsius);
    this.cityName = cityName;
    this.country = response.country;
    this.lastUpdated = getTime();
    this.humidity = response.current.relative_humidity_2m;
};

  selector = document.querySelector('#current-wheater-container');

  #CToF (celsium) {
    return (celsium * 9 / 5 + 32).toFixed(1);
  };

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

    temp_c.textContent = `${this.temperatureCelsius}' °C'`;
    temp_f.textContent = `${this.temperatureFahrenheit}' °F'`;


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
        const humidity = document.createElement('p');
        humidity.classList = 'humidity';
        humidity.textContent = `Humidity ${this.humidity} %`;
        this.selector.appendChild(humidity);
        
        return humidity;
    };
    
    
    fetchAll() {
        this.selector.innerHTML = '';
        this.addLocation();
        this.addTime();
        this.addTemp();
        this.addConditions();
        
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
    console.log('historicalTime:', historicalTime);
    return historicalTime;


  };
};

class loadingCard {
  constructor() {
      this.card = this.addLoadingScreen();
      this.selector = document.querySelector('#current-wheater-container');
  
  }

  waitingDownload() {
      this.selector.classList.add('weather-card', 'hidden');
  };

  addLoadingScreen() {
      const loadingScreen = document.createElement('div');
      loadingScreen.classList.add('loading-screen');
      const spinner = document.createElement('div');
      spinner.classList.add('spinner');
      const text = document.createElement('p');
      text.classList.add('loading-text');
      text.textContent = 'Loading wheater...';

      loadingScreen.appendChild(spinner);
      loadingScreen.appendChild(text);

      document.body.appendChild(loadingScreen);

      return loadingScreen;

    };

    show() {
      this.card.classList.remove('hidden');
      this.selector.classList.add('hidden');

    };

    hide() {
      this.card.classList.add('hidden');
      this.selector.classList.remove('hidden')
    };
    
  };


const loader = new loadingCard();  

//timer for loading wheater
const switchLoading = () => {
  loader.show();
  
  setTimeout(() => {
    loader.hide();
  }, 5000);
}

switchLoading();

//download list of cities and writing to session storage
const getZipCity = async () => {
  const res = await fetch('/site/delivery_zipcode_physical_city.json');

  const file = await res.json();
  sessionStorage.setItem('zipCity', JSON.stringify(file));
};


const getCityList = async () => {
  await getZipCity();
  const data = await JSON.parse(sessionStorage.getItem('zipCity'));
//   const getZip = data.filter((item) => item.physical_city.toLowerCase() === sessionStorage.getItem('selectedCity').toLowerCase());
//   const getCity = data.filter((item) => item.delivery_zipcode === sessionStorage.getItem('zip'));

//   console.log('zip', getZip);
//   console.log('city', getCity);
  const citySets = [... new Set(data.map((item) => item.physical_city))];
  return citySets;
}


const listOfCities = await getCityList();
console.log('list', listOfCities);

const inputSearch = (listOfCities) => {
  const city  = listOfCities;

  const find = (query) => {
    if(!query) {
      return city = [];
    };
     return city
      .filter(listOfCities => listOfCities.toLowerCase().startsWith(query))
    };

      return { find };
};


const search = inputSearch(listOfCities);

console.log(search.find('hon'));


  
});
