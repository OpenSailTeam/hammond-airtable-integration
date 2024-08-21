// src/services/authService.js
const { UserRefreshClient } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Load OAuth2 credentials from environment variables or a configuration file
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

// Define a path to save tokens locally (for development purposes)
const TOKEN_PATH = path.join(__dirname, '../../tokens.json');

// Promisify the readFile and writeFile functions
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

module.exports = {
  /**
   * Initialize the UserRefreshClient with refresh token
   */
  getAuthClient: async () => {
    const tokens = JSON.parse(await readFileAsync(TOKEN_PATH, 'utf8'));
    return new UserRefreshClient({
      clientId,
      clientSecret,
      refreshToken: tokens.refresh_token,
    });
  },

  /**
   * Generate an authorization URL for user consent
   */
  getAuthUrl: () => {
    const oauth2Client = new UserRefreshClient({
      clientId,
      clientSecret,
    });
    const scopes = ['https://www.googleapis.com/auth/adwords'];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Forces re-consent to get a refresh token
    });
  },

  /**
   * Exchange authorization code for access and refresh tokens
   * @param {string} code - Authorization code from the callback
   */
  getTokens: async (code) => {
    const oauth2Client = new UserRefreshClient({
      clientId,
      clientSecret,
    });

    const { tokens } = await oauth2Client.getToken(code);
    await writeFileAsync(TOKEN_PATH, JSON.stringify(tokens));

    return tokens;
  },
};
