// src/routes/adsRoutes.js
const express = require('express');
const router = express.Router();
const adsController = require('../controllers/adsController');

// Route to get all business data feeds for DYNAMIC_REAL_ESTATE assets
router.get('/real-estate-feeds', adsController.getAllRealEstateFeeds);

router.get('/real-estate-listings', adsController.getAllListingsFromFeed);

router.get('/real-estate-listing', adsController.getListingDataById);

router.get('/update-real-estate-listing', adsController.updateListingDataById);

module.exports = router;
