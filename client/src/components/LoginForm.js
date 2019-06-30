import React from 'react';

import '../css/Form.css';

function LoginForm(props)  {

    return (
        <div className = "Login">
            <div className = "col-sm-3" id ="myForm">
                <form onSubmit = {props.onSubmit} >
                    <div className="form-group mt-3">
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
                    <div className="text-center mb-3">
                        <button type="submit" className="button">Log in</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;