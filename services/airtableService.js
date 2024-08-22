const airtable = require('airtable');
const queue = require('../utils/queue');
const webflowService = require('./webflowService');
const googleAdsService = require('./adsService');
const airtableService= require('./airtableService');
const logger = require('../utils/logger');
const axios = require('axios');
require('dotenv').config();

var cursor = 0;
var webhookId = "";

exports.addToQueue = async (id) => {
  queue.push(id);
};

exports.getQueue = () => {
  return queue.getAll();
};

exports.clearQueue = () => {
  queue.clear();
};

// Function to fetch data from Airtable
exports.getRecordById = async (id) => {
    const base = new airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
    return base(process.env.AIRTABLE_TABLE_ID).find(id);
};

exports.syncQueue = async () => {
  // Initiate the sync process
  const queueItems = queue.getAll();
  console.log(queueItems);
  for (let item of queueItems) {
    console.log(item.id);

      const webhookPayloads = await airtableService.listWebhookPayloads(item);

      if (webhookPayloads) {
          console.log("webhookPayloads:");
          console.log(webhookPayloads);
          for (const payload of webhookPayloads.payloads) {
              console.log("payload:");
              console.log(payload);
              
              // Iterate over the keys (table IDs) of changedTablesById
              for (const tableId of Object.keys(payload.changedTablesById)) {
                  console.log("tableId:");
                  console.log(tableId);
                  
                  const changes = payload.changedTablesById[tableId];
                  console.log("changes:");
                  console.log(changes);
                  
                  //await adsService.syncToGoogleAds(changes);
              }
          }
      }
  }
}

exports.listWebhookPayloads = async (item) => {
  cursor += 1;
  try {
      const response = await axios.get(
          `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${item}/payloads?cursor=${cursor}`,
          {
              headers: {
                  Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
                  'Content-Type': 'application/json'
              }
          }
      );
      return response.data;  // Return the payload data
  } catch (error) {
      console.error(`Error listing webhook payloads for ${item}:`, error.response ? error.response.data : error.message);
      throw error;
  }
};


  exports.updateAirtableWithWebflowItemId = async (recordId, webflowItemId) => {
    const baseId = 'your_base_id';  // Replace with your Airtable base ID
    const tableIdOrName = 'your_table_id_or_name';  // Replace with your Airtable table ID or name
    const fieldId = 'fldsSdgGBKmG3Stvi';  // Webflow Item ID field ID
  
    const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}/${recordId}`;
    const headers = {
      'Authorization': `Bearer your_airtable_api_key`,  // Replace with your Airtable API key
      'Content-Type': 'application/json'
    };
    
    const data = {
      fields: {
        [fieldId]: webflowItemId
      }
    };
  
    try {
      const response = await axios.patch(url, data, { headers });
      console.log('Airtable record updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating Airtable record:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

exports.createWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks`,
      {
        notificationUrl: "https://hammond.api.opensail.com/api/airtable/webhook",
        specification: {
            options: {
              filters: {
                  fromSources: ['client'],
                  dataTypes: ['tableData'],
                  recordChangeScope: `${process.env.AIRTABLE_TABLE_ID}`
              },
              includes: {
                includeCellValuesInFieldIds: ["fldsSdgGBKmG3Stvi"]
              }
            }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Webhook created:', response.data);
    webhookId = response.data.id;
  } catch (error) {
    console.error('Error creating webhook:', error.response ? error.response.data : error.message);
  }
};

exports.deleteWebhook = async () => {
  try {
    const response = await axios.delete(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${webhookId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Webhook deleted:', response.data);
  } catch (error) {
    console.error('Error deleting webhook:', error.response ? error.response.data : error.message);
  }
};
