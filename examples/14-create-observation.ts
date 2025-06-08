import { ObservationClient, ApiError } from '../src';
import { join } from 'path';

// This example demonstrates how to create an observation with a photo.
// This is an authenticated endpoint that will create real data.

// The access token is passed as a command-line argument.
const accessToken = process.argv[2] || null;

const main = async () => {
  if (!accessToken) {
    console.log(
      'Access token is required. Please provide it as a command-line argument.'
    );
    console.log(
      'Skipping example. Set WAARNEMING_NL_ACCESS_TOKEN to run this.'
    );
    return;
  }

  const client = new ObservationClient();
  client.setAccessToken(accessToken);

  console.log('--- Creating a new observation with a photo ---');

  try {
    // 1. Get the photo file to upload.
    // This example uses a picture of a European Robin.
    const imagePath = join(__dirname, 'robin.jpeg');
    const imageBlob = Bun.file(imagePath);
    console.log(`Using image: ${imagePath}`);

    // 2. Create the observation with a synchronous photo upload.
    const observation = await client.observations.create(
      {
        // Species ID 13 is for "Roodborst" (European Robin)
        species_id: 13,
        date: new Date().toISOString().split('T')[0], // Today's date
        point: {
          type: 'Point',
          coordinates: [5.4, 51.4], // A point in the Netherlands
        },
        notes:
          'A test observation of a European Robin, created by the observation-js library.',
      },
      {
        upload_photos: [imageBlob], // Upload the blob directly
      }
    );

    console.log('--- Observation Created Successfully! ---');
    console.log(`- Observation ID: ${observation.id}`);
    console.log(`- Species: ${observation.species?.name}`);
    console.log(`- See it online: ${observation.url}`);
    console.log(
      '- NOTE: This observation was created as a real record. You may want to delete it from the website.'
    );
  } catch (error) {
    console.error('Failed to create observation:');
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