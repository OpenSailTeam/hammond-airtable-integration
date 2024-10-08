const airtableService = require('../services/airtableService');
const adsService = require('../services/googleAdsService');
const syncService = require('../services/syncServiceTest');

exports.handleWebhook = async (req, res) => {
    try {
        const { id } = req.body.webhook;
        console.log("handleWebhook:");
        console.log(id);
        res.status(200).send('Received');
    } catch (error) {
        console.error('Error handling Airtable webhook:', error);
        res.status(500).send('Error processing request');
    }
};

exports.handlePublish = async (req, res) => {
    try {
        console.log("Run Publish");
        const allRecords = await airtableService.getAllRecords();
        await syncService.syncToGoogleAds(allRecords);
        // If successful, send a 200 response
        res.status(200).send('Publish handled successfully');
    } catch (error) {
        console.error('Error in publish handler:', error);

        // If any error occurs during the sync process, send a 500 response
        res.status(500).send('Error during sync process');
    }
};

