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
      console.log("Processing record:", record.id);
      console.log("Record name:", record.fields.Name);

      try {
        console.log(`Calling getListingById(${record.id})`)
        if (await adsService.getListingById(record.id)) {
          // If record is found in feed and is a draft or archived, remove it
          if (
            record.fields["Draft"] == "true" ||
            record.fields["Draft"] == undefined ||
            record.fields["Archived"] == "true" ||
            record.fields["Archived"] == undefined ||
            record.fields["Name"] == "" ||
            record.fields["Name"] == undefined
          ) {
            console.log(`Calling removeListingById(${record.id})`)
            await adsService.removeListingById(record.id);
          } else {
            // If record is found in feed and is not a draft or archived, update it
            console.log(`Calling updateListingDataById(${record.id}, ${fieldData})`)
            await adsService.updateListingDataById(record.id, fieldData);
          }
        } else {
          // If record is not found in feed and is a draft or archived, skip it
          if (
            record.fields["Draft"] == "true" ||
            record.fields["Draft"] == undefined ||
            record.fields["Archived"] == "true" ||
            record.fields["Archived"] == undefined ||
            record.fields["Name"] == "" ||
            record.fields["Name"] == undefined
          ) {
            //console.log(`Skipping record: ${record.id}`);
          } else {
            // If record is not found in feed and is not a draft or archived, create it
            console.log(`Calling createListing(${fieldData})`)
            await adsService.createListing(fieldData);
          }
        }
      } catch (error) {
        console.error(
          `Error handling record ${record.id}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
  },
};
