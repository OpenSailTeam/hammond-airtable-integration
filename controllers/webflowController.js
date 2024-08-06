const webflowService = require('../services/webflowService');
const airtableService = require('../services/airtableService');

exports.publishChanges = async (req, res) => {
    try {
        const queue = airtableService.getQueue();
        await webflowService.syncToWebflow(queue);
        await webflowService.syncToGoogleAds(queue);
        airtableService.clearQueue();
        res.status(200).send('Changes published');
    } catch (error) {
        console.error('Error publishing changes:', error);
        res.status(500).send('Error publishing changes');
    }
};
