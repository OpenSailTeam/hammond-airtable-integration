// src/services/adsSyncService.js
const adsService = require("./adsService");
const listingTransformer = require("../transformers/listingTransformer");

module.exports = {
  /**
   * Sync data with Google Ads
   */
  syncToGoogleAds: async (payload) => {
    // Handle Created Records
    if (payload.createdRecordsById) {
      for (const [recordId, recordData] of Object.entries(payload.createdRecordsById)) {
        const fieldData = listingTransformer.transformToAdsFormat(recordData.cellValuesByFieldId);
        console.log("Processing record:", recordId);

        try {
        console.log("Field data:", fieldData);
          await adsService.createListing(fieldData);
          console.log(`Successfully created Google Ads asset and updated Airtable record ${recordId}`);
        } catch (error) {
          console.error(`Error handling created record ${recordId}:`, error.response ? error.response.data : error.message);
        }
      }
    }

    // Handle Changed Records
    if (payload.changedRecordsById) {
        for (const [recordId, recordData] of Object.entries(payload.changedRecordsById)) {
          const fieldData = listingTransformer.transformToAdsFormat(recordData.current.cellValuesByFieldId);
  
          try {
            await adsService.updateListingDataById(recordId, fieldData);
            console.log(`Successfully updated Google Ads asset ${recordId}`);
          } catch (error) {
            console.error(`Error updating record ${recordId}:`, error.response ? error.response.data : error.message);
          }
        }
      }
  
      // Handle Destroyed Records
      if (payload.destroyedRecordIds) {
        for (const recordId of payload.destroyedRecordIds) {
  
          try {
            console.log("todo");
            //console.log(`Successfully deleted Google Ads asset ${recordId}`);
          } catch (error) {
            console.error(`Error deleting record ${recordId}:`, error.response ? error.response.data : error.message);
          }
        }
      }
  }
};
