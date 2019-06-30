import React from "react";
import Header from "./Header";
import axios from 'axios';
import Budget from './Budget';

class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            budgets: {}
        }
    }


    componentDidMount() {
        if (this.props.loggedIn) {
            axios.get('http://localhost:5000/api/users/getbudgets',
                {
                headers: {
                        Authorization: localStorage.getItem('token')
                } 
            }).then(res => this.setState({
                budgets: res.data.budgets
                })
            ).catch(err => console.log(err.response));
        }
    }

    render() {
        return (
            <div className  = "HomePage">
                <Header homeActive = {"active"} loggedIn =  {this.props.loggedIn}/>
                {this.props.loggedIn ? (
                    <>
                    <h2 style = {{textAlign: "center", marginTop: 25}}>Hello, {this.props.user.name}!</h2>
                    <Budget loggedIn = {this.props.loggedIn}/>
                    </>
                ) : (
                    <h2 style = {{textAlign: "center", marginTop: 25}}>Please log in or register to begin!</h2>
                )}

            </div>
        )
    }

}

export default HomePage;