const axios = require('axios');
const airtableService = require('./airtableService');

exports.syncToWebflow = async (queue) => {
    for (let item of queue) {
        const record = await airtableService.getRecordById(item.id);
        // Transform data for Webflow format
        const webflowData = transformToWebflowData(record);
        // Send data to Webflow API
        await axios.post(`${process.env.WEBFLOW_API_URL}/collections/${process.env.WEBFLOW_COLLECTION_ID}/items`, webflowData, {
            headers: {
                'Authorization': `Bearer ${process.env.WEBFLOW_API_TOKEN}`
            }
        });
    }
};

exports.syncToGoogleAds = async (queue) => {
    for (let item of queue) {
        const record = await airtableService.getRecordById(item.id);
        // Transform data for Google Ads format
        const googleAdsData = transformToGoogleAdsData(record);
        // Send data to Google Ads API
        await axios.post(`${process.env.GOOGLE_ADS_API_URL}/adGroups`, googleAdsData, {
            headers: {
                'Authorization': `Bearer ${process.env.GOOGLE_ADS_API_TOKEN}`
            }
        });
    }
};

function transformToWebflowData(record) {
    // Implement your transformation logic here
    return {
        "fields": {
            "name": record.fields.Name,
            // Add other necessary fields here
        }
    };
}

function transformToGoogleAdsData(record) {
    // Implement your transformation logic here
    return {
        "adGroup": {
            "name": record.fields.Name,
            // Add other necessary fields here
        }
    };
}
