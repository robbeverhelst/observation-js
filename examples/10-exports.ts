import { ObservationClient, ApiError } from '../src';

// This example demonstrates how to list the observation exports for a user.
// This is an authenticated endpoint and requires a valid access token.

// The access token is passed as a command-line argument.
const accessToken = process.argv[2] || null;

const main = async () => {
  if (!accessToken) {
    console.log(
      'Access token is required. Please provide it as a command-line argument.',
    );
    console.log(
      'Skipping example. Set WAARNEMING_NL_ACCESS_TOKEN to run this.',
    );
    return;
  }

  const client = new ObservationClient();
  client.setAccessToken(accessToken);

  console.log('--- Fetching observation exports for the current user ---');

  try {
    const exports = await client.exports.list();

    if (exports.count === 0) {
      console.log('No exports found for this user.');
      return;
    }

    console.log(`Found ${exports.count} export(s):`);
    console.table(
      exports.results.map((exp) => ({
        ID: exp.id,
        Description: exp.description,
        'Is Ready?': exp.is_ready,
        'File Size': exp.filesize ? `${exp.filesize} bytes` : 'N/A',
        'Download URL': exp.is_ready ? exp.download_url : 'Processing...',
        'Expires At': exp.expires,
      })),
    );
  } catch (error) {
    console.error('Failed to fetch exports:');
    if (error instanceof ApiError) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Body:`, error.body);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

main().catch(console.error);
