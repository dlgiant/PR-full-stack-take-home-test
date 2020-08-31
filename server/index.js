require('dotenv').config()
import React from 'react';
import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import path from "path";
import ReactDOMServer from "react-dom/server";
import fs from 'fs';
import serialize from 'serialize-javascript';

const cors = require("cors");

import { env } from "./config";
import { strategy  } from "./lib/passport";
import devBundle from './devBundle';
import { matchPath, StaticRouter } from "react-router-dom";
import App from "./../shared/App";
import Routes from '../shared/routes';

const { collectEmail, confirmResetToken, redirectToNewPassword, setNewPassword } = require("./forgotPassword/forgot.controller");

// Passport setup
passport.use(strategy);
// passport.use(ResetStrategy);
passport.serializeUser((user, done) => {
  const { auth0_id, created_at, updated_at, ...safeUser } = user;
  done(null, safeUser);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// API
const api = express.Router();
api.get("/session", (req, res) => res.send({ foo: "bar" }));
api.post(
  "/session",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

// Express app
const cookieConfig = {
  cookie: {
    httpOnly: true,
    secure: env.isProduction,
    maxAge: null,
  },
  secret: env.SESSION_SECRET,
};
const app = express();
devBundle.compile(app);
app.use(express.static("dist/client"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession(cookieConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());


api.get("/wake-up", (req, res) => res.json('Server is awake!'));

// Receives email from client
api.post("/forgotpassword", collectEmail);
api.get("/resetpassword/:token/:user_id", confirmResetToken);

api.post("/setnewpassword/:user_id/:password", setNewPassword);

app.get("/newpassword/:user_id", redirectToNewPassword);

app.use("/api", api);

app.get("/*", (req, res) => {
  const currentRoute = Routes.find(route => matchPath(req.url, route)) || {};
  let promise;

  console.log(currentRoute);
  if (currentRoute.loadData){
    promise = currentRoute.loadData();
  } else {
    promise = Promise.resolve(null);
  }

  promise.then(data => {
    const context = { data };
    const app = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    );

    const indexFile = path.resolve('./public/index.html');
    fs.readFile(indexFile, 'utf-8', (err, indexData) => {
      if (err) {
        console.error("Error: ", err);
        return res.status(500).send('Sorry, something is not right');
      }

      if (context.status === 404){
        res.status(404);
      }

      if (context.url) {
        console.log(`Redirected to ${context.url}`);
        return res.redirect(301, context.url);
      }

      return res.send(
        indexData
          .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
          .replace(
            '</body>',
            `<script>window.__ROUTE_DATA__ = ${serialize(data)}</script></body>`
          )
      );
    })
  })
});

// Return web application for any unrecognized path
app.use((req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

// Boot it up!
app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
