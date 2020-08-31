const sendEmail = require("./forgot.send");
const moment = require('moment');
var util = require('util');
const msgs = require("./forgot.msgs");
const templates = require("./forgot.templates");
const bcrypt = require("bcrypt");

import React from 'react';
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";
import ReactDOMServer from 'react-dom/server';
import NewPassword from '../../shared/newpassword';


function upsertResetPassword(table, row) {
  return db.transaction((trx) => {
    // Defining upsert operation
    let query = trx.raw(
      util.format('%s ON CONFLICT (user_id) DO UPDATE SET %s',
        trx(table).insert(row).toString().toString(),
        trx(table).update({
          count_checks: db.raw('?? + 1', 'forgot_password.count_checks')
        }).whereRaw(`${table}.user_id = '${row.user_id}'`).toString().replace(/^update\s.*\sset\s/i, '')
      )
    ).transacting(trx)
    return Promise.resolve(query).then(trx.commit).catch((err) => {console.log(err); trx.rollback})
  })
}

function sendResetPasswordEmail(user_id, response, email){
  db('forgot_password')
    .select("user_id", "token", "count_checks")
    .where({ user_id: user_id })
    .first()
    .then((fp) => {
      if (fp) {
        sendEmail(email, templates.confirm(fp["user_id"], fp["token"]))
          .then(() => response.json({ 
            msg: fp["count_checks"] > 0 ? msgs.resend : msgs.confirm
          }))
      }})
    .catch((err) => console.log(err))
}

exports.collectEmail = (req, res) => {
  const { email } = req.body;
  
  db.from("users")
    .select("id")
    .where({ email: email})
    .first()
    .then((user) => {
      if (!user) {
        res.json({ msg: "No user with this email" })
      } else if (user){
        const user_id = user["id"];
        const token = uuidv4();

        const forgot_row = {
          user_id: user_id,
          token: token
        }
        console.log(forgot_row);

        upsertResetPassword('forgot_password', forgot_row)
          .then(() => sendResetPasswordEmail(user_id, res, email))
          .catch((err) => console.log(err));
      }
    })
    .catch(err => console.log(err));
}

exports.confirmResetToken = (req, res) => {
  const { token, user_id } = req.params;
  db('forgot_password')
    .update({setting_password: true})
    .where({user_id: user_id, token: token})
    .then(reset => {
      if (!reset) {
        req.session.settingPassword = false;
        res.json({msg: "Something is not right"})
      } else if (reset) {
        req.session.settingPassword = true;
        res.redirect(`/newpassword/${user_id}`)
      }
    })
    .catch(err => console.log(err));
}

exports.redirectToNewPassword = (req, res) => {
  const { user_id } = req.params;
  res.send(`
    <!DOCTYPE HTML>
    <html>
      <main id="newpass">
        ${ReactDOMServer.renderToString(<NewPassword user_id={user_id} />)}
      </main>
    </html>
  `)
}

exports.setNewPassword = (req, res) => {
  const { user_id, password } = req.params;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    db("users")
      .update({ auth0_id: "local|"+hash})
      .where({id: user_id})
      .then(msg => {
        console.log("MSG: ", msg ? msg : "No message")
      })
      .catch(err => console.log(err))
  })
}