document.addEventListener('DOMContentLoaded', () => {
    // turn off browser validation
    document.querySelector('form').setAttribute('novalidate', '');
    
    // Get the error message container
    const error = document.querySelector('.alert-text');
 
    //errors for field: Name
    const cityError = document.querySelector('#city-error');
    const cityField = document.querySelector('#cities');
    // nameField.setAttribute('required', '');
    // nameField.setAttribute('minlength', 3);

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
                    window.location.href = '/site/page-main.html';
       };

    });

});