const axios = require('axios');

exports.syncToWebflow = async (record) => {
    // Transform data for Webflow format
    const webflowData = transformToWebflowData(record);
    console.log(webflowData);
    // Send data to Webflow API
    // await axios.post(`${process.env.WEBFLOW_API_URL}/collections/${process.env.WEBFLOW_COLLECTION_ID}/items`, webflowData, {
    //     headers: {
    //         'Authorization': `Bearer ${process.env.WEBFLOW_API_TOKEN}`
    //     }
    // });
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


