import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log(
    '--- Note: All export endpoints require authentication. ---'
  );
  console.log(
    '--- Please uncomment the code below and provide a valid access token. ---'
  );

  /*
  // 1. Set the access token
  client.setAccessToken('YOUR_ACCESS_TOKEN');

  try {
    // 2. Start an export of your observations
    console.log('\\n--- Starting a new user observations export ---');
    const startResponse = await client.exports.start({
      type: 'USER_OBSERVATIONS',
      export_format: 'csv',
    });
    console.log('Successfully started export:', startResponse);
    const newExportId = startResponse.id;

    // 3. List all current exports
    console.log('\\n--- Listing all exports ---');
    const exports = await client.exports.list();
    console.log(`Found ${exports.count} total exports.`);
    console.table(exports.results);

    // 4. Get details for the newly created export
    if (newExportId) {
      console.log(`\\n--- Getting details for export ID: ${newExportId} ---`);
      // Note: The export might take time to process.
      // You may need to poll the `get` endpoint until `is_ready` is true.
      const exportDetails = await client.exports.get(newExportId);
      console.log('Export details:', exportDetails);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
  */
}

main().catch(console.error); 