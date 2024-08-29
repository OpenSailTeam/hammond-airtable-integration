const { getAllRecords } = require('./airtableService');
const { syncToMetaAds } = require('./syncServiceTest');

async function runMetaAdsService() {
    try {
        const allRecords = await getAllRecords();
        await syncToMetaAds(allRecords);
        console.log(`New feed file available`);
    } catch (error) {
        console.error('Error running Meta Ads service:', error);
    }
}

runMetaAdsService();
