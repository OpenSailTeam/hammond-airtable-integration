// src/services/adsSyncService.js
const adsService = require("./adsService");
const listingTransformer = require("../transformers/listingTransformerTest");

module.exports = {
  /**
   * Sync data with Google Ads
   */
  syncToGoogleAds: async (records) => {
    // Handle Created Records
    for (const record of records) {
      const fieldData = listingTransformer.transformToAdsFormat(record.id, record.fields);
      //console.log("Processing record:", record.id);

      try {
      //console.log("Field data:", fieldData);
        //await adsService.createListing(fieldData);
        await adsService.getListingById(record.id);
        console.log(`Successfully created Google Ads asset and updated Airtable record ${record.id}`);
      } catch (error) {
        console.error(`Error handling created record ${record.id}:`, error.response ? error.response.data : error.message);
      }
    }
  }
};
