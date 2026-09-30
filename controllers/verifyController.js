// controllers/verifyController.js
const User = require("../models/Users.js");
const crypto = require('crypto');

const hashVerificationCode = (email, code) => crypto
  .createHmac('sha256', process.env.SESSION_SECRET || 'development-only-secret')
  .update(`${email}:${code}`)
  .digest('hex');

const deliverCode = async (user, code) => {
  const {
    sendVerificationOtpEmail,
    sendVerificationOtpSms,
  } = require('../services/emailService.js');

  if (user.verificationMethod === 'email') {
    await sendVerificationOtpEmail(user.email, code);
    return;
  }

  const countryCodes = {
    Australia: '+61',
    India: '+91',
    'United States': '+1',
    'United Kingdom': '+44',
  };
  const nationalNumber = ['Australia', 'United Kingdom'].includes(user.country)
    ? user.phone.replace(/^0/, '')
    : user.phone;
  await sendVerificationOtpSms(`${countryCodes[user.country]}${nationalNumber}`, code);
};

const verifyOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const code = (req.body.code || '').trim();
    if (!email || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Enter your email and 6-digit verification code.' });
    }

    const user = await User.findOne({ email, isVerified: false });
    if (!user || !user.verificationCodeHash) {
      return res.status(400).json({ success: false, message: 'No pending verification was found for that email.' });
    }
    if (user.verificationCodeExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'That code has expired. Request a new code.' });
    }
    if (user.verificationAttempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Request a new code.' });
    }

    const expectedHash = Buffer.from(hashVerificationCode(email, code), 'hex');
    const storedHash = Buffer.from(user.verificationCodeHash, 'hex');
    if (expectedHash.length !== storedHash.length || !crypto.timingSafeEqual(expectedHash, storedHash)) {
      user.verificationAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: 'The verification code is incorrect.' });
    }

    user.isVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpiresAt = undefined;
    user.verificationCodeSentAt = undefined;
    user.verificationAttempts = 0;
    await user.save();

    res.json({ success: true, message: 'Your account is verified. You can now sign in.' });
  } catch (error) {
    console.error('OTP verification error:', error.message || error);
    res.status(500).json({ success: false, message: 'Could not verify the code. Please try again.' });
  }
};

const resendOtp = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email, isVerified: false });
    if (!user || !user.verificationMethod) {
      return res.status(400).json({ success: false, message: 'No pending verification was found for that email.' });
    }
    if (user.verificationCodeSentAt && Date.now() - user.verificationCodeSentAt.getTime() < 60_000) {
      return res.status(429).json({ success: false, message: 'Wait one minute before requesting another code.' });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    await deliverCode(user, code);
    user.verificationCodeHash = hashVerificationCode(email, code);
    user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.verificationCodeSentAt = new Date();
    user.verificationAttempts = 0;
    await user.save();
    res.json({ success: true, message: `A new code was sent to your ${user.verificationMethod}.` });
  } catch (error) {
    console.error('OTP resend error:', error.message || error);
    res.status(500).json({ success: false, message: 'Could not resend the code. Check your provider settings and try again.' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email verified successfully. You can now log in.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  verifyEmail,
  verifyOtp,
  resendOtp,
};
