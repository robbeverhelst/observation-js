import { ObservationClient, ApiError } from '../src';

// This example demonstrates how to fetch a single observation by its ID.
// This is an authenticated endpoint that uses password grant authentication.

// Load credentials from environment
const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const username = process.env.OAUTH_USERNAME;
const password = process.env.OAUTH_PASSWORD;

// A hardcoded observation ID for demonstration purposes.
// This is one of your observations - a Common Kestrel from 2025-06-24
// Replace with a different ID if you want to test with another observation.
const observationId = 358548547;

const main = async () => {
  if (!clientId || !clientSecret) {
    console.log('❌ Missing OAuth credentials in .env file');
    console.log('Required: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET');
    return;
  }

  if (!username || !password) {
    console.log('❌ Missing user credentials in .env file');
    console.log('Please add OAUTH_USERNAME (email) and OAUTH_PASSWORD to .env');
    return;
  }

  console.log('🔐 Authenticating with password grant...');

  const client = new ObservationClient({
    platform: 'nl',
    test: false // Use production environment for OAuth
  });

  try {
    // Authenticate using password grant
    const tokenResponse = await client.getAccessTokenWithPassword({
      clientId,
      clientSecret,
      email: username,
      password,
    });

    console.log('✅ Authentication successful!');
    console.log(`Access token expires in: ${tokenResponse.expires_in} seconds`);
  } catch (error) {
    console.error('❌ Authentication failed:');
    if (error instanceof ApiError) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Body:`, error.body);
    } else {
      console.error(error);
    }
    process.exit(1);
  }

  console.log(`--- Fetching details for observation ID: ${observationId} ---`);

  try {
    const observation = await client.observations.get(observationId);
    console.log('Observation found:');
    console.log(`- Species: ${observation.species_detail?.name || 'Unknown'}`);
    console.log(`- Scientific name: ${observation.species_detail?.scientific_name || 'N/A'}`);
    console.log(`- Observer: ${observation.user_detail?.name || 'Unknown'}`);
    console.log(`- Date: ${observation.date}`);
    console.log(`- Time: ${observation.time || 'Not specified'}`);
    console.log(`- Location: ${observation.location_detail?.name || 'Unknown location'}`);
    console.log(`- Coordinates: ${observation.point?.coordinates?.join(', ') || 'No coordinates'}`);
    console.log(`- Validation status: ${observation.validation_status}`);
    console.log(`- URL: ${observation.permalink || observation.url || 'N/A'}`);
    
    if (observation.photos && observation.photos.length > 0) {
      console.log(`- Photos: ${observation.photos.length} photo(s)`);
    }
    
    if (observation.notes) {
      console.log(`- Notes: ${observation.notes}`);
    }

    // Now demonstrate the new search methods
    console.log('\n--- Demonstrating new observation search methods ---');

    // 1. Get more observations from the same species
    if (observation.species) {
      console.log(`\n📊 Getting other ${observation.species_detail?.name || 'this species'} observations:`);
      try {
        const speciesObs = await client.observations.getBySpecies(observation.species, {
          limit: 3,
          ordering: '-date'
        });
        console.log(`Found ${speciesObs.count} total observations of this species, showing 3 recent ones:`);
        speciesObs.results.forEach((obs, index) => {
          console.log(`  ${index + 1}. ${obs.date} - ${obs.location_detail?.name || 'Unknown'} (ID: ${obs.id})`);
        });
      } catch (error) {
        console.log('Could not fetch species observations');
      }
    }

    // 2. Get observations from the same location
    if (observation.location) {
      console.log(`\n📍 Getting other observations from ${observation.location_detail?.name}:`);
      try {
        const locationObs = await client.observations.getByLocation(observation.location, {
          limit: 3,
          ordering: '-date'
        });
        console.log(`Found ${locationObs.count} total observations from this location, showing 3 recent ones:`);
        locationObs.results.forEach((obs, index) => {
          console.log(`  ${index + 1}. ${obs.species_detail?.name || 'Unknown'} - ${obs.date} (ID: ${obs.id})`);
        });
      } catch (error) {
        console.log('Could not fetch location observations');
      }
    }

    // 3. Get observations around this point
    if (observation.point?.coordinates) {
      console.log(`\n🗺️  Getting observations within 2km of this location:`);
      try {
        const nearbyObs = await client.observations.getAroundPoint({
          lng: observation.point.coordinates[0],
          lat: observation.point.coordinates[1],
          radius_km: 2,
          limit: 3,
          ordering: '-date'
        });
        console.log(`Found ${nearbyObs.count} observations within 2km, showing 3 recent ones:`);
        nearbyObs.results.forEach((obs, index) => {
          console.log(`  ${index + 1}. ${obs.species_detail?.name || 'Unknown'} - ${obs.date} (ID: ${obs.id})`);
        });
      } catch (error) {
        console.log('Could not fetch nearby observations');
      }
    }

    // 4. Get your own observations (authenticated)
    console.log(`\n👤 Getting your recent observations:`);
    try {
      const userObs = await client.observations.getByUser(undefined, {
        limit: 3,
        ordering: '-date'
      });
      console.log(`You have ${userObs.count} total observations, showing 3 recent ones:`);
      userObs.results.forEach((obs, index) => {
        console.log(`  ${index + 1}. ${obs.species_detail?.name || 'Unknown'} - ${obs.date} (ID: ${obs.id})`);
      });
    } catch (error) {
      console.log('Could not fetch your observations (authentication required)');
    }

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
