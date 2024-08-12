// src/services/authService.js
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Load OAuth2 credentials from environment variables or a configuration file
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

// Initialize OAuth2 client
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);

// Define a path to save tokens locally (for development purposes)
const TOKEN_PATH = path.join(__dirname, '../../tokens.json');

// Promisify the readFile and writeFile functions
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

module.exports = {
  /**
   * Get the OAuth2 client
   */
  getOAuthClient: () => oauth2Client,

  /**
   * Get the refresh token from stored tokens
   */
  getRefreshToken: () => {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    return tokens.refresh_token;
  },
  /**
   * Generate an authorization URL for user consent
   */
  getAuthUrl: () => {
    const scopes = ['https://www.googleapis.com/auth/adwords'];
  
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Forces re-consent to get a refresh token
    });
  
    return url;
  },

  /**
   * Exchange authorization code for access and refresh tokens
   * @param {string} code - Authorization code from the callback
   */
  getTokens: async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
  
    // Check if the refresh token is present
    if (!tokens.refresh_token) {
      throw new Error('No refresh token received.');
    }
  
    // Save the tokens to a local file for later use
    await writeFileAsync(TOKEN_PATH, JSON.stringify(tokens));
  
    return tokens;
  },

  /**
   * Load tokens from file and set credentials
   */
  loadTokens: async () => {
    try {
      const tokenData = await readFileAsync(TOKEN_PATH);
      const tokens = JSON.parse(tokenData);
      oauth2Client.setCredentials(tokens);
    } catch (err) {
      console.log('No token found, please authorize first.');
    }
  },

  /**
   * Refresh the access token if it has expired
   */
  refreshAccessToken: async () => {
    if (oauth2Client.credentials && oauth2Client.credentials.refresh_token) {
      const newTokens = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(newTokens.credentials);
      await writeFileAsync(TOKEN_PATH, JSON.stringify(newTokens.credentials));
    } else {
      throw new Error('No refresh token available. Please reauthorize.');
    }
  },

  /**
   * Get the OAuth2 client
   */
  getOAuthClient: () => {
    return oauth2Client;
  }
};
