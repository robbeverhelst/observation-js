import { ObservationClient } from '../src/index';

async function main() {
  const client = new ObservationClient();
  client.setLanguage('nl');

  const examples = [
    {
      title: '1. Get Details for a Single Species (ID: 2, Little Grebe)',
      fn: async () => {
        const species = await client.species.get(2);
        console.log(
          `Successfully fetched: ${species.name} (${species.scientific_name})`
        );
        console.log(`Group: ${species.group_name}`);
        console.log(`Status: ${species.status}`);
        console.log(`Rarity: ${species.rarity}`);
      },
    },
    {
      title: '2. Search for a Species (Query: "witkeelgors")',
      fn: async () => {
        const searchResult = await client.species.search({ q: 'witkeelgors' });
        console.log(`Found ${searchResult.count} result(s).`);
        for (const species of searchResult.results) {
          console.log(`- ${species.name} (ID: ${species.id})`);
        }
      },
    },
    {
      title:
        '3. Get Observations for a Species (ID: 32, Black Tern, Limit: 3)',
      fn: async () => {
        const observations = await client.species.getObservations(32, {
          limit: 3,
        });
        console.log(
          `Found ${observations.count} total observations. Showing first ${observations.results.length}:`
        );
        observations.results.forEach((obs) => {
          console.log(
            `- Observation ID: ${obs.id} on ${obs.date} by ${
              obs.user?.name || 'Unknown'
            }`
          );
        });
      },
    },
    {
      title: '4. List All Species Groups',
      fn: async () => {
        const groups = await client.species.listGroups();
        console.log(`Found ${groups.length} species groups:`);
        console.log(groups.map((g) => g.name).join(', '));
      },
    },
    {
      title: '5. Get Attributes for a Species Group (ID: 1, Birds)',
      fn: async () => {
        const attributes = await client.species.getGroupAttributes(1);
        console.log(`Attributes for group: ${attributes.name}`);
        console.log(
          `- Found ${attributes.activity.length} possible activities.`
        );
        console.log(
          `- Found ${attributes.life_stage.length} possible life stages.`
        );
        console.log(`- Found ${attributes.method.length} possible methods.`);
        const defaultActivity = attributes.activity.find((a) => a.is_default);
        if (defaultActivity) {
          console.log(`- The default activity is: "${defaultActivity.text}"`);
        }
      },
    },
    // {
    //   title: '6. Get Species Occurrence',
    //   fn: async () => {
    //     const speciesIds = [1, 2, 999999]; // Little Grebe, Black Tern, and a non-existent species
    //     const point = 'POINT(4.8 52.3)'; // A point in the Netherlands
    //     const occurrence = await client.species.getOccurrence(speciesIds, point);
    //     console.log(
    //       `Checking occurrence for species IDs ${speciesIds.join(', ')} at ${point}:`
    //     );
    //     occurrence.results.forEach((occ) => {
    //       console.log(
    //         `- Species ID ${occ.species_id} occurs here: ${occ.occurs}`
    //       );
    //     });
    //   },
    // },
  ];

  for (const { title, fn } of examples) {
    console.log(`--- ${title} ---`);
    try {
      await fn();
    } catch (error) {
      console.error('An error occurred:', error);
    }
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

main(); 