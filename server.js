const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const airtableRoutes = require('./routes/airtableRoutes');
const webflowRoutes = require('./routes/webflowRoutes');

app.use('/airtable', airtableRoutes);
app.use('/webflow', webflowRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});