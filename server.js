const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();
const { createWebhook, deleteWebhook } = require('./services/webhookService');

// Middleware
app.use(express.json());

// Routes
const airtableRoutes = require('./routes/airtableRoutes');
const adsRoutes = require('./routes/adsRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/airtable', airtableRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/auth', authRoutes);

// Start HTTP server
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, async () => {
    console.log(`HTTP Server is running on port ${PORT}`);
    (async () => {
        await createWebhook();
      })();
});

const gracefulShutdown = async () => {
    console.log('Shutting down server...');
    await deleteWebhook();
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
