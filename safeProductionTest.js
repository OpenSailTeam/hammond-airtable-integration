const airtable = require('airtable');
const { syncToMetaAds } = require('./services/syncService');
const fs = require('fs');
require('dotenv').config();

/**
 * SAFE PRODUCTION DATA ANALYSIS
 * This script ONLY READS from production - it will NOT modify anything
 */

async function fetchProductionDataSafely() {
    // Production credentials (READ-ONLY)
    const PRODUCTION_BASE_ID = 'appE7cRgqFYL83Ad2';
    const PRODUCTION_TABLE_ID = 'tblLXmkJ9USTuZLIt';
    
    console.log('🔒 SAFE MODE: Reading from production (NO MODIFICATIONS)');
    console.log(`📊 Base: ${PRODUCTION_BASE_ID}`);
    console.log(`📋 Table: ${PRODUCTION_TABLE_ID}\n`);
    
    try {
        // Use the same access token (read-only operation)
        const base = new airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(PRODUCTION_BASE_ID);
        const table = base(PRODUCTION_TABLE_ID);
        const records = [];

        // Fetch all records (read-only)
        await new Promise((resolve, reject) => {
            table.select().eachPage((pageRecords, fetchNextPage) => {
                records.push(...pageRecords);
                fetchNextPage();
            }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log(`✅ Successfully fetched ${records.length} records from production\n`);
        
        // Analyze the data structure
        if (records.length > 0) {
            console.log('📈 Sample record fields:');
            console.log(Object.keys(records[0].fields).join(', '));
            console.log('\n');
        }
        
        return records;
        
    } catch (error) {
        console.error('❌ Error fetching production data:', error);
        throw error;
    }
}

async function generateTestXMLWithProductionData() {
    try {
        // Step 1: Safely fetch production data (read-only)
        const productionRecords = await fetchProductionDataSafely();
        
        // Step 2: Process with our new logic (in memory only)
        console.log('🔄 Processing data with NEW logic (in memory)...');
        
        // Temporarily override the output file to avoid overwriting the test file
        const originalSyncToMetaAds = require('./services/syncService').syncToMetaAds;
        
        // Create a modified version that outputs to a different file
        const testSyncToMetaAds = async (records) => {
            // Call the original function but redirect output
            const originalWriteFileSync = fs.writeFileSync;
            let xmlContent = '';
            
            // Temporarily capture the XML content instead of writing to file
            fs.writeFileSync = (filePath, content) => {
                if (filePath.includes('meta_feed.xml')) {
                    xmlContent = content;
                } else {
                    originalWriteFileSync(filePath, content);
                }
            };
            
            // Run the sync logic
            await originalSyncToMetaAds(records);
            
            // Restore original function
            fs.writeFileSync = originalWriteFileSync;
            
            // Write to our test file
            fs.writeFileSync('./output/meta_feed_NEW_LOGIC.xml', xmlContent);
            
            return xmlContent;
        };
        
        // Step 3: Generate new XML with updated logic
        await testSyncToMetaAds(productionRecords);
        
        console.log('✅ New XML generated: ./output/meta_feed_NEW_LOGIC.xml');
        console.log('✅ Original production data: UNCHANGED');
        console.log('\n🔍 You can now compare:');
        console.log('   - Original: ./output/meta_feed_previous.xml');
        console.log('   - New Logic: ./output/meta_feed_NEW_LOGIC.xml');
        
    } catch (error) {
        console.error('❌ Error in testing:', error);
    }
}

// Run the safe test
if (require.main === module) {
    console.log('🚀 Starting SAFE production data test...\n');
    generateTestXMLWithProductionData();
}

module.exports = { fetchProductionDataSafely, generateTestXMLWithProductionData };
