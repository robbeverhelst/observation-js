import { ObservationClient } from '../src';

async function main() {
  const client = new ObservationClient();

  // --- Note: You must replace these with a valid group ID and invite code ---
  const groupId = 1; // Replace with a real group ID
  const inviteCode = 'f1508fdf-5d98-4f4e-a89b-ba13f0fc79b7'; // Replace with a real invite code

  console.log(
    `--- Fetching public summary for Group ID: ${groupId} (unauthenticated) ---`
  );
  try {
    const summary = await client.groups.getSummary(groupId, inviteCode);
    console.log('Successfully fetched group summary:');
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error('Error fetching group summary:', error);
  }

  console.log(
    '\\n--- Note: Most group endpoints require authentication and group membership and are not demonstrated here. ---'
  );
}

main().catch(console.error); 