const { GoogleAdsApi } = require('google-ads-api');
const authService = require('./authService');

// Create a new instance of the Google Ads API client
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
});

module.exports = {
  /**
   * Get all business data feeds for DYNAMIC_REAL_ESTATE assets
   */
  getAllRealEstateFeeds: async () => {
    try {
      const customer = client.Customer({
        customer_id: "6090812772",
        login_customer_id: "1892061008",
        refresh_token: authService.getRefreshToken(),
      });

      const response = await customer.query(
        `SELECT asset_set.resource_name, asset_set.id
        FROM asset_set
        WHERE asset_set.type = 'DYNAMIC_REAL_ESTATE'`
      );

      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Get all business data feeds for specified data feed
   */
  getAllListingsFromFeed: async () => {
    try {
      const customer = client.Customer({
        customer_id: "6090812772",
        login_customer_id: "1892061008",
        refresh_token: authService.getRefreshToken(),
      });

      const response = await customer.query(
        `SELECT asset.resource_name, 
        asset.id, 
        asset.dynamic_real_estate_asset.address,
        asset.dynamic_real_estate_asset.android_app_link,
        asset.dynamic_real_estate_asset.city_name,
        asset.dynamic_real_estate_asset.contextual_keywords,
        asset.dynamic_real_estate_asset.description,
        asset.dynamic_real_estate_asset.formatted_price,
        asset.dynamic_real_estate_asset.image_url,
        asset.dynamic_real_estate_asset.ios_app_link,
        asset.dynamic_real_estate_asset.ios_app_store_id,
        asset.dynamic_real_estate_asset.listing_id,
        asset.dynamic_real_estate_asset.listing_name,
        asset.dynamic_real_estate_asset.listing_type,
        asset.dynamic_real_estate_asset.price,
        asset.dynamic_real_estate_asset.property_type, 
        asset.dynamic_real_estate_asset.similar_listing_ids
        FROM asset_set_asset
        WHERE asset_set.id = '8367326007'`
      );

      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Get data for specified listing
   */
  getListingDataById: async (listingId) => {
    try {
      const customer = client.Customer({
        customer_id: "6090812772",
        login_customer_id: "1892061008",
        refresh_token: authService.getRefreshToken(),
      });

      const response = await customer.query(
        `SELECT asset.resource_name, 
        asset.id, 
        asset.dynamic_real_estate_asset.address,
        asset.dynamic_real_estate_asset.android_app_link,
        asset.dynamic_real_estate_asset.city_name,
        asset.dynamic_real_estate_asset.contextual_keywords,
        asset.dynamic_real_estate_asset.description,
        asset.dynamic_real_estate_asset.formatted_price,
        asset.dynamic_real_estate_asset.image_url,
        asset.dynamic_real_estate_asset.ios_app_link,
        asset.dynamic_real_estate_asset.ios_app_store_id,
        asset.dynamic_real_estate_asset.listing_id,
        asset.dynamic_real_estate_asset.listing_name,
        asset.dynamic_real_estate_asset.listing_type,
        asset.dynamic_real_estate_asset.price,
        asset.dynamic_real_estate_asset.property_type, 
        asset.dynamic_real_estate_asset.similar_listing_ids
        FROM asset_set_asset
        WHERE asset_set.id = '8367326007' AND asset.dynamic_real_estate_asset.listing_id = '${listingId}'`
      );

      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};