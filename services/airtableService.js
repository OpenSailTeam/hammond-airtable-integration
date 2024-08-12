const airtable = require('airtable');
const queue = require('../utils/queue');
const webflowService = require('./webflowService');
const googleAdsService = require('./adsService');
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
  const payloads = await listWebhookPayloads(item.id);
  console.log("Payloads:")
  console.log(payloads);
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
