import { ObservationClient } from '../src';
import fs from 'fs/promises';
import path from 'path';

// This example demonstrates how to use the NIA (Naturalis Image Analysis) proxy
// for image identification. This endpoint can be used anonymously (with a daily
// limit) or with authentication for unlimited use.

async function main() {
  const client = new ObservationClient();

  // For authenticated requests, uncomment the following lines and ensure
  // the WAARNEMING_NL_ACCESS_TOKEN environment variable is set.
  //
  // const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN;
  // if (!accessToken) {
  //   console.error(
  //     'Error: WAARNEMING_NL_ACCESS_TOKEN environment variable not set.'
  //   );
  //   return;
  // }
  // client.setAccessToken(accessToken);

  try {
    // --- 1. Load an image file ---
    const imagePath = path.join(__dirname, 'robin.jpeg');
    const imageBlob = Bun.file(imagePath);

    console.log('--- Requesting identification for an image ---');

    // --- 2. Request identification (with optional location) ---
    const niaResponse = await client.nia.identify({
      images: [imageBlob],
      location: { lat: 51.0543, lng: 3.7174 }, // Ghent, Belgium
    });

    console.log('Successfully received NIA response.');

    // --- 3. Display results ---
    console.log('\nModel Coverage:', niaResponse.model_coverage.description);

    if (niaResponse.location_detail) {
      console.log('Location:', niaResponse.location_detail.name);
    }

    if (niaResponse.species && niaResponse.species.length > 0) {
      console.log('\nTop 5 Predictions:');
      const predictions = niaResponse.predictions.slice(0, 5);
      const displayData = predictions.map((pred, i) => {
        const species = niaResponse.species?.find(
          (s) => s.scientific_name === pred.taxon.name,
        );
        return {
          '#': i + 1,
          Probability: `${(pred.probability * 100).toFixed(2)}%`,
          'Scientific Name': pred.taxon.name,
          'Common Name': species?.name || 'N/A',
          Group: species?.group || 'N/A',
        };
      });
      console.table(displayData);
    } else {
      console.log('\nNo species predictions returned.');
    }
  } catch (error) {
    console.error('Error during NIA identification:', error);
  }
}

main().catch(console.error);
