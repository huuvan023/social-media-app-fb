import React, { useContext, useState,useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import AuthRoute from './utils/AuthRoute';
import PrivateRoute from './utils/PrivateRoute';
import SignUp from './pages/signup';
import jwtDecode from 'jwt-decode';
import Example02 from './pages/test';
import { store } from './store/store';


function App() {
  const globalState = useContext(store)
  const { dispatch } = globalState;

  useEffect(() => {
    const token = localStorage.getItem("FBIDToken");
    if( token ) {
      const decodedToken = jwtDecode(token);
      if( decodedToken.exp * 1000 < Date.now() ) {
        dispatch({
          type: "SET_UNAUTHENTICATED"
        })
      }
      else {
        dispatch({
          type: "SET_AUTHENTICATED"
        })
      }
    }
    else {
      dispatch({
        type: "SET_UNAUTHENTICATED"
      })
    }
    
  },[])

  return (
    
        <div className="App">
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={Home} authenticated={ globalState.state.authenticated }/>
              <Route path="/test" component={Example02}/>
              <AuthRoute exact path="/login" component={Login} authenticated={ globalState.state.authenticated } />
              <AuthRoute exact path="/signup" component={SignUp} authenticated={ globalState.state.authenticated } />
            </Switch>
          </Router>
        </div>
   
    
  );
}

export default App;
