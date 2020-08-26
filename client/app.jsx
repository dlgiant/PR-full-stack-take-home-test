import React from "react";
import { Switch, Route } from "react-router-dom";

import { Home } from "./components/home";
import { Login } from "./components/login";
import { Dashboard } from "./components/dashboard";
import { Forgot } from "./components/forgot";

const loginLayoutStyle = {
  width: "400px",
  margin: "0 auto",
};

export const App = () => (
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
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </div>
);
