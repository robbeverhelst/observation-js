import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching all countries (in English) ---');
  try {
    const countries = await client.countries.list();
    console.log(`Successfully fetched ${countries.results.length} countries.`);
    console.log('First 5 countries (English):');
    console.table(countries.results.slice(0, 5));
  } catch (error) {
    console.error('Error fetching countries:', error);
  }

  console.log('\\n--- Setting language to Dutch ---');
  client.setLanguage('nl');

  console.log('\\n--- Fetching all countries (in Dutch) ---');
  try {
    const countriesNl = await client.countries.list();
    console.log(
      `Successfully fetched ${countriesNl.results.length} countries.`,
    );
    console.log('First 5 countries (Dutch):');
    console.table(countriesNl.results.slice(0, 5));
  } catch (error) {
    console.error('Error fetching countries in Dutch:', error);
  }
}

main().catch(console.error);
