import { ObservationClient, ApiError } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching all available region species lists ---');
  try {
    const lists = await client.regionSpeciesLists.list();
    console.log(`Successfully fetched ${lists.length} region species lists.`);

    if (lists.length > 0) {
      console.log('First 5 lists:');
      console.table(lists.slice(0, 5));

      const firstListId = lists[0].id;
      console.log(
        `\n--- Fetching species for the first list (ID: ${firstListId}) ---`,
      );

      const species = await client.regionSpeciesLists.getSpecies(firstListId);
      console.log(`Successfully fetched ${species.length} species.`);
      console.log('First 5 species in this list:');
      console.table(
        species.slice(0, 5).map((s) => ({
          name: s.name,
          scientific_name: s.scientific_name,
          rarity: s.rarity,
        })),
      );
    }
  } catch (error) {
    console.error('Error fetching region species lists:', error);
    if (error instanceof ApiError) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Body:`, error.body);
    }
  }
}

main().catch(console.error);
