import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching GeoJSON for a location by ID ---');
  try {
    const geoJsonById = await client.locations.getGeoJSON({ id: 17954 });
    console.log('Successfully fetched GeoJSON by ID.');
    console.log(JSON.stringify(geoJsonById, null, 2));
  } catch (error) {
    console.error('Error fetching GeoJSON by ID:', error);
  }

  console.log('\\n--- Fetching GeoJSON for a location by Point ---');
  try {
    const geoJsonByPoint = await client.locations.getGeoJSON({
      point: 'POINT(4.836731 52.393704)',
    });
    console.log('Successfully fetched GeoJSON by Point.');
    console.log(JSON.stringify(geoJsonByPoint, null, 2));
  } catch (error) {
    console.error('Error fetching GeoJSON by Point:', error);
  }

  console.log(
    '\\n--- Note: Other location endpoints require authentication and cannot be demonstrated here. ---'
  );
}

main().catch(console.error); 