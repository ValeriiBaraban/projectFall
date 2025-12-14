document.addEventListener('DOMContentLoaded', async () => {
    // turn off browser validation
    document.querySelector('form').setAttribute('novalidate', '');
    
    //add animation to Wheater
    document.querySelector('h1').classList.add('loading-text');
 
    //errors for field: City
    const cityError = document.querySelector('#city-error');
    const cityField = document.querySelector('#cities');
    const datalist = document.querySelector('#cities-list');


//TODO добавить проверку чтоб цифры нельзя было юзать

    // checking City
    const checkingFieldName = () => {
        if(cityField.value.length === 0) {
            cityError.textContent = "field requared";
            return false;
        } else if(cityField.value.length < 3) {
            cityError.textContent = "min 3 symbols";
            return false;
        } else {
            cityError.textContent = "";
            return true;
        };
    };

//listen input field for search engine

    

//download list of cities and writing it to session storage
const getZipCity = async () => {
  const res = await fetch('/site/delivery_zipcode_physical_city.json');

  const file = await res.json();
  sessionStorage.setItem('zipCity', JSON.stringify(file));
  return file;
};

//get list of cities
const getCityList = async () => {
  await getZipCity();
  const data = await JSON.parse(sessionStorage.getItem('zipCity'));
  return [... new Set(data.map((item) => item.physical_city))];
}

const listOfCities = await getCityList();

const inputSearch = (listOfCities) => {

  const find = (query) => {
    const q = (query || '').trim().toLowerCase();
    if(!q) {
      return [];
    };
     return listOfCities
      .filter(listOfCities => listOfCities.toLowerCase().startsWith(q))
    };
      return { find };
};

const finder = () => {
    const search = inputSearch(listOfCities);

    cityField.addEventListener('input', (e) => {
        const filteredValue = e.target.value.replace(/[^\p{L}\s-]/gu, '');
        const inputField = filteredValue;
        sessionStorage.setItem('input', inputField);
        const result = search.find(inputField);
          const datalist = document.querySelector('#cities-list');

            result.slice(0, 5).forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                datalist.appendChild(option);
      });

        console.log('result', result.slice(0, 10));
        return result
    });
};

  console.log('finder', finder());

// Validation runs when the button is clicked
    const submit = document.querySelector('.btn-primary');
    submit.addEventListener('click', function(e) {
        e.preventDefault();
        // Run all validation functions/ consts received true or false
       const checkingFieldNameBoolean = checkingFieldName();
       
       if((checkingFieldNameBoolean)) {
            sessionStorage.setItem('selectedCity', cityField.value);
            //sessionStorage.setItem('selectedCountry', country);
           // sessionStorage.setItem('zip', zip);
            window.location.href = '/site/page-main.html';
       };

    });

});