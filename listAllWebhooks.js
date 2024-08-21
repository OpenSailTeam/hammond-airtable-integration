const axios = require('axios');
require('dotenv').config();

const listAllWebhooks = async () => {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const webhooks = response.data.webhooks;

    if (webhooks.length === 0) {
      console.log('No webhooks found.');
    } else {
      webhooks.forEach((webhook, index) => {
        console.log(`Webhook ${index + 1}:`);
        console.log(`ID: ${webhook.id}`);
        console.log(`Notification URL: ${webhook.notificationUrl}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error listing webhooks:', error.response ? error.response.data : error.message);
  }
};

// Run the function to list all webhooks
listAllWebhooks();
