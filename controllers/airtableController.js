const airtableService = require('../services/airtableService');

exports.handleWebhook = async (req, res) => {
    console.log("something was received");
    try {
        const { id } = req.body; // assuming id and type are sent by the webhook
        console.log("ID:");
        console.log(id);
        await airtableService.addToQueue(id);
        res.status(200).send('Received');
    } catch (error) {
        console.error('Error handling Airtable webhook:', error);
        res.status(500).send('Error processing request');
    }
};
