// src/services/adsSyncService.js
const adsService = require("./adsService");
const listingTransformer = require("../transformers/listingTransformerTest");

module.exports = {
  /**
   * Sync data with Google Ads
   */
  syncToGoogleAds: async (records) => {
    for (const record of records) {
      const fieldData = listingTransformer.transformToAdsFormat(
        record.fields["Webflow Item ID"],
        record.fields
      );
      if (
        record.fields["Webflow Item ID"] != "" ||
        record.fields["Webflow Item ID"] != undefined
      ) {
        console.log("Processing record:", record.fields["Webflow Item ID"]);
        console.log("Record name:", record.fields.Name);

        try {
          console.log(
            `Calling getListingById(${record.fields["Webflow Item ID"]})`
          );
          if (
            await adsService.getListingById(record.fields["Webflow Item ID"])
          ) {
            // If record is found in feed and is a draft or archived, remove it
            if (
              record.fields["Draft"] == "true" ||
              record.fields["Draft"] == undefined ||
              record.fields["Archived"] == "true" ||
              record.fields["Archived"] == undefined ||
              record.fields["Name"] == "" ||
              record.fields["Name"] == undefined
            ) {
              console.log(
                `Calling removeListingById(${record.fields["Webflow Item ID"]})`
              );
              await adsService.removeListingById(
                record.fields["Webflow Item ID"]
              );
            } else {
              // If record is found in feed and is not a draft or archived, update it
              console.log(
                `Calling updateListingDataById(${record.fields["Webflow Item ID"]}, ${fieldData})`
              );
              await adsService.updateListingDataById(
                record.fields["Webflow Item ID"],
                fieldData
              );
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
              console.log(`Calling createListing(${fieldData})`);
              await adsService.createListing(fieldData);
            }
          }
        } catch (error) {
          console.error(
            `Error handling record ${record.fields["Webflow Item ID"]}:`,
            error.response ? error.response.data : error.message
          );
        }
      }
    }
  },
};
