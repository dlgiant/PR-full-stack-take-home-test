const envalid =require("envalid");
const { str, port } = envalid;

export const env = envalid.cleanEnv(process.env, {
  SESSION_SECRET: str({ default: "ChangeMe" }),
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ default: "development" }),
  MAIL_USER: str({ default: "ricktestsapps@gmail.com"}),
  MAIL_PASS: str({ default: "pass" }),
  CLIENT_ID: str({ default: "" }),
  CLIENT_SECRET: str({ default: "" }),
  REFRESH_TOKEN: str({ default: "" }),
  ACCESS_TOKEN: str({ default: "" }),
  CLIENT_ORIGIN: str({ default: "http://localhost:3000"})
});