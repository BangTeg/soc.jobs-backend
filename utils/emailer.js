require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../config/emailerConfig");

const {
  expiresIn,
  resendCooldown,
  cleanInterval,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_SECURE,
  mailOptions,
} = config;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT == 465 ? true : SMTP_SECURE ?? false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

// CONVENTIONS
// AUTH EMAIL = password reset and email verification

// Email Logics

// send an email (sendMail wrapped in promise)
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        reject(error); // Reject the promise with the error
      } else {
        console.log("Email sent:", info.response);
        resolve(true); // Resolve the promise with a value (true in this case)
      }
    });
  });
};

// Send an Auth email
const sendAuthEmail = async (req, res, name, data, email, hostUrl, getText) => {
  // Check email's cooldown in tokenStore
  if (tokenStore[email]) {
    const iat = jwt.decode(tokenStore[email]).iat * 1000;
    const now = new Date().getTime();
    const diff = now - iat;
    console.log(diff);
    if (diff < resendCooldown) {
      return res.status(400).json({
        message: `${name} email not sent - please wait`,
        cooldown: resendCooldown - diff,
      });
    }
  }

  // // Send email with token
  // const createLink = async (data, email, hostUrl, name, getText) => {
  //   const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn });

  //   return await sendEmail({
  //     ...mailOptions,
  //     subject: mailOptions.subjectPrefix + name,
  //     to: email,
  //     html: getText(hostUrl, token, data),
  //   })
  //     .then(() => {
  //       tokenStore[email] = token;
  //       console.log("Updated tokenStore:", tokenStore);
  //       return "success";
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       return "notsent";
  //     });
  // };
  // const emailerResult = await createLink(data, email, hostUrl, name, getText);

  // Send email with token
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
  const emailerResult = await sendEmail({
    ...mailOptions,
    subject: mailOptions.subjectPrefix + name,
    to: email,
    html: getText(hostUrl, token, data),
  })
    .then(() => {
      tokenStore[email] = token;
      console.log("Updated tokenStore:", tokenStore);
      return "success";
    })
    .catch((e) => {
      console.error(e);
      return "not sent";
    });

  if (emailerResult === "success")
    return res.status(200).json({
      message: `${name} email sent`,
    });
  // else
  // if (emailerResult === "not sent")
  return res.status(400).json({
    message: `${name} email not sent`,
  });
};

// Verification Token Logics

// Temporarily stores all sent jwt token and its email and cooldown
const tokenStore = {};

// Verify token in tokenStore
const verifyAndInvalidateLatestToken = (email, token) => {
  const storedToken = tokenStore[email];
  if (storedToken === token) {
    try {
      delete tokenStore[email];
    } catch (delErr) {
      console.error(delErr);
    }
    return true;
  }
  return false;
};

// Remove expired tokens from tokenStore (called every set interval)
const cleanExpired = () => {
  // console.log("cleaning tokenStore");
  // console.log(tokenStore);
  let count = 0;
  for (const [email, token] of Object.entries(tokenStore)) {
    try {
      // verify the token (check if the token is still valid)
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      // Add this line to log the token payload
      // console.log("Token Payload:", verified);
      // console.log("Token Payload:", new Date().getTime());
    } catch (err) {
      // console.log(`${token} is invalid and removed`);
      try {
        delete tokenStore[email];
        count += 1;
      } catch (delErr) {
        console.error(delErr);
      }
    }
  }
  console.log(`${count} token(s) is invalid and removed from email TokenStore`);
  setTimeout(cleanExpired, cleanInterval);
};

cleanExpired(); // start cleanExpired interval loop

// Module Exports
module.exports = {
  sendEmail,
  sendAuthEmail,
  verifyAndInvalidateLatestToken,
};
