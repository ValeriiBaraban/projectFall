// TODO
document.addEventListener('DOMContentLoaded', () => {
    // turn off browser validation
    document.querySelector('form').setAttribute('novalidate', '');
    
    // Get the Job Title input field and hide it by default
    const jobTitle = document.querySelector('#job-title');
    jobTitle.classList.add('d-none');

    // Get the Coding Language block and hide it by default
    const codingLang = document.querySelector('#code-lang');
    codingLang.classList.add('d-none');

    // Disable "required" initially to avoid "not focusable" error
    selectorLang.removeAttribute('required'); // disable required to avoid "not focusable" error

    // Get the "Reason for contacting" select element
    const select = document.querySelector('#reason');

    // Listen for changes in the "reason" dropdown
    select.addEventListener('change', function () {

        // If user selects "job", show job fields and hide coding fields
        if (this.value === 'job') {
            jobTitle.classList.remove('d-none');
            codingLang.classList.add('d-none');

            // Make coding language field required
            selectorLang.setAttribute('required', '');

        }

        // If user selects "code", show coding fields and hide job fields
        else if (this.value === 'code') {
            jobTitle.classList.add('d-none');
            codingLang.classList.remove('d-none');

            // Make coding language field required
            selectorLang.setAttribute('required', '');
        }

    });

    // Get the error message container
    const error = document.querySelector('.alert-text');

    // Get the coding language select element
    const selectorCodingLanguage = document.querySelector('#selectorLang');

    // Validate coding language field when the value changes
    selectorCodingLanguage.addEventListener('change', function () {

        // If no language is selected, mark field as invalid and show message
        if (this.value === '') {
            selectorCodingLanguage.classList.add('invalid');
            selectorCodingLanguage.classList.remove('valid');
            error.textContent = 'Please select a coding language';
        }

        // If a valid option is selected, mark field as valid and clear message
        else if (this.value !== '') {
            selectorCodingLanguage.classList.add('valid');
            selectorCodingLanguage.classList.remove('invalid');
            error.textContent = '';
        }

    });
 
    //errors for field: Name
    const nameError = document.querySelector('#name-error');
    const nameField = document.querySelector('#name');
    // nameField.setAttribute('required', '');
    // nameField.setAttribute('minlength', 3);

    // checking Name
    const checkingFieldName = () => {
        if(nameField.value.length === 0) {
            nameError.textContent = "field requared";
            return false;
        } else if(nameField.value.length < 3) {
            nameError.textContent = "min 3 symbols";
            return false;
        } else {
            nameError.textContent = "";
            return true;
        };
    };

     //errors for field: email
    const emailError = document.querySelector('#email-error');
    const emailField = document.querySelector('#email');
    //emailField.setAttribute('required', '');
    // checking email
    const checkingFieldEmail = () => {
        const emailRegEx = /\w+@\w+\.\w+/;
        if(emailField.value.length === 0) {
            emailError.textContent = "field requared";
            return false;
        } else if(!emailRegEx.test(emailField.value)) {
            emailError.textContent = "must be like mymail@example.com";
            return false;
        } else {
            emailError.textContent = "";
            return true;
        };
    };
    //errors for field: message
    const messageError = document.querySelector('#message-error');
    const messageField = document.querySelector('#textarea')
    //checking messages field
    const checkingFieldMessage = () => {
        if(messageField.value.length === 0) {
            messageError.textContent = "field requared";
            return false;
        } else if(messageField.value.length < 10) {
            messageError.textContent = "min 10 symbols";
            return false;
        } else {
            messageError.textContent = "";
            return true;
        };
    };

    //errors for field: job title
    const jobTitleError = document.querySelector('#job-title-error');
    const jobTitleField = document.querySelector('#job-input');
    const reason = document.querySelector('#reason');
    //validations conditions job title field
    const checkingFieldJobTitle = () => {
       if(reason.value === 'job') { 
        if(jobTitleField.value !== '') {
            jobTitleError.textContent = 'Job title is present';
            return true;
        } else {
            jobTitleError.textContent = 'must be not empty';
            return false;
        }
      };
    };

    const companyError = document.querySelector('#company-error');
    const companyField = document.querySelector('#company-web-input');
    const checkingFieldWebCompany = () => {
        const webRegEx = /https?\:\/\/.+\..+/;
        if(reason.value === 'job') {
            if(companyField.value !== '') {
                if(webRegEx.test(companyField.value)) {
                companyError.textContent = 'Web is present and correct';
                return true;
            }
                } else {
                companyError.textContent = 'must to be https://example.com';
                return false;
                }
            }
        } 


// checking job title field not empty. if yes get 'must be not empty'
    reason.addEventListener('change', checkingFieldJobTitle);        
    jobTitleField.addEventListener('input', checkingFieldJobTitle);    
// checking web company field not empty. if yes get 'must be not empty'    
    reason.addEventListener('change', checkingFieldWebCompany);        
    companyField.addEventListener('input', checkingFieldWebCompany);    

// Validation runs when the button is clicked
    const submit = document.querySelector('.btn-primary');
    submit.addEventListener('click', function(e) {
        e.preventDefault();
        // Run all validation functions/ consts received true or false
       const checkingFieldNameBoolean = checkingFieldName();
       const checkingFieldEmailBoolean = checkingFieldEmail();
       const checkingFieldMessageBoolean = checkingFieldMessage();
       if((checkingFieldNameBoolean && checkingFieldEmailBoolean && checkingFieldMessageBoolean)) {
                    window.location.href = 'page-main.html';
       };

    });

    
});
