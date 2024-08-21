const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const deleteWebhookById = async (webhookId) => {
  try {
    await axios.delete(
      `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${webhookId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Deleted webhook: ${webhookId}`);
  } catch (error) {
    console.error(`Error deleting webhook ${webhookId}:`, error.response ? error.response.data : error.message);
  }
};

const deleteAllWebhooks = async (notificationUrl) => {
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
      return;
    }

    const filteredWebhooks = notificationUrl
      ? webhooks.filter((webhook) => webhook.notificationUrl === notificationUrl)
      : webhooks;

    if (filteredWebhooks.length === 0) {
      console.log('No webhooks matched the provided notificationUrl.');
      return;
    }

    for (const webhook of filteredWebhooks) {
      await deleteWebhookById(webhook.id);
    }
  } catch (error) {
    console.error('Error listing webhooks:', error.response ? error.response.data : error.message);
  }
};

const main = async () => {
  const notificationUrl = await promptUser('Enter the notificationUrl to delete (leave empty to delete all webhooks): ');

  if (!notificationUrl) {
    const confirm = await promptUser('No notificationUrl entered. Are you sure you want to delete all webhooks? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Aborting.');
      rl.close();
      return;
    }
  }

  await deleteAllWebhooks(notificationUrl);
  rl.close();
};

main();
