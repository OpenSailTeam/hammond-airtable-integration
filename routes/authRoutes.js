// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Route to initiate the OAuth2 flow
router.get('/google', (req, res) => {
  const url = authService.getAuthUrl();
  res.redirect(url);
});

// OAuth2 callback route
router.get('/google/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No authorization code provided.');
  }

  try {
    const tokens = await authService.getTokens(code);
    res.status(200).send('Authorization successful. Tokens have been saved.');
  } catch (err) {
    console.error('Error exchanging code for tokens:', err);
    res.status(500).send('Error during authentication.');
  }
});

// Route to refresh the access token manually (if needed)
router.get('/google/refresh', async (req, res) => {
  try {
    await authService.refreshAccessToken();
    res.status(200).send('Access token refreshed successfully.');
  } catch (err) {
    console.error('Error refreshing access token:', err);
    res.status(500).send('Error refreshing access token.');
  }
});

module.exports = router;
