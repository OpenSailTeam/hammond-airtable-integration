const { syncToMetaAds } = require('./services/syncService');

// Test data with archived and active listings - corrected approach
const testRecords = [
  {
    id: 'rec123Active',
    fields: {
      'Name': 'Active Test Listing',
      'Draft': 'false',
      'Archived': 'false',
      'General Description': 'This is an active test listing',
      'Link': 'https://hammondrealty.ca/listings/active-test',
      'Service Type': ['recnvvs22bNVHt6nB'],
      'Listing Status (New)': ['recM9mTgZ2PBOjvUC'],
      'Name (from Closest Town)': ['Test Town'],
      'Coordinates': '52.1579,-106.6702',
      'Price (P)': 150000,
      'Webflow Image URL': 'https://example.com/image.jpg'
    }
  },
  {
    id: 'rec456Archived',
    fields: {
      'Name': 'Archived Test Listing',
      'Draft': 'false',
      'Archived': 'true',
      'General Description': 'This listing should be archived',
      'Link': 'https://hammondrealty.ca/listings/archived-test',
      'Service Type': ['recnvvs22bNVHt6nB'],
      'Listing Status (New)': ['recM9mTgZ2PBOjvUC']
    }
  },
  {
    id: 'rec789SoldOffMarket',
    fields: {
      'Name': 'Sold Property - Off Market',
      'Draft': 'false',
      'Archived': 'false',
      'General Description': 'This property was sold but can still be advertised',
      'Link': 'https://hammondrealty.ca/listings/sold-property',
      'Service Type': ['recnvvs22bNVHt6nB'],
      'Listing Status (New)': ['recDdogg7WL8iRLFd'], // This maps to 'off_market' availability
      'Name (from Closest Town)': ['Test Town'],
      'Coordinates': '52.1579,-106.6702',
      'Price (P)': 200000,
      'Webflow Image URL': 'https://example.com/sold-image.jpg'
    }
  }
];

async function testCorrectedMetaSync() {
  console.log('Testing corrected Meta Ads sync approach...');
  console.log('- Active listings: status=active, availability based on listing status');
  console.log('- Archived/Draft listings: status=archived (removes from ads)');
  console.log('- Sold listings: status=active, availability=off_market (can still advertise)');
  console.log('');
  
  try {
    await syncToMetaAds(testRecords);
    console.log('');
    console.log('Test completed! Check the XML output above to verify:');
    console.log('✓ Active listing has status="active" and availability="for_sale"');
    console.log('✓ Archived listing has status="archived" (will be removed from ads)');
    console.log('✓ Sold listing has status="active" and availability="off_market" (can still be advertised)');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testCorrectedMetaSync();
}

module.exports = { testCorrectedMetaSync };
