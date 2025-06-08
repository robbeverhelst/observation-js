import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching onboarding badges (unauthenticated) ---');
  try {
    const badges = await client.badges.list();
    console.log(`Successfully fetched ${badges.results.length} onboarding badges.`);

    if (badges.results.length > 0) {
      console.log('First badge:', badges.results[0].name);
      console.table(badges.results.slice(0, 5));

      const firstBadgeId = badges.results[0].id;
      console.log(
        `\\n--- Fetching details for the first badge (ID: ${firstBadgeId}) ---`
      );
      const badgeDetails = await client.badges.get(firstBadgeId);
      console.log('Successfully fetched details for badge:', badgeDetails.name);
      console.log(JSON.stringify(badgeDetails, null, 2));
    }
  } catch (error) {
    console.error('Error fetching badges:', error);
  }

  console.log(
    '\\n--- Note: Authenticated badge endpoints provide user-specific data and are not demonstrated here. ---'
  );
}

main().catch(console.error); 