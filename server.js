const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const airtableRoutes = require('./routes/airtableRoutes');
app.use('/airtable', airtableRoutes);

// Start HTTP server
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server is running on port ${PORT}`);
});
