// src/services/adsService.js
const { GoogleAds } = require("@htdangkhoa/google-ads");
const authService = require("./authService");
const airtableService = require("./airtableService");
const listingTransformer = require("../transformers/listingTransformer");

module.exports = {
  /**
   * Sync data with Google Ads
   */
  syncToGoogleAds: async (payload) => {

    const tableFields = await airtableService.getTableFields();

    // Handle Created Records
    if (payload.createdRecordsById) {
      for (const [recordId, recordData] of Object.entries(payload.createdRecordsById)) {
        const fieldData = listingTransformer.transformToAdsFormat(recordData.cellValuesByFieldId, tableFields);

        try {
          console.log("todo");
          //await createListingWithId();
          //console.log(`Successfully created Google Ads asset and updated Airtable record ${recordId}`);
        } catch (error) {
          console.error(`Error handling created record ${recordId}:`, error.response ? error.response.data : error.message);
        }
      }
    }

    // Handle Changed Records
    if (payload.changedRecordsById) {
      for (const [recordId, recordData] of Object.entries(payload.changedRecordsById)) {
        const fieldData = listingTransformer.transformToAdsFormat(recordData.current.cellValuesByFieldId, tableFields);

        try {
          await updateListingDataById(recordId, fieldData);
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
  },

  /**
   * Test
   */
  realEstateTest: async () => {
    try {
      const authClient = await authService.getAuthClient();

      const service = new GoogleAds(
        {
          auth: authClient,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        },
        {
          customer_id: "6090812772",
          login_customer_id: "1892061008",
        }
      );

      const query = `
        SELECT asset_set.resource_name, asset_set.id, asset_set.type, asset_set.status
        FROM asset_set
        WHERE asset_set.type = 'DYNAMIC_REAL_ESTATE'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error testing:", error);
      throw error;
    }
  },
  /**
   * Get all business data feeds for DYNAMIC_REAL_ESTATE assets
   */
  getAllRealEstateFeeds: async () => {
    try {
      const authClient = await authService.getAuthClient();

      const service = new GoogleAds(
        {
          auth: authClient,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        },
        {
          customer_id: "6090812772",
          login_customer_id: "1892061008",
        }
      );

      const query = `
        SELECT asset_set.resource_name, asset_set.id, asset_set.type, asset_set.status
        FROM asset_set
        WHERE asset_set.type = 'DYNAMIC_REAL_ESTATE'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error fetching real estate feeds:", error);
      throw error;
    }
  },

  /**
   * Get all business data feeds for specified data feed
   */
  getAllListingsFromFeed: async () => {
    try {
      const authClient = await authService.getAuthClient();

      const service = new GoogleAds(
        {
          auth: authClient,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        },
        {
          customer_id: "6090812772",
          login_customer_id: "1892061008",
        }
      );

      const query = `
        SELECT asset.resource_name, 
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
        WHERE asset_set.id = '8367326007'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  /**
   * Get data for specified listing
   */
  getListingDataById: async (listingId) => {
    try {
      const authClient = await authService.getAuthClient();

      const service = new GoogleAds(
        {
          auth: authClient,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        },
        {
          customer_id: "6090812772",
          login_customer_id: "1892061008",
        }
      );

      const query = `
        SELECT asset.resource_name, 
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
        WHERE asset_set.id = '8367326007' AND asset.dynamic_real_estate_asset.listing_id = '${listingId}'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
  /**
   * Update the price of a specific listing by its ID
   */
  updateListingDataById: async (listingId, fieldData) => {
    try {
      const authClient = await authService.getAuthClient();

      const service = new GoogleAds(
        {
          auth: authClient,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        },
        {
          customer_id: '6090812772',
          login_customer_id: '1892061008',
        }
      );

      // Fetch the asset resource name based on listingId
      const query = `
        SELECT asset.resource_name
        FROM asset
        WHERE asset.dynamic_real_estate_asset.listing_id = '${listingId}'`;

      const { results } = await service.search({ query });
      if (!results || results.length === 0) {
        throw new Error(`Listing with ID ${listingId} not found.`);
      }

      const assetResourceName = results[0].asset.resource_name;
      const updateMask = Object.keys(fieldData).map(
        (field) => `dynamic_real_estate_asset.${field}`
      );
      
      // Execute the mutation
      const response = await service.mutate({
        mutate_operations: [
          {
            asset_operation: {
              update: {
                resource_name: assetResourceName,
                dynamic_real_estate_asset: fieldData,
              },
              update_mask: updateMask
            }
          }
        ],
        partial_failure: false,
      });

      console.log('Update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating listing data:', error);
      throw error;
    }
  },

  /**
   * Update the price of a specific listing by its ID
   */
  createListingWithId: async (listingId, fieldData) => {
    try {
      const authClient = await authService.getAuthClient();

      const service = new GoogleAds(
        {
          auth: authClient,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        },
        {
          customer_id: '6090812772',
          login_customer_id: '1892061008',
        }
      );
      
      // Execute the mutation
      const response = await service.mutate({
        mutate_operations: [
          {
            asset_operation: {
              create: {
                dynamic_real_estate_asset: fieldData
              },
              update_mask: updateMask
            }
          }
        ],
        partial_failure: false,
      });

      console.log('Update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating listing data:', error);
      throw error;
    }
  }
};
