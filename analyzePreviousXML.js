const fs = require('fs');
const xml2js = require('xml2js');

// Function to extract record IDs from the previous XML
async function extractRecordIds() {
  try {
    const xmlData = fs.readFileSync('./output/meta_feed_previous.xml', 'utf8');
    
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);
    
    const listings = result.listings.listing;
    const recordIds = [];
    const statusCounts = { active: 0, off_market: 0, for_sale: 0, other: 0 };
    
    console.log('Analyzing previous XML feed...\n');
    
    listings.forEach((listing, index) => {
      const id = listing.home_listing_id[0];
      const availability = listing.availability ? listing.availability[0] : 'undefined';
      const status = listing.status ? listing.status[0] : 'undefined';
      const name = listing.n ? listing.n[0] : 'No name';
      
      recordIds.push({
        id,
        availability,
        status,
        name: name.substring(0, 50) + (name.length > 50 ? '...' : '')
      });
      
      // Count statuses
      if (status === 'active') statusCounts.active++;
      if (availability === 'off_market') statusCounts.off_market++;
      if (availability === 'for_sale') statusCounts.for_sale++;
      if (!['active'].includes(status) && !['off_market', 'for_sale'].includes(availability)) statusCounts.other++;
      
      // Show first few records for verification
      if (index < 5) {
        console.log(`${index + 1}. ID: ${id}`);
        console.log(`   Name: ${name.substring(0, 60)}${name.length > 60 ? '...' : ''}`);
        console.log(`   Status: ${status}, Availability: ${availability}\n`);
      }
    });
    
    console.log(`Total listings in previous XML: ${listings.length}`);
    console.log(`Status breakdown:`);
    console.log(`  - Active status: ${statusCounts.active}`);
    console.log(`  - Off-market availability: ${statusCounts.off_market}`);
    console.log(`  - For-sale availability: ${statusCounts.for_sale}`);
    console.log(`  - Other: ${statusCounts.other}`);
    
    // Save to file for reference
    fs.writeFileSync('./output/previous_record_ids.json', JSON.stringify(recordIds, null, 2));
    console.log('\nRecord IDs saved to ./output/previous_record_ids.json');
    
    return recordIds;
  } catch (error) {
    console.error('Error parsing XML:', error);
    return [];
  }
}

// Run the analysis
if (require.main === module) {
  extractRecordIds();
}

module.exports = { extractRecordIds };
