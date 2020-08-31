const { env } = require("../config");

module.exports = {
  confirm: (user_id, token) => ({
    subject: "Reset Password",
    html: `
      <a href='${env.CLIENT_ORIGIN}/resetpassword/${token}/${user_id}'>
        click to reset
      </a>
    `,
    text: `Copy and paste this link: ${env.CLIENT_ORIGIN}/resetpassword/${token}/${user_id}`
  })
};