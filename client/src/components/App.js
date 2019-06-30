import React from 'react';
import { Route, Switch } from "react-router-dom";

import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import Logout from './Logout';
import TransactionsPage from './TransactionsPage';

import '../css/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {
      user: {},
      loggedIn: false
    }
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route 
            path='/' exact
            render={ (props) =>  <HomePage 
              {...props}
              {...this.state}/>
            }/> 
          <Route 
            path='/register' exact
            render={ (props) =>  <RegisterPage 
              {...props}
              {...this.state}
              onLogIn = {this.handleLogIn}/>
            }/>
          <Route 
            path='/login' exact
            render={ (props) =>  <LoginPage 
              {...props}
              {...this.state} 
              onLogIn = {this.handleLogIn}/>
            }/>  
          <Route 
            path='/logout' exact
            render={ (props) =>  <Logout
              {...props}
              {...this.state} 
              onLogOut = {this.handleLogOut}/>
            }/>
          <Route 
            path='/transactions' exact
            render={ (props) =>  <TransactionsPage 
              {...props}
              {...this.state}
              onLogIn = {this.handleLogIn}/>
            }/> 
        </Switch>

      </div>
    )
  }

  //save state on refresh
  componentDidMount() {
    this.localStorageToState();

    window.addEventListener(
      "beforeunload",
      this.stateToLocalStorage.bind(this)
    );
  }
  componentWillUnmount() {
    this.stateToLocalStorage();
  }
  localStorageToState() {
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        value = JSON.parse(value);
        this.setState({ [key]: value });
      }
    }
  }
  stateToLocalStorage() {
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }


  handleLogIn(user, loggedIn) {
    this.setState({user, loggedIn});
    console.log(this.state);
  }
  handleLogOut() {
    this.setState({
      user: {},
      loggedIn: false
    })
    localStorage.removeItem('token');
  }

}

export default App;
