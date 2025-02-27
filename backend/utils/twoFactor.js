const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generateSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

const verifyCode = (secret, code) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 1,
  });
};

module.exports = { generateSecret, verifyCode };