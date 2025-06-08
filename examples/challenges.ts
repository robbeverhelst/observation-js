import { ObservationClient } from '../src';

const client = new ObservationClient();

async function main() {
  console.log('--- Listing public challenges (onboarding) ---');
  const onboardingChallenges = await client.challenges.list({
    type: 'onboarding',
  });
  console.log('Onboarding challenges:', onboardingChallenges.results.length);

  if (onboardingChallenges.results.length > 0) {
    const challengeId = onboardingChallenges.results[0].id;
    console.log(`\n--- Getting details for challenge ${challengeId} ---`);
    const challengeDetails = await client.challenges.get(challengeId);
    console.log('Challenge details:', challengeDetails.title);

    console.log(`\n--- Getting species ranking for challenge ${challengeId} ---`);
    const speciesRanking = await client.challenges.getRanking(
      challengeId,
      'species',
    );
    console.log(
      'Top ranked user (species):',
      speciesRanking.ranking[0]?.user.name,
    );
  }

  // --- Authenticated endpoints ---
  // const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN;
  // if (!accessToken) {
  //   console.log('\nSkipping authenticated tests, access token not found.');
  //   return;
  // }
  // client.setAccessToken(accessToken);
  //
  // console.log('\n--- Listing regular challenges (authenticated) ---');
  // const regularChallenges = await client.challenges.list({ type: 'regular' });
  // console.log('Regular challenges:', regularChallenges.results.length);
  //
  // if (regularChallenges.results.length > 0) {
  //   const challengeId = regularChallenges.results[0].id;
  //
  //   console.log(`\n--- Subscribing to challenge ${challengeId} ---`);
  //   const subscription = await client.challenges.subscribe(challengeId, true);
  //   console.log('Is subscribed:', subscription.is_subscribed);
  //
  //   if (regularChallenges.results[0].instructions) {
  //     const contentId = regularChallenges.results[0].instructions!.id;
  //     console.log(`\n--- Marking content ${contentId} as seen ---`);
  //     const seenResponse = await client.challenges.markContentAsSeen(contentId);
  //     console.log('Last seen:', seenResponse.last_seen);
  //   }
  // }
}

main().catch(console.error); 