import React from 'react';
import { NavLink } from 'react-router-dom';
 
function Header(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style = {{backgroundColor: "#d4f0ff"}}>
            <span className="navbar-brand mb-0 h1">JustBudget</span>
    
            <ul className="navbar-nav mr-auto">

            <li className={"nav-item " + props.homeActive}>
                <NavLink to = "/" exact className="nav-link" >Home</NavLink>
            </li>
            <li className={"nav-item " + props.transactionsActive}>
                <NavLink to = "transactions" className="nav-link" >Transactions</NavLink>
            </li>
            
            </ul>
            
            <ul className="navbar-nav ml-auto">
            {props.loggedIn ? (
                <li className={"nav-item " + props.logoutActive}>
                    <NavLink to = "logout" className="nav-link">Logout</NavLink>
                </li>
            ) : (
                <>
                <li className={"nav-item " + props.registerActive}>
                    <NavLink to = "register" className="nav-link">Register</NavLink>
                </li>
            
                <li className= {"nav-item " + props.loginActive}>
                    <NavLink to = "login" className="nav-link">Login</NavLink>
                </li>
                </>
            )}

            </ul>
        </nav>
    )
}

export default Header;