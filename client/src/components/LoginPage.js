import React from 'react';
import axios from  "axios";

import Header from './Header';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name] : e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:5000/api/users/login', {...this.state})
            .then(res => {
                this.props.onLogIn(res.data.user, true);
                localStorage.setItem('token', res.data.token);
                this.props.history.push('/');
            })
            .catch(err => {
                const EMAILNOTFOUND = err.response.data.emailNotFound;
                const PASSWORDINCORRECT = err.response.data.passwordIncorrect;
                const INVALIDEMAIL = err.response.data.invalidEmail;
                if (INVALIDEMAIL) {
                    alert(INVALIDEMAIL);
                } else if (EMAILNOTFOUND) {
                    alert(EMAILNOTFOUND);
                } else if (PASSWORDINCORRECT) {
                    alert(PASSWORDINCORRECT);
                }
            });

        this.setState(
            {
                email: "",
                password: "",
            }
        );
    }
    render() {
        return (
            <div className = "LoginPage">
                <Header loginActive = {"active"}/>
                <p style = {{textAlign: "center", marginTop: 25, color: "black", fontSize: 20}}>
                    Log in below!
                </p>
                <LoginForm info = {this.state} onChange = {this.handleChange} onSubmit = {this.handleSubmit}/>
            </div>
        )
    }
}
export default LoginPage;