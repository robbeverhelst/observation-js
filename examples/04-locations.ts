import { ObservationClient } from '../src/index';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching GeoJSON for a location by ID (ID: 17954) ---');
  try {
    const geoJsonById = await client.locations.getGeoJSON({ id: 17954 });
    console.log('Successfully fetched GeoJSON by ID.');
    // Keep the output minimal for the test runner
    console.log(`Found feature of type: ${geoJsonById.type}`);
  } catch (error) {
    console.error('Error fetching GeoJSON by ID:', error);
  }

  console.log(
    '\n--- Note: Other location endpoints require authentication and cannot be demonstrated here. ---',
  );
}

main(); 