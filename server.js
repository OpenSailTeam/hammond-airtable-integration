const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const airtableRoutes = require('./routes/airtableRoutes');
app.use('/airtable', airtableRoutes);

// SSL Configuration
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Start HTTPS server
const PORT = process.env.PORT || 443;
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});
