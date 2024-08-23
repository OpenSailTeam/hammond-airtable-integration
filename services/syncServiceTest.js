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
      const fieldData = listingTransformer.transformToAdsFormat(
        record.id,
        record.fields
      );
      //console.log("Processing record:", record.id);

      try {

        if (await adsService.getListingById(record.id)) {
          // If record is found in feed and is a draft or archived, remove it
          if (
            record.fields["Draft"] == true ||
            record.fields["Archived"] == true
          ) {
            await adsService.removeListingById(record.id);
          } else {
            // If record is found in feed and is not a draft or archived, update it
            await adsService.updateListingDataById(record.id, record.fields);
          }
        } else {
          // If record is not found in feed and is a draft or archived, skip it
          if (
            record.fields["Draft"] == true ||
            record.fields["Archived"] == true
          ) {
            console.log(`Skipping record: ${record.id}`);
          } else {
            // If record is not found in feed and is not a draft or archived, create it
            await adsService.createListing(record.fields);
          }
        }
        console.log(
          `Successfully created Google Ads asset and updated Airtable record ${record.id}`
        );
      } catch (error) {
        console.error(
          `Error handling created record ${record.id}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
  },
};
