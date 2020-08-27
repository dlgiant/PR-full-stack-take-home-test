const sendEmail = require("./email.send");
const msgs = require("./email.msgs");
const templates = require("./email.templates");

import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

exports.collectEmail = (req, res) => {
  const { email } = req.body;
  
  db.from("users")
    .select("id", "email")
    .where({ email: email})
    .first()
    .then((user) =>{
      if (!user) {
        res.json({ msg: "No user with this email" })
      }
      else if (user){
        const token = uuidv4();
        const user_id = user["id"];
        console.log("ID: ", user["id"], user_id);
        
        const forgot_token = {
          user_id: user_id,
          reset_token: token
        }

        console.log("Token obj: ", forgot_token);

        db('forgot_password')
          .insert(forgot_token)
          .then(()=> console.log(`Reset token createad for ${user.email}`))
          .catch((err) => console.log(err))
          .finally(() => db.destroy())

        sendEmail(user.email, templates.confirm(forgot_token))
          .then(() => res.json({ msg: msgs.resend }));
        
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      db.destroy();
    });
}

exports.confirmResetToken = (req, res) => {
  const { reset_token, user_id } = req.params;

  console.log("ID: ", user_id);
  console.log("RESET: ", reset_token);
  db.from('forgot_password')
    .select("user_id", "reset_token", "created_at")
    .where({ 
      user_id: user_id, 
      reset_token: reset_token
    })
    .first()
    .then(reset => {
      if (!reset) {
        res.json({ msg: "Failed to reset password"})
      }
      else if (reset) {
        console.log("Forgot password exists!");
        res.send("/new_password/:user_id");
      }
    })
    .catch(err => console.log(err));
}