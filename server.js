const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();
const { createWebhook, deleteWebhook } = require('./services/airtableService');
const readline = require('readline');

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
const server = http.createServer(app);

server.listen(PORT, async () => {
    console.log(`HTTP Server is running on port ${PORT}`);
    await createWebhook();
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const gracefulShutdown = async () => {
    console.log('Shutting down server...');
    try {
        await deleteWebhook();
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
};

rl.on('line', (input) => {
    if (input === 'shutdown') {
        gracefulShutdown();
    }
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
