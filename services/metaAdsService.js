const { getAllRecords, createWebhook, deleteWebhook } = require('./services/airtableService');
const { syncToGoogleAds, syncToMetaAds } = require('./services/syncServiceTest');

const allRecords = await getAllRecords();
await syncToMetaAds(allRecords);
console.log(`New feed file available`);
