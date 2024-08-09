const airtable = require('airtable');
const queue = require('../utils/queue');
const webflowService = require('./webflowService');
const googleAdsService = require('./googleAdsService');
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
    const queueItems = queue.getAll();
    for (let item of queueItems) {
        try {
            // Fetch the latest record data from Airtable
            const payload = await airtableService.listWebhookPayloads(item.webhook.id);
            console.log("Payload:")
            console.log(payload);

            // Transform and sync to Webflow
            // await webflowService.syncToWebflow(record);

            // Transform and sync to Google Ads
            // await googleAdsService.syncToGoogleAds(record);

            // Log successful sync
            // logger.log('info', `Successfully synced record ${item.id} to Webflow and Google Ads`);

        } catch (error) {
            // Log the error
            // logger.log('error', `Error syncing record ${item.id}: ${error.message}`);

            // Throw the error to be caught by the publish handler
            // throw new Error(`Failed to sync record ${item.id}: ${error.message}`);
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
