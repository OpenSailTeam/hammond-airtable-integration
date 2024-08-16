// src/services/adsService.js
const { GoogleAdsApi } = require('google-ads-api');
const authService = require('./authService');
const rateLimiter = require('../middleware/rateLimiter');
const airtableService = require('../services/airtableService');

// Create a new instance of the Google Ads API client
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
});

// Define field mapping between Airtable and Google Ads API
const fieldMapping = {
  "Webflow Item ID": "dynamic_real_estate_asset.listing_id"
};

// Function to map Airtable fields to Google Ads fields
const mapAirtableToGoogleAds = (airtableFields) => {
  const googleAdsFields = {};

  for (const [airtableField, googleAdsField] of Object.entries(fieldMapping)) {
    if (airtableFields[airtableField]) {
      googleAdsFields[googleAdsField] = airtableFields[airtableField];
    }
  }

  return googleAdsFields;
};

module.exports = {
  /**
   * Sync data with Google Ads
   */
  syncToGoogleAds: async (payload) => {
    const customer = client.Customer({
      customer_id: process.env.GOOGLE_CUSTOMER_ID,
      login_customer_id: process.env.GOOGLE_LOGIN_CUSTOMER_ID,
      refresh_token: authService.getRefreshToken(),
    });

    // Handle Created Records
    if (payload.createdRecordsById) {
      for (const [recordId, recordData] of Object.entries(
        payload.createdRecordsById
      )) {
        const fieldData = mapAirtableToGoogleAds(recordData.cellValuesByFieldId);

        try {
          const response = await customer.mutateResources({
            operations: [
              {
                create: {
                  asset: {
                    type: 'DYNAMIC_REAL_ESTATE',
                    dynamic_real_estate_asset: fieldData,
                  },
                },
              },
            ],
          });

          const googleAdsItemId = response.results[0].resource_name; // Assuming Google Ads API returns the resource name

          await airtableService.updateAirtableWithGoogleAdsItemId(
            recordId,
            googleAdsItemId
          );
          console.log(
            `Successfully created Google Ads asset and updated Airtable record ${recordId}`
          );
        } catch (error) {
          console.error(
            `Error handling created record ${recordId}:`,
            error.response ? error.response.data : error.message
          );
        }
      }
    }
    /**
    // Handle Changed Records
    if (payload.changedRecordsById) {
      for (const [recordId, recordData] of Object.entries(
        payload.changedRecordsById
      )) {
        const fieldData = mapAirtableToGoogleAds(
          recordData.current.cellValuesByFieldId
        );
        const googleAdsItemId = recordData.GoogleAdsItemId;

        try {
          await customer.mutateResources({
            operations: [
              {
                update: {
                  resource_name: googleAdsItemId,
                  asset: {
                    type: 'DYNAMIC_REAL_ESTATE',
                    dynamic_real_estate_asset: fieldData,
                  },
                },
              },
            ],
          });

          console.log(`Successfully updated Google Ads asset ${googleAdsItemId}`);
        } catch (error) {
          console.error(
            `Error updating record ${recordId}:`,
            error.response ? error.response.data : error.message
          );
        }
      }
    }

    // Handle Destroyed Records
    if (payload.destroyedRecordIds) {
      for (const recordId of payload.destroyedRecordIds) {
        const googleAdsItemId = recordData.GoogleAdsItemId;

        try {
          await customer.mutateResources({
            operations: [
              {
                remove: googleAdsItemId,
              },
            ],
          });

          console.log(`Successfully deleted Google Ads asset ${googleAdsItemId}`);
        } catch (error) {
          console.error(
            `Error deleting record ${recordId}:`,
            error.response ? error.response.data : error.message
          );
        }
      }
    }
    */
  },
};
