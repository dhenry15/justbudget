import React from "react";
import { Redirect } from 'react-router-dom';

//Control Component?
class Logout extends React.Component {
    componentDidMount() {
        this.props.onLogOut();
    }
    render() {
        return (
            <Redirect to = "/" />
        )
    }
}

export default Logout;