const isEmpty = require('is-empty');
const Validator = require('validator');

module.exports = 
    function validateRegistration(data) {
        let errors = {};
        
        data.name = !isEmpty(data.name) ? data.name : "";
        data.email = !isEmpty(data.email) ? data.email : "";
        data.password = !isEmpty(data.password) ? data.password : "";
        data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation: "";

        if (Validator.isEmpty(data.name)) {
            errors.name = "Name is required.";
        }

        if (Validator.isEmpty(data.email)) {
            errors.email = "Email is required."
        } else if (!(Validator.isEmail(data.email))) {
            errors.invalidEmail = "Invalid email."
        }

        if (Validator.isEmpty(data.password)) {
            errors.password = "Password is required.";
        } else if (!(Validator.isLength(data.password, {min: 6 , max: 15}))) {
            errors.invalidPassword = "Password must be 6 to 15 characters."
        }

        if (Validator.isEmpty(data.password_confirmation)) {
            errors.password_confirmation = "Password confirmation is required.";
        }

        if(!(Validator.equals(data.password, data.password_confirmation))) {
            errors.passwordMismatch = "Passwords must match."
        }
        return { errors , isValid: isEmpty(errors) };
    };
