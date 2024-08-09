const airtableService = require('../services/airtableService');

exports.handleWebhook = async (req, res) => {
    try {
        const { id } = req.body.webhook;
        console.log("handleWebhook:");
        console.log(id);
        await airtableService.addToQueue(id);
        console.log(airtableService.getQueue());
        res.status(200).send('Received');
    } catch (error) {
        console.error('Error handling Airtable webhook:', error);
        res.status(500).send('Error processing request');
    }
};

exports.handlePublish = async (req, res) => {
    try {
        // Initiate the sync process
        await airtableService.syncQueueToExternalServices();

        // If successful, send a 200 response
        res.status(200).send('Sync process completed successfully');
    } catch (error) {
        console.error('Error in publish handler:', error);

        // If any error occurs during the sync process, send a 500 response
        res.status(500).send('Error during sync process');
    }
};
