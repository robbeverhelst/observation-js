import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching all lookup constants ---');
  try {
    const lookups = await client.lookups.get();
    console.log('Successfully fetched lookups.');

    for (const [key, values] of Object.entries(lookups)) {
      console.log(`\n--- ${key.replace(/_/g, ' ')} ---`);
      console.table(values);
    }
  } catch (error) {
    console.error('Error fetching lookups:', error);
  }
}

main().catch(console.error); 