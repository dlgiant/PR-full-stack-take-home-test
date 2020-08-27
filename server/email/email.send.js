const nodemailer = require("nodemailer");
const { env } = require("./../config")

const credentials = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: env.MAIL_USER,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    refreshToken: env.REFRESH_TOKEN,
    accessToken: env.ACCESS_TOKEN
  }
}

const transporter = nodemailer.createTransport(credentials)

module.exports = async (to, content) => {
  const contacts = {
    from: env.MAIL_USER,
    to
  }
  const email = Object.assign({}, content, contacts);
  await transporter.sendMail(email);
}