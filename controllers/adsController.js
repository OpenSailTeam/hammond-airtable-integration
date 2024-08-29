const adsService = require('../services/googleAdsService');

// Controller for handling business data feeds for DYNAMIC_REAL_ESTATE assets

/**
 * Get all business data feeds
 */
exports.realEstateTest = async (req, res) => {
  try {
    const feeds = await adsService.realEstateTest();
    res.status(200).json(feeds);
  } catch (error) {
    console.error('Error fetching business data feeds:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Get all business data feeds
 */
exports.getAllRealEstateFeeds = async (req, res) => {
  try {
    const feeds = await adsService.getAllRealEstateFeeds();
    res.status(200).json(feeds);
  } catch (error) {
    console.error('Error fetching business data feeds:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Get all listings from feed
 */
exports.getAllListingsFromFeed = async (req, res) => {
    try {
      const feeds = await adsService.getAllListingsFromFeed();
      res.status(200).json(feeds);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
 * Get listing by Id
 */
exports.getListingDataById = async (req, res) => {
    try {
      const feeds = await adsService.getListingDataById("recLn9sVnmzvS8Iec");
      res.status(200).json(feeds);
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
 * Update listing by Id
 */
  exports.updateListingDataById = async (req, res) => {
    try {
      const feeds = await adsService.updateListingDataById("recLn9sVnmzvS8Iec");
      res.status(200).json(feeds);
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  /**
 * Remove listing by Id
 */
  exports.removeListingById = async (req, res) => {
    try {
      const feeds = await adsService.removeListingById("rectprzyncGUhm9Lg");
      res.status(200).json(feeds);
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).send('Internal Server Error');
    }
  };