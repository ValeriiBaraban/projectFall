document.addEventListener('DOMContentLoaded', () => {
    // turn off browser validation
    document.querySelector('form').setAttribute('novalidate', '');
    
    //add animation to Wheater
    document.querySelector('h1').classList.add('loading-text');
    
    // Get the error message container
    const error = document.querySelector('.alert-text');
 
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