const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.me.com",
    port: 587,
    secure: false, // Use true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // Your iCloud email
      pass: process.env.EMAIL_PASSWORD, // Your iCloud app-specific password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "medo.mostafa22255@icloud.com", // Must match the iCloud account's email
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
