const adsService = require("./googleAdsService");
const listingTransformer = require("../transformers/listingTransformer");
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');

module.exports = {
  /**
   * Sync data with Meta XML
   */
  syncToMetaAds: async (records) => {
    const root = xmlbuilder.create('listings', { encoding: 'UTF-8' });

    for (const record of records) {
      const fieldData = listingTransformer.transformToMetaFormat(
        record.id,
        record.fields,
        'active'  // Explicitly pass 'active' status for consistency
      );
      console.log("Processing record:", record.id);
      console.log("Record name:", record.fields.Name);
    
      try {
        // Check if record should be archived/removed
        const shouldBeArchived = (
          record.fields["Draft"] == "true" ||
          record.fields["Archived"] == "true" ||
          record.fields["Name"] == "" ||
          record.fields["Name"] == undefined ||
          record.fields["Link"] == undefined ||
          (record.fields["Service Type"] && record.fields["Service Type"][0] == "recO7KhyAKDypJ4dF")
        );

        // Check if record has undefined values that should exclude it completely
        const shouldBeSkipped = (
          record.fields["Draft"] == undefined ||
          record.fields["Archived"] == undefined
        );

        if (shouldBeSkipped) {
          console.log(`Skipping record due to undefined Draft/Archived status: ${record.id}`);
          continue;
        }

        if (shouldBeArchived) {
          // Generate archived listing data and add to XML for removal
          const archivedFieldData = listingTransformer.transformToMetaFormat(
            record.id,
            record.fields,
            'archived'  // Pass 'archived' status
          );
          console.log(`Adding archived/draft record for removal: ${record.id}`);
          
          const listing = root.ele('listing');
          for (const [key, value] of Object.entries(archivedFieldData)) {
            if (value !== undefined) {
              if (key === 'address') {
                const addressNode = listing.ele('address', { format: 'simple' });
                for (const [addrKey, addrValue] of Object.entries(value)) {
                  if (addrValue !== undefined) {
                    addressNode.ele('component', { name: addrKey }, addrValue);
                  }
                }
              } else if (key === 'image') {
                const imageNode = listing.ele('image');
                
                if (value.url) {
                  imageNode.ele('url').text(value.url);
                }
                
                if (value.tag) {
                  imageNode.ele('tag').text(value.tag);
                }
              } else {
                listing.ele(key, value);
              }
            }
          }
          
          console.log(`Added record for removal: ${record.id}`, "\n");
        } else {
          // New validation check for active listings
          if (!isValidListing(fieldData)) {
            console.log(`Skipping record due to missing required fields: ${record.id}`);
            continue; // Skip to the next record
          }
          console.log(`Adding active record to XML file: ${record.id}`);
    
          const listing = root.ele('listing');
          for (const [key, value] of Object.entries(fieldData)) {
            if (value !== undefined) {
              if (key === 'address') {
                const addressNode = listing.ele('address', { format: 'simple' });
                for (const [addrKey, addrValue] of Object.entries(value)) {
                  if (addrValue !== undefined) {
                    addressNode.ele('component', { name: addrKey }, addrValue);
                  }
                }
              } else if (key === 'image') {
                const imageNode = listing.ele('image');
                
                if (value.url) {
                  imageNode.ele('url').text(value.url);
                }
                
                if (value.tag) {
                  imageNode.ele('tag').text(value.tag);
                }
              } else {
                listing.ele(key, value);
              }
            }
          }
    
          console.log(`Added active record successfully: ${record.id}`, "\n");
        }
      } catch (error) {
        console.error(
          `Error handling record ${record.id}:`,
          error.response ? error.response.data : error.message
        );
      }
    }    

    const xmlString = root.end({ pretty: true });
    console.log(xmlString);

    fs.writeFileSync('./output/meta_feed.xml', xmlString);
  },
  /**
   * Sync data with Google Ads
   */
  syncToGoogleAds: async (records) => {
    for (const record of records) {
      const fieldData = listingTransformer.transformToGoogleFormat(
        record.id,
        record.fields
      );
      console.log("Processing record:", record.id);
      console.log("Record name:", record.fields.Name);

      try {
        console.log(`Calling getListingById(${record.id})`);
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
            console.log(`Calling removeListingById(${record.id})`);
            await adsService.removeListingById(record.id);
            console.log(`Record removed successfully: ${record.id}`, "\n");
          } else {
            // If record is found in feed and is not a draft or archived, update it
            console.log(
              `Calling updateListingDataById(${record.id}, ${fieldData})`
            );
            await adsService.updateListingDataById(record.id, fieldData);
            console.log(`Record updated successfully: ${record.id}`, "\n");
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
            console.log(
              `Record not found in feed and is draft or archived, skipping record: ${record.id}`,
              "\n"
            );
          } else {
            // If record is not found in feed and is not a draft or archived, create it
            console.log(`Calling createListing(${fieldData})`);
            await adsService.createListing(fieldData);
            console.log(`Record created successfully: ${record.id}`, "\n");
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

function getNestedFieldValue(obj, fieldPath) {
  const fields = fieldPath.split('.');
  let value = obj;
  for (const field of fields) {
    if (value && typeof value === 'object' && field in value) {
      value = value[field];
    } else {
      return undefined;
    }
  }
  return value;
}

function isValidListing(fieldData) {
  const requiredFields = [
    'home_listing_id',
    'name',
    'availability',
    'address',
    'address.city',
    'address.region',
    'address.country',
    'address.postal_code',
    'latitude',
    'longitude',
    'price',
    'image',
    'image.url',
    'url'
  ];

  for (const field of requiredFields) {
    const value = getNestedFieldValue(fieldData, field);
    if (value === undefined || value === null || value === '') {
      return false;
    }
  }

  return true;
}

