const { getAllRecords } = require('./airtableService');

async function analyzeCurrentData() {
    try {
        console.log('Fetching all records from current Airtable configuration...\n');
        
        const allRecords = await getAllRecords();
        
        console.log(`Total records found: ${allRecords.length}\n`);
        
        allRecords.forEach((record, index) => {
            const name = record.fields.Name || 'No name';
            const draft = record.fields.Draft;
            const archived = record.fields.Archived;
            const id = record.id;
            
            console.log(`${index + 1}. Record ID: ${id}`);
            console.log(`   Name: ${name}`);
            console.log(`   Draft: ${draft}`);
            console.log(`   Archived: ${archived}`);
            console.log(`   Fields: ${Object.keys(record.fields).join(', ')}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Run the analysis
analyzeCurrentData();
