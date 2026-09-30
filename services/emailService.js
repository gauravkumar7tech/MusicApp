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
    throw error;
  }
};

const sendVerificationOtpEmail = async (to, code) => {
  if (!emailUser || !emailPass) {
    throw new Error('Email verification requires EMAIL_USER and EMAIL_PASS.');
  }

  await transporter.sendMail({
    from: emailUser,
    to,
    subject: 'Your SoundSpot verification code',
    text: `Your SoundSpot verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your SoundSpot verification code is:</p><strong style="font-size:24px;letter-spacing:4px">${code}</strong><p>It expires in 10 minutes. If you did not create an account, ignore this email.</p>`,
  });
};

const sendVerificationOtpSms = async (to, code) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Phone verification requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.');
  }

  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Body: `Your SoundSpot verification code is ${code}. It expires in 10 minutes.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Twilio could not send the verification message (HTTP ${response.status}).`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationOtpEmail,
  sendVerificationOtpSms,
};
