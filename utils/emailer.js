require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Configs
const expiresIn = '6m'; // link expiration time
const resendCooldown = 60000; // resend email cooldown in Milliseconds
const cleanInterval = 300000; // tokenstore cleaning interval in Milliseconds

const {
  SMTP_HOST,
  SMTP_PORT=587,
  SMTP_USERNAME ,
  SMTP_PASSWORD,
  SMTP_SECURE = null,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT == 465 ? true : SMTP_SECURE ?? false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: "SOC JOBS",
  // to: "armajid2002@gmail.com",
  subject: "test-socjobs ",
  // text: `link verifikasi - `,
};


// Logics
const tokenStore = {};

const verifyAndInvalidateLatestToken = (email, token) => {
  const storedToken = tokenStore[email];
  if (storedToken === token){
    try {
      delete tokenStore[email];
    } catch (delErr) {
      console.error(delErr);
    }
    return true;
  }
  return false;
};

const sendAuthEmail = async (req,res,name,data, email, hostUrl, getText) => {
  const emailerResult = await createLink(data, email, hostUrl,name, getText);
  if (emailerResult === "success")
    return res.status(200).json({
      message: `${name} email sent`,
    });
  if (emailerResult === "notsent")
    return res.status(400).json({
      message: `${name} email not sent`,
    });
  // else
  return res.status(400).json({
    message: `${name} email not sent - please wait`,
    cooldown: emailerResult,
  });
};

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

const createLink = async (data,email,hostUrl,name,getText) => {
  const token = jwt.sign(data, process.env.JWT_SECRET,{expiresIn});
  if(tokenStore[email]){
    const iat = jwt.decode(tokenStore[email]).iat*1000;
    const now = new Date().getTime();
    const diff = now - iat;
    console.log(diff)
    if (diff < resendCooldown) return resendCooldown - diff;
  }
  return await sendEmail(
    { ...mailOptions, subject:mailOptions.subject+name, to: email, html: getText(hostUrl,token, data) }
  ).then(() => {
    tokenStore[email] = token;
    console.log("Updated tokenStore:", tokenStore);
    return "success";
  })
  .catch((e) => {
    console.error(e);
    return "notsent";
  });
  
}
const cleanExpired = ()=>{
  // console.log("cleaning tokenStore");
  // console.log(tokenStore);
  let count = 0;
  for (const [email, token] of Object.entries(tokenStore)){
      try {
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
    };
  console.log(`${count} token(s) is invalid and removed from email TokenStore`);
  setTimeout(cleanExpired,cleanInterval)
}

cleanExpired(); // start clean interval loop

// Module Exports
module.exports = {
  createLink,
  sendAuthEmail,
  verifyAndInvalidateLatestToken,
};