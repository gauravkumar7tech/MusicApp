// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const emailUser = (process.env.EMAIL_USER || '').trim();
const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: emailUser,
    to,
    subject: 'Email Verification',
    html: `<p>Please click the link below to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  try {
    if (!emailUser || !emailPass) {
      throw new Error('Gmail email credentials are missing. Set EMAIL_USER and EMAIL_PASS in your .env file.');
    }

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email:', error.message || error);
  }
};

module.exports = {
  sendVerificationEmail,
};
