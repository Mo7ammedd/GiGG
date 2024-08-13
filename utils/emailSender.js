const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);

const replacePlaceholders = (template, replacements) => {
  let html = template;
  for (const key in replacements) {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), replacements[key]);
  }
  return html;
};

const sendEmail = async (options) => {
  const templatePath = path.join(__dirname, "../utils/emailUpdate.html");
  const template = await readFile(templatePath, "utf-8");

  const htmlContent = replacePlaceholders(template, {
    username: options.username || 'User',
    changeType: options.changeType || 'information',
    newValue: options.newValue || '',
    profileLink: options.profileLink || '#',
    supportLink: options.supportLink || '#',
  });

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
    to: options.email,
    subject: options.subject,
    html: htmlContent, 
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
