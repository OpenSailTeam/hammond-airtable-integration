const airtable = require('airtable');
const queue = require('../utils/queue');

exports.addToQueue = async (id) => {
    queue.push({ id });
};

exports.getQueue = () => {
    return queue.getAll();
};

exports.clearQueue = () => {
    queue.clear();
};

// Function to fetch data from Airtable
exports.getRecordById = async (id) => {
    const base = new airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
    return base(process.env.AIRTABLE_TABLE_ID);
};
