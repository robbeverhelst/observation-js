import { ObservationClient } from '../src/index';

async function main() {
  const client = new ObservationClient();

  console.log('--- Fetching all public groups (unauthenticated) ---');
  try {
    const groups = await client.groups.list();
    console.log(`Successfully fetched ${groups.count} groups.`);
    if (groups.count > 0) {
      console.log('First 5 groups:');
      groups.results.slice(0, 5).forEach((group) => {
        console.log(`- ${group.name} (ID: ${group.id})`);
      });
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
  }

  console.log(
    '\n--- Note: Most group endpoints require authentication and group membership and are not demonstrated here. ---',
  );
}

main(); 