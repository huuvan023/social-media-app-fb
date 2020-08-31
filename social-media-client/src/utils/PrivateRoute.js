import React from 'react'
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
    render = {(props) => authenticated === false ? <Redirect to="/login"/> : <Component {...rest}/>}
    />
)

export default PrivateRoute;