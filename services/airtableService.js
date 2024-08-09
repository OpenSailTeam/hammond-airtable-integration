const airtable = require('airtable');
const queue = require('../utils/queue');
const webflowService = require('./webflowService');
const googleAdsService = require('./googleAdsService');
const logger = require('../utils/logger');
const axios = require('axios');
require('dotenv').config();

exports.addToQueue = async (id) => {
    // Check if the id already exists in the queue
    const exists = queue.some(item => item.id === id);

    if (!exists) {
        queue.push({ id });
    }
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

exports.syncQueueToExternalServices = async () => {
    const queueItems = queue.getAll();
    for (let item of queueItems) {
        try {
            // Fetch the latest record data from Airtable
            const payloads = await airtableService.listWebhookPayloads(item);
            console.log("Payloads:")
            console.log(payloads);

            // Transform and sync to Webflow
            // await webflowService.syncToWebflow(payloads);

            // Transform and sync to Google Ads
            // await googleAdsService.syncToGoogleAds(payloads);

            // Log successful sync
            // logger.log('info', `Successfully sent payload ${item.webhook.id} to Webflow and Google Ads`);

        } catch (error) {
            // Log the error
            // logger.log('error', `Error syncing record ${item.webhook.id}: ${error.message}`);

            // Throw the error to be caught by the publish handler
            // throw new Error(`Failed to sync record ${item.webhook.id}: ${error.message}`);
        }
    }
    // Clear the queue after processing
    queue.clear();
};

exports.listWebhookPayloads = async (id) => {
    try {
      const response = await axios.post(
        `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${id}/payloads`,
        {
          notificationUrl: "https://34.136.105.159:3000/airtable/webhook",
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
    } catch (error) {
      console.error('Error creating webhook:', error.response ? error.response.data : error.message);
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
    }
  }
