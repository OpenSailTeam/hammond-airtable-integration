const express = require('express');
const app = express();
require('dotenv').config();

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Middleware
app.use(express.json());

// Routes
const airtableRoutes = require('./routes/airtableRoutes');

app.use('/airtable', airtableRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
