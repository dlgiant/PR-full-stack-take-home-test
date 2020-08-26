import React from "react";
import { Link, Router, Route } from "react-router-dom";

export const Login = (props) => (
  <div>
    <Link to="/" style={{ float: "right" }}>
      Home
    </Link>
    <h1>Login</h1>
    <form action="/api/session" method="post">
      Email:
      <input name="email" type="email" />
      <br />
      Password:
      <input name="password" type="password" />
      <br />
      <button type="submit">Submit</button>
    </form>
    <Link to="/forgot">Forgot Password</Link>
  </div>
);
