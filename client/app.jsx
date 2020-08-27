import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Forgot from "./components/forgot";
import { Home } from "./components/home";
import { Login } from "./components/login";
import { Dashboard } from "./components/dashboard";
import { API_URL } from "./config"
import Notifications from "react-notify-toast";
import ConfirmEmail from "./components/confirm";
import { BrowserRouter as Router } from "react-router-dom";

const loginLayoutStyle = {
  width: "400px",
  margin: "0 auto",
};

export default class App extends Component {
  state = {
    loading: true
  }

  componentDidMount = () => {
    fetch(`${API_URL}/wake-up`)
      .then(res => res.json())
      .then(() => {
        this.setState({ loading: false })
      })
      .catch(err => console.log(err))
  }

  render = () => {
    const content = () => {
      return (
        <Router>
          <div style={loginLayoutStyle}>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/forgot">
                <Forgot />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path='/confirm/:id'>
                <ConfirmEmail />
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
    return (
      <div className="container fadeIn">
        <Notifications />
        <main>
          {content()}
        </main>
      </div>
    )
  }
}