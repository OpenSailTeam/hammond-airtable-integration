const { syncToMetaAds } = require('./services/syncService');

// Test data with archived and active listings
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
    id: 'rec789Draft',
    fields: {
      'Name': 'Draft Test Listing',
      'Draft': 'true',
      'Archived': 'false',
      'General Description': 'This is a draft listing',
      'Link': 'https://hammondrealty.ca/listings/draft-test',
      'Service Type': ['recnvvs22bNVHt6nB']
    }
  }
];

async function testMetaArchivedSync() {
  console.log('Testing Meta Ads sync with archived listings...');
  try {
    await syncToMetaAds(testRecords);
    console.log('Test completed successfully!');
    console.log('Check ./output/meta_feed.xml to see the generated XML feed.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMetaArchivedSync();
}

module.exports = { testMetaArchivedSync };
