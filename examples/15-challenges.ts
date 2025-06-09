import { ObservationClient, ApiError } from '../src';

// This example demonstrates how to interact with challenges.
// It shows public endpoints and includes examples for authenticated actions.

// The access token is passed as a command-line argument.
const accessToken = process.argv[2] || null;
const client = new ObservationClient();

async function main() {
  console.log('--- Listing public challenges (onboarding) ---');
  const onboardingChallenges = await client.challenges.list({
    type: 'onboarding',
  });
  console.log(
    'Onboarding challenges found:',
    onboardingChallenges.results.length,
  );

  if (onboardingChallenges.results.length > 0) {
    const challenge = onboardingChallenges.results[0];
    console.log(`\n--- Getting details for challenge ${challenge.id} ---`);
    const challengeDetails = await client.challenges.get(challenge.id);
    console.log('Challenge title:', challengeDetails.title);

    console.log(
      `\n--- Getting personal ranking for challenge ${challenge.id} ---`,
    );
    // Note: for an unauthenticated user, this will show a default/empty state.
    // For an authenticated user, it shows their personal progress.
    const ranking = await client.challenges.getRanking(challenge.id, 'species');

    if (ranking && ranking.rank !== undefined) {
      console.log("Current user's rank:", ranking.rank);
      console.log("Current user's species count:", ranking.species_count);
    } else {
      console.log('No personal ranking information available.');
    }
  }

  // --- Authenticated endpoints ---
  if (!accessToken) {
    console.log(
      '\n--- Skipping authenticated challenge examples. Set WAARNEMING_NL_ACCESS_TOKEN to run them. ---',
    );
    return;
  }
  client.setAccessToken(accessToken);

  try {
    console.log('\n--- Listing regular challenges (authenticated) ---');
    const regularChallenges = await client.challenges.list({ type: 'regular' });
    console.log('Regular challenges found:', regularChallenges.results.length);

    if (regularChallenges.results.length > 0) {
      const challengeId = regularChallenges.results[0].id;

      console.log(`\n--- Subscribing to challenge ${challengeId} ---`);
      // Note: We set it to `false` to immediately unsubscribe and not leave a trace.
      // Set to `true` to actually subscribe.
      const subscription = await client.challenges.subscribe(
        challengeId,
        false,
      );
      console.log(
        `Is subscribed to challenge ${challengeId}:`,
        subscription.is_subscribed,
      );
    }
  } catch (error) {
    console.error('\nFailed to run authenticated challenge examples:');
    if (error instanceof ApiError) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Body:`, error.body);
    } else {
      console.error(error);
    }
  }
}

main().catch(console.error);
