const express = require('express');
const passport = require('passport');
const { register, login, verify2FA } = require('../middleware/auth');

const router = express.Router();

// Local authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa', verify2FA);

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json({ message: 'Google account connected', user: req.user });
  }
);

module.exports = router;