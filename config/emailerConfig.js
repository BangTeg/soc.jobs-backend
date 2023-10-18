// Import and configure the dotenv package to load environment variables from a .env file.
require("dotenv").config();

// Configuration Constants
const expiresIn = '6m'; // Expiration time for verification links (6 minutes).
const resendCooldown = 60000; // Cooldown period for resending emails in milliseconds (60 seconds).
const cleanInterval = 300000; // Interval for cleaning token store in milliseconds (5 minutes).

// Destructure the relevant environment variables for SMTP (email) configuration.
const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_SECURE = null, // Default to null if not specified.
} = process.env;

// Define default email options.
const mailOptions = {
  from: SMTP_USERNAME, // Sender's email address.
  // to: "@gmail.com", // Recipient's email address (commented out, should be defined when used).
  subjectPrefix: "SOC JOBS ", // Prefix for email subjects.
  // text: `link verifikasi - `, // Text for email content (commented out, should be defined when used).
};

// Export the configuration for the emailer, including constants, SMTP settings, and email options.
module.exports = {
  expiresIn,
  resendCooldown,
  cleanInterval,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_SECURE,
  mailOptions
};
