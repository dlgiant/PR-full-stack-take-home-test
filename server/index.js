require('dotenv').config()
import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import path from "path";

const cors = require("cors");

import { env } from "./config";
import { strategy, ResetStrategy } from "./lib/passport";
import devBundle from './devBundle';

const emailController = require("./email/email.controller");
const { PORT, CLIENT_ORIGIN, DB_URL } = require("./config");

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

api.get("/forgotpassword", (req, res) => {
  console.log("Forgoto Passwordo!");
  res.json(req.hash);
});

// api.post("/forgotpassword", (req, res) => {
//     console.log("RESET TOKEN: ", req.query.reset_token);
//     console.log("USER ID: ", req.query.user_id);
//     // console.log(res);
//   }
// );

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
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());


api.get("/wake-up", (req, res) => res.json('Server is awake!'));
api.post("/email", emailController.collectEmail);
api.post("/forgotpassword/:reset_token/:user_id", emailController.confirmResetToken);

app.use("/api", api);

// Return web application for any unrecognized path
app.use((req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});


app.use('*', (req, res) => {
  res.status(404).json({ msg: "Page not found!" })
});

// Boot it up!
app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
