const axios = require('axios');
require('dotenv').config();

exports.createWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks`,
      {
        notificationUrl: "http://34.136.105.159:3000/airtable/webhook",
        specification: {
            options: {
            filters: {
                fromSources: ['client', 'publicApi'],
                dataTypes: ['tableData'],
                recordChangeScope: `${process.env.AIRTABLE_TABLE_ID}`
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
