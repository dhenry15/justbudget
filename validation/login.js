const isEmpty = require('is-empty');
const Validator = require('validator');

module.exports = 
    function validateLogin(data) {
        let errors = {};

        data.email = !isEmpty(data.email) ? data.email : "";
        data.password = !isEmpty(data.password) ? data.password : "";
        
        if (Validator.isEmpty(data.email)) {
            errors.email = "Email is required."
        } else if (!(Validator.isEmail(data.email))) {
            errors.invalidEmail = "Invalid email."
        }

        if (Validator.isEmpty(data.password)) {
            errors.password = "Password is required.";
        } 

        return { errors , isValid: isEmpty(errors) };
    };