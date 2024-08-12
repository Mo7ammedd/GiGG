const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const generateEmailHTML = (username, changeType, newValue) => {
    const templatePath = path.join(__dirname, '../utils/emailUpdate.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    template = template.replace('{{username}}', username)
                       .replace('{{changeType}}', changeType)
                       .replace('{{newValue}}', newValue);

    return template;
};

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.me.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'medo.mostafa22255@icloud.com',
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { generateEmailHTML, sendEmail };
