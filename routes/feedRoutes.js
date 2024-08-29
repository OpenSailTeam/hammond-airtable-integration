const express = require('express');
const path = require('path');
const router = express.Router();

// Define the path to the output directory
const outputDirectory = path.join(__dirname, '../output');

// Serve static files from the output directory
router.use('/output', express.static(outputDirectory));

module.exports = router;