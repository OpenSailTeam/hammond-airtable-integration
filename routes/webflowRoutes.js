const express = require('express');
const router = express.Router();
const webflowController = require('../controllers/webflowController');

router.post('/publish', webflowController.publishChanges);

module.exports = router;
