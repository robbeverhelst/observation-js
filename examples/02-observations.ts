import { ObservationClient, ApiError } from '../src';

// This example demonstrates how to fetch a single observation by its ID.
// This is an authenticated endpoint and requires a valid access token.

// The access token is passed as a command-line argument.
const accessToken = process.argv[2] || null;

// A hardcoded observation ID for demonstration purposes.
// This observation is for a "Fuut" (Great Crested Grebe).
// Replace with a different ID if you want to test with another observation.
const observationId = 25488439;

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

  console.log(`--- Fetching details for observation ID: ${observationId} ---`);

  try {
    const observation = await client.observations.get(observationId);
    console.log('Observation found:');
    console.log(`- Species: ${observation.species?.name}`);
    console.log(`- Observer: ${observation.user.name}`);
    console.log(`- Date: ${observation.date}`);
    console.log(`- Location: ${observation.location?.name}`);
    console.log(`- URL: ${observation.url}`);
  } catch (error) {
    console.error('Failed to fetch observation:');
    if (error instanceof ApiError) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Body:`, error.body);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

main();
