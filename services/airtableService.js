const airtable = require('airtable');
const queue = require('../utils/queue');
const webflowService = require('./webflowService');
const googleAdsService = require('./adsService');
const airtableService= require('./airtableService');
const logger = require('../utils/logger');
const axios = require('axios');
require('dotenv').config();

exports.addToQueue = async (id) => {
    queue.push({ id });
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
  console.log("Test3");
    const queueItems = queue.getAll();
    console.log(queueItems);
    for (let item of queueItems) {
      console.log("Test5");
        try {
            // Fetch the latest record data from Airtable
            console.log(item.id);
            const payloads = await airtableService.listWebhookPayloads(item.id);
            console.log("Payloads:")
            console.log(payloads);

            // Transform and sync to Webflow
            // await webflowService.syncToWebflow(payloads);

            // Transform and sync to Google Ads
            //await googleAdsService.syncToGoogleAds(payloads);

            // Log successful sync
            // logger.log('info', `Successfully sent payload ${item.webhook.id} to Webflow and Google Ads`);

        } catch (error) {
            // Log the error
            // logger.log('error', `Error syncing record ${item.webhook.id}: ${error.message}`);

            throw new Error(`Failed to sync record`);
        }
    }
    // Clear the queue after processing
    queue.clear();
};

exports.listWebhookPayloads = async (id) => {
  console.log("Test1");
    try {
      const response = await axios.post(
        `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${id}/payloads`,
        {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Payload:', response.data);
    } catch (error) {
      console.error('Error listing webhook payloads:', error.response ? error.response.data : error.message);
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
