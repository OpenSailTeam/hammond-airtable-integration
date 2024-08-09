const express = require('express');
const router = express.Router();
const airtableController = require('../controllers/airtableController');

router.post('/webhook', airtableController.handleWebhook);
router.post('/publish', airtableController.handlePublish);

module.exports = router;
