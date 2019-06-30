import React from 'react';
import axios from  "axios";

import Header from './Header';
import RegisterForm from './RegisterForm';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({[e.target.name] : e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:5000/api/users/register', {...this.state})
            .then(res => {
                this.props.onLogIn(res.data.user, true);
                localStorage.setItem('token', res.data.token);
                this.setState(
                    {
                        name: "",
                        email: "",
                        password: "",
                        password_confirmation: ""
                    }
                );
                this.props.history.push('/');
            })
            .catch(err => {
                const INVALIDEMAIL = err.response.data.invalidEmail;
                const INVALIDPASSWORD = err.response.data.invalidPassword
                const PASSWORDMISMATCH = err.response.data.passwordMismatch;
                const EMAILEXISTS = err.response.data.emailExists;
                
                if (INVALIDEMAIL) {
                    alert(INVALIDEMAIL);
                    this.setState({email: ""});
                } else if (EMAILEXISTS) {
                    alert(EMAILEXISTS);
                    this.setState({email: ""});
                } else if (INVALIDPASSWORD) {
                    alert(INVALIDPASSWORD);
                    this.setState({
                        password: "",
                        password_confirmation: ""
                    });
                } else if (PASSWORDMISMATCH) {
                    alert(PASSWORDMISMATCH);
                    this.setState({
                        password: "",
                        password_confirmation: ""
                    });
                }
            });
    }
    render() {
        return (
            <div className = "RegisterPage">
                <Header registerActive = {"active"}/>
                <p style = {{textAlign: "center", marginTop: 25, color: "black", fontSize: 20}}>
                    Register below!
                </p>
                <RegisterForm info = {this.state} onChange = {this.handleChange} onSubmit = {this.handleSubmit}/>
            </div>
        )
    }
}
export default RegisterPage;