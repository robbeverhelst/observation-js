import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching all regions (in English) ---');
  try {
    const regions = await client.regions.list();
    console.log(`Successfully fetched ${regions.length} regions.`);
    console.log('First 5 regions:');
    console.table(regions.slice(0, 5));
  } catch (error) {
    console.error('Error fetching regions:', error);
  }

  console.log('\\n--- Fetching all region types (in English) ---');
  try {
    const regionTypes = await client.regions.listTypes();
    console.log(`Successfully fetched ${regionTypes.length} region types.`);
    console.table(regionTypes);
  } catch (error) {
    console.error('Error fetching region types:', error);
  }

  console.log('\\n--- Setting language to Dutch ---');
  client.setLanguage('nl');

  console.log('\\n--- Fetching all regions (in Dutch) ---');
  try {
    const regionsNl = await client.regions.list();
    console.log(`Successfully fetched ${regionsNl.length} regions.`);
    console.log('First 5 regions (Dutch):');
    console.table(regionsNl.slice(0, 5));
  } catch (error) {
    console.error('Error fetching regions in Dutch:', error);
  }
}

main().catch(console.error);
