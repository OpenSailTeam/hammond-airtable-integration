// src/services/adsService.js
const { GoogleAds } = require("@htdangkhoa/google-ads");
const authService = require("./authService");

module.exports = {

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
        SELECT asset_set_asset.resource_name, asset_set_asset.asset_set, asset_set_asset.asset, asset_set_asset.status, asset_set.resource_name, asset_set.name, asset_set.id, asset_set.type, asset_set.status, asset.dynamic_real_estate_asset.listing_id
        FROM asset_set_asset
        WHERE asset_set.type = 'DYNAMIC_REAL_ESTATE' AND asset_set_asset.status = 'ENABLED'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error testing:", error);
      throw error;
    }
  },

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
        SELECT asset_set.resource_name, asset_set.type, asset_set.status, asset_set.name, asset_set.merchant_center_feed.merchant_id, asset_set.merchant_center_feed.feed_label, asset_set.location_set.location_ownership_type, asset_set.location_set.chain_location_set.relationship_type, asset_set.location_set.business_profile_location_set.listing_id_filters, asset_set.location_set.business_profile_location_set.label_filters, asset_set.location_set.business_profile_location_set.business_name_filter, asset_set.location_group_parent_asset_set_id, asset_set.id, asset_set.hotel_property_data.partner_name, asset_set.hotel_property_data.hotel_center_id, asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.listing_id_filters, asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.label_filters, asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.business_name_filter.filter_type, asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.business_name_filter.business_name
        FROM asset_set
        WHERE asset_set.type = 'DYNAMIC_REAL_ESTATE'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error fetching real estate feeds:", error);
      throw error;
    }
  },


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
        asset.dynamic_real_estate_asset.similar_listing_ids,
        asset_set_asset.status
        FROM asset_set_asset
        WHERE asset_set.id = '8367326007' AND asset_set_asset.status = 'ENABLED'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },


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
        WHERE asset_set.id = '8367326007' AND asset.dynamic_real_estate_asset.listing_id = '${listingId}' AND asset_set_asset.status = 'ENABLED'`;

      const response = await service.search({ query });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  getListingById: async (listingId) => {
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

      // Fetch the asset resource name based on listingId
      const query = `
        SELECT asset.resource_name
        FROM asset_set_asset
        WHERE asset_set.id = '8367326007' AND asset.dynamic_real_estate_asset.listing_id = '${listingId}' AND asset_set_asset.status = 'ENABLED'`;

      const { results } = await service.search({ query });
      if (results[0]) {
        if (results[0].asset){
          if (results[0].asset.resource_name) {
            console.log(`Found existing listing with id: ${listingId}`);
            return results[0].asset.resource_name;
          } 
        } 
      }
      return undefined;
    } catch (error) {
      console.error("Error during asset fetch:", error);
      if (
        error.metadata &&
        error.metadata.get(
          "google.ads.googleads.v17.errors.googleadsfailure-bin"
        )
      ) {
        const buffer = error.metadata.get(
          "google.ads.googleads.v17.errors.googleadsfailure-bin"
        )[0];
        const decodedError = Buffer.from(buffer).toString("utf-8");
        console.error("Decoded error details:", decodedError);
      }
      throw error;
    }
  },

  updateListingDataById: async (listingId, fieldData) => {
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
      const updateMask = Object.keys(fieldData["dynamic_real_estate_asset"])
        .filter((field) => field !== "listing_id")
        .map((field) => `dynamic_real_estate_asset.${field}`);

      fieldData.resource_name = assetResourceName;

      // Execute the mutation
      const response = await service.mutate({
        mutate_operations: [
          {
            asset_operation: {
              update: fieldData,
              update_mask: updateMask,
            },
          },
        ],
        partial_failure: false,
      });

      return response;
    } catch (error) {
      console.error("Error during asset creation or association:", error);
      if (
        error.metadata &&
        error.metadata.get(
          "google.ads.googleads.v17.errors.googleadsfailure-bin"
        )
      ) {
        const buffer = error.metadata.get(
          "google.ads.googleads.v17.errors.googleadsfailure-bin"
        )[0];
        const decodedError = Buffer.from(buffer).toString("utf-8");
        console.error("Decoded error details:", decodedError);
      }
      throw error;
    }
  },

  createListing: async (fieldData) => {
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

      // Step 1: Create the asset
      const assetResponse = await service.mutate({
        mutate_operations: [
          {
            asset_operation: {
              create: fieldData,
            },
          },
        ],
        partial_failure: false,
      });

      console.log("Asset creation response:", assetResponse);

      // Extract the resource name of the newly created asset
      const createdAssetResourceName =
        assetResponse["mutate_operation_responses"][0]["asset_result"][
          "resource_name"
        ];

      // Step 2: Associate the asset with the asset set
      const assetSetResponse = await service.mutate({
        mutate_operations: [
          {
            asset_set_asset_operation: {
              create: {
                asset: createdAssetResourceName,
                asset_set: "customers/6090812772/assetSets/8367326007",
              },
            },
          },
        ],
        partial_failure: false,
      });

      console.log("Asset set association response:", assetSetResponse);
      return { assetResponse, assetSetResponse };
    } catch (error) {
      console.error("Error during asset creation or association:", error);
      if (
        error.metadata &&
        error.metadata.get(
          "google.ads.googleads.v17.errors.googleadsfailure-bin"
        )
      ) {
        const buffer = error.metadata.get(
          "google.ads.googleads.v17.errors.googleadsfailure-bin"
        )[0];
        const decodedError = Buffer.from(buffer).toString("utf-8");
        console.error("Decoded error details:", decodedError);
      }
      throw error;
    }
  },

  removeListingById: async (listingId) => {
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
  
      // Step 1: Fetch the asset resource name based on listingId
      const assetQuery = `
        SELECT asset.resource_name
        FROM asset
        WHERE asset.dynamic_real_estate_asset.listing_id = '${listingId}'`;
  
      const assetQueryResult = await service.search({ query: assetQuery });
      if (!assetQueryResult || !assetQueryResult.results || assetQueryResult.results.length === 0) {
        throw new Error(`Listing with ID ${listingId} not found.`);
      }
  
      const assetResourceName = assetQueryResult.results[0].asset.resource_name;
      console.log("Asset resource name:", assetResourceName);
  
      // Step 2: Fetch the asset_set_asset resource name using the asset resource name
      const assetSetAssetQuery = `
        SELECT asset_set_asset.resource_name
        FROM asset_set_asset
        WHERE asset_set_asset.asset = '${assetResourceName}'`;
  
      const assetSetAssetQueryResult = await service.search({ query: assetSetAssetQuery });
      if (!assetSetAssetQueryResult || !assetSetAssetQueryResult.results || assetSetAssetQueryResult.results.length === 0) {
        throw new Error(`AssetSetAsset not found for asset: ${assetResourceName}`);
      }
  
      const assetSetAssetResourceName = assetSetAssetQueryResult.results[0].asset_set_asset.resource_name;
      console.log("Asset set asset resource name:", assetSetAssetResourceName);
  
      // Step 3: Remove the asset_set_asset association
      const response = await service.mutate({
        mutate_operations: [
          {
            asset_set_asset_operation: {
              remove: assetSetAssetResourceName,
            },
          },
        ],
        partial_failure: false,
      });
  
      console.log('Remove response:', response.mutate_operation_responses[0].asset_set_asset_result);
  
      // Step 4: Verify the removal by re-querying the asset_set_asset
      const verificationQuery = `
        SELECT asset_set_asset.resource_name
        FROM asset_set_asset
        WHERE asset_set_asset.asset = '${assetResourceName}' AND asset_set_asset.status = 'ENABLED'`;
  
      const verificationResult = await service.search({ query: verificationQuery });
      if (verificationResult.results.length === 0) {
        console.log('AssetSetAsset successfully removed.');
      } else {
        console.error('AssetSetAsset still exists:', verificationResult.results);
      }
  
      return response;
    } catch (error) {
      console.error('Error during asset removal or association removal:', error);
      if (error.metadata && error.metadata.get('google.ads.googleads.v17.errors.googleadsfailure-bin')) {
        const buffer = error.metadata.get('google.ads.googleads.v17.errors.googleadsfailure-bin')[0];
        const decodedError = Buffer.from(buffer).toString('utf-8');
        console.error('Decoded error details:', decodedError);
      }
      throw error;
    }
  },
  
  
};
