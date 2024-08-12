const adsService = require('../services/adsService');

// Controller for handling business data feeds for DYNAMIC_REAL_ESTATE assets

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
      const feeds = await adsService.getListingDataById("65a946859824a73cd3f87e43");
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
      const feeds = await adsService.updateListingDataById("65a946859824a73cd3f87e43");
      res.status(200).json(feeds);
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).send('Internal Server Error');
    }
  };