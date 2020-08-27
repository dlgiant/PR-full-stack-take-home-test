const { env } = require("../config");

module.exports = {
  confirm: (forgot_token) => ({
    subject: "Reset Password",
    html: `
      <a href='${env.CLIENT_ORIGIN}/resetpassword/${forgot_token.reset_token}/${forgot_token.user_id}'>
        click to reset
      </a>
    `,
    text: `Copy and paste this link: ${env.CLIENT_ORIGIN}/resetpassword/${forgot_token.reset_token}/${forgot_token.user_id}`
  })
};