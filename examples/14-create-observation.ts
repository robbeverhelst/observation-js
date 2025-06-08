/*
import { ObservationClient } from '../src';
import path from 'path';

// This example demonstrates how to create and update observations.
// It requires authentication and will modify data, so it is commented out by default.

async function main() {
  // 1. --- AUTHENTICATION ---
  // Ensure you have a valid access token.
  const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN;
  if (!accessToken) {
    console.error(
      'Error: WAARNEMING_NL_ACCESS_TOKEN environment variable not set.'
    );
    return;
  }

  const client = new ObservationClient();
  client.setAccessToken(accessToken);
  let createdObservationId: number | null = null;

  try {
    // 2. --- CREATE A SIMPLE OBSERVATION ---
    console.log('--- Creating a simple observation ---');
    const simpleObservation = await client.observations.create({
      species: 1583, // Witkeelgors (White-throated Sparrow)
      date: '2023-10-27',
      point: 'POINT(5.4 51.4)', // A point in the Netherlands
      notes: 'A simple test observation from observation-js.',
      is_certain: true,
    });
    createdObservationId = simpleObservation.id;
    console.log(
      `Successfully created observation ID: ${simpleObservation.id} for species: ${simpleObservation.species_detail.name}`
    );
    console.log(`Notes: "${simpleObservation.notes}"`);

    // 3. --- UPDATE THE OBSERVATION ---
    console.log('\n--- Updating the observation notes ---');
    const updatedObservation = await client.observations.update(
      createdObservationId,
      {
        notes: 'The notes have been updated!',
      }
    );
    console.log(
      `Successfully updated observation ID: ${updatedObservation.id}`
    );
    console.log(`New Notes: "${updatedObservation.notes}"`);

    // 4. --- CREATE OBSERVATION WITH ASYNC UPLOAD ---
    console.log('\n--- Creating observation with async photo upload ---');
    // First, upload the media file to get a temporary name
    const imagePath = path.join(__dirname, 'robin.jpeg');
    const imageBlob = Bun.file(imagePath);
    const mediaResponse = await client.media.upload(imageBlob);
    console.log(`Uploaded media, temporary name: ${mediaResponse.name}`);
    // Then, create the observation using the temporary name
    const asyncObs = await client.observations.create({
      species: 13, // Roodborst (European Robin)
      date: '2023-10-27',
      point: 'POINT(5.4 51.4)',
      upload_media: [mediaResponse.name],
    });
    console.log(
      `Successfully created observation ID: ${asyncObs.id} with photo.`
    );
    console.log('Photo URL:', asyncObs.photos[0]);

    // 5. --- CREATE OBSERVATION WITH SYNC UPLOAD ---
    console.log('\n--- Creating observation with sync photo upload ---');
    const syncObs = await client.observations.create(
      {
        species: 13, // Roodborst (European Robin)
        date: '2023-10-27',
        point: 'POINT(5.4 51.4)',
      },
      {
        upload_photos: [imageBlob], // Upload the blob directly
      }
    );
    console.log(
      `Successfully created observation ID: ${syncObs.id} with photo.`
    );
    console.log('Photo URL:', syncObs.photos[0]);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main().catch(console.error);
*/