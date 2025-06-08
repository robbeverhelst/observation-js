import { ObservationClient } from '../src/index';

// This example demonstrates how to fetch a single observation by its ID.
// NOTE: This is an authenticated endpoint and requires a valid access token.
// You must first obtain a token using one of the authentication flows.
// You will also need a real, valid observation ID to test this.

/*
const main = async () => {
  // 1. Initialize the client.
  const client = new ObservationClient();

  // 2. Set your access token.
  // Replace "YOUR_ACCESS_TOKEN" with a valid token.
  const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
  if (accessToken === 'YOUR_ACCESS_TOKEN') {
    console.error('Please set your access token in the script or via the WAARNEMING_NL_ACCESS_TOKEN environment variable.');
    return;
  }
  client.setAccessToken(accessToken);

  // 3. Define the ID of the observation you want to fetch.
  // Replace with a real observation ID.
  const observationId = 12345;

  console.log(`Fetching observation with ID: ${observationId}...`);

  try {
    // 4. Fetch the observation.
    const observation = await client.observations.get(observationId);

    console.log('--- Observation Found! ---');
    console.log(`ID: ${observation.id}`);
    console.log(`Species: ${observation.species_detail.name}`);
    console.log(`Date: ${observation.date}`);
    console.log(`Observer: ${observation.user_detail.name}`);
    console.log(`Location: ${observation.location_detail.name}`);
    console.log(`Notes: ${observation.notes || 'N/A'}`);
    console.log(`Permalink: ${observation.permalink}`);
    console.log('--------------------------');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();
*/

console.log(
  'This script is a commented-out example for fetching a single observation.'
);
console.log('Please read the comments in the file to learn how to use it.'); 