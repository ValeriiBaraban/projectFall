document.addEventListener('DOMContentLoaded', async () => {
    // turn off browser validation
    document.querySelector('form').setAttribute('novalidate', '');
    
    //add animation to Wheater
    document.querySelector('h1').classList.add('loading-text');
 
    //errors for field: City
    const cityError = document.querySelector('#city-error');
    const cityField = document.querySelector('#cities');

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
      console.log({find});
      return { find };
};


const search = inputSearch(listOfCities);

 
//console.log(search.find('san'));

const finder = () => {
    const search = inputSearch(listOfCities);

    cityField.addEventListener('input', (e) => {
        const inputField = e.target.value
        sessionStorage.setItem('input', inputField);
        console.log('inputFeild.value', inputField);
        //const input = document.querySelector('#cities');
        const result = search.find(inputField); //(sessionStorage.getItem('input'));//search.find(input);//(sessionStorage.getItem('input'));
        console.log('result', result);
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