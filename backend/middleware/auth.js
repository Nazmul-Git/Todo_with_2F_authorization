const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const { totp } = require('otplib'); 


const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Generate a secret key for Google Authenticator
    const secret = speakeasy.generateSecret({ length: 20 });

    const user = new User({ email, password, twoFactorSecret: secret.base32 });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a 6-digit code for Mail Code 2-Step using the user's stored secret
    const mailCode = speakeasy.totp({
      secret: user.twoFactorSecret, // Use the user's stored 2FA secret
      digits: 6,
    });

    // Send the code via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: 'Your 2-Step Verification Code',
      text: `Your Mail Code is ${mailCode}. It will expire in 2 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with the temporary secret and require 2FA
    res.status(200).json({
      message: 'Code sent to email',
      tempSecret: user.twoFactorSecret,
      requires2FA: true,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const verify2FA = async (req, res) => {
  const { email, token } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Verify the 2FA token
    const isValid = totp.verify({
      secret: user.twoFactorSecret,
      token: token,                 
      window: 1,                    
    });
    console.log(isValid)

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid 2FA code' });
    }

    // If verification is successful, generate a JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: '2FA verification successful',
      token: jwtToken,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login, verify2FA };