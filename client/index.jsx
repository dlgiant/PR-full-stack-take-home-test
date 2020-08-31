import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "../shared/App";

const wrapper = document.getElementById("root");
ReactDOM.hydrate(
  <Router>
    <App />
  </Router>, 
  wrapper);
