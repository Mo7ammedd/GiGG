const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmail = async ({
  email,
  subject,
  type,
  username,
  otp,
  profileLink,
  supportLink,
}) => {
  try {
    if (!type) {
      throw new Error("Invalid email type specified");
    }

    const templatePath = path.join(__dirname, `../utils/${type}.html`);

    const template = await fs.promises.readFile(templatePath, "utf-8");

    const htmlContent = template
      .replace("{{username}}", username || "User")
      .replace("{{otp}}", otp || "")
      .replace("{{profileLink}}", profileLink || "#")
      .replace("{{supportLink}}", supportLink || "#");

    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "medo.mostafa22255@icloud.com",
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
