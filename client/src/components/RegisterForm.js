import React from 'react';

import '../css/Form.css';

function RegisterForm(props)  {

    return (
        <div className = "Register">
            <div className = "col-sm-3" id ="myForm">
                <form onSubmit = {props.onSubmit} >
                    <div className="form-group mt-3">
                        <label htmlFor="name">Name:</label>
                        <input 
                            type = "text" 
                            className = "form-control" 
                            id = "name" 
                            name = "name"
                            aria-describedby = "name" 
                            value = {props.info.name}
                            onChange = {props.onChange}
                            placeholder = "Enter your name"
                        required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input type="text"
                            className = "form-control"
                            id = "email" 
                            name  = "email"
                            aria-describedby = "email" 
                            value = {props.info.email}
                            onChange = {props.onChange}
                            placeholder = "Enter your email"
                        required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type = "password" 
                            className = "form-control" 
                            id = "password" 
                            name = "password"
                            value = {props.info.password}
                            onChange = {props.onChange}
                            placeholder = "Password"
                        required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password Confirmation:</label>
                            <input 
                                type = "password" 
                                className = "form-control mb-2" 
                                id = "password_confirmation" 
                                name = "password_confirmation"
                                value = {props.info.password_confirmation}
                                onChange = {props.onChange}
                                placeholder = "Password Confirmation"
                            required/>
                    </div>
                    <div className="text-center mb-3">
                        <button type="submit" className="button">Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm;