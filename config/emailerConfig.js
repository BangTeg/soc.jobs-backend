require("dotenv").config();

// Configs
const expiresIn = '6m'; // link expiration time
const resendCooldown = 60000; // resend email cooldown in Milliseconds
const cleanInterval = 300000; // tokenstore cleaning interval in Milliseconds

const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_SECURE = null,
} = process.env;

const mailOptions = {
  from: "tegardanardana991@gmail.com",
  // to: "@gmail.com",
  subjectPrefix: "test-socjobs ",
  // text: `link verifikasi - `,
};

module.exports = {
  expiresIn,
  resendCooldown,
  cleanInterval,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME ,
  SMTP_PASSWORD,
  SMTP_SECURE,
  mailOptions
}