const axios = require('axios');
require('dotenv').config();

exports.createWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks`,
      {
        notificationUrl: "https://hammond.api.opensail.com:3000/airtable/webhook",
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

exports.deleteWebhook = async (id) => {
  try {
    const response = await axios.delete(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${id}`,
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
