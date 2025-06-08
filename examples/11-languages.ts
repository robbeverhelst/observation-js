import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching all available languages ---');
  try {
    const languages = await client.languages.list();
    console.log(
      `Successfully fetched ${languages.count} languages.`
    );
    console.table(languages.results);
  } catch (error) {
    console.error('Error fetching languages:', error);
  }
}

main().catch(console.error); 