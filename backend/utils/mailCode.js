const nodemailer = require('nodemailer');

const sendMailCode = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Your 2-Step Verification Code',
    text: `Your verification code is: ${code}`,
  });
};

module.exports = sendMailCode;