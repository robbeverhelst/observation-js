import { ObservationClient, ApiError } from '../src';

// This example demonstrates how to list the authenticated user's observation sessions.
// This is an authenticated endpoint and requires a valid access token.

// The access token is passed as a command-line argument.
const accessToken = process.argv[2] || null;

const main = async () => {
  if (!accessToken) {
    console.log(
      'Access token is required. Please provide it as a command-line argument.',
    );
    console.log(
      'Skipping example. Set WAARNEMING_NL_ACCESS_TOKEN to run this.',
    );
    return;
  }

  const client = new ObservationClient();
  client.setAccessToken(accessToken);

  console.log('--- Fetching sessions for the current user ---');

  try {
    const sessions = await client.sessions.list();

    if (sessions.count === 0) {
      console.log('No sessions found for this user.');
      return;
    }

    console.log(`Found ${sessions.count} session(s). Showing first 5:`);
    console.table(
      sessions.results.slice(0, 5).map((session) => ({
        UUID: session.uuid,
        Type: session.type,
        Notes: session.notes,
        'Start Time': session.start_datetime,
        'End Time': session.end_datetime,
      })),
    );
  } catch (error) {
    console.error('Failed to fetch sessions:');
    if (error instanceof ApiError) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Body:`, error.body);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

main().catch(console.error);

// You need to be authenticated to use the sessions endpoints.
//
// const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN;
// if (!accessToken) {
//   throw new Error('WAARNEMING_NL_ACCESS_TOKEN is not set');
// }
// client.setAccessToken(accessToken);
//
// // List sessions
// const sessions = await client.sessions.list();
// console.log('Sessions:', sessions);
//
// // Create a session
// const newSession = await client.sessions.create({
//   uuid: 'a-unique-uuid-for-the-session-3', // Replace with a real UUID
//   type: 'point',
//   observation_lists: [
//     {
//       species_group: 1, // Birds
//       all_species_counted: false,
//       all_individuals_counted: true,
//       notes: 'Test species group note',
//     },
//   ],
//   start_datetime: '2023-01-01T12:00:00',
//   end_datetime: '2023-01-01T13:00:00',
//   geom: {
//     type: 'Point',
//     coordinates: [5.48, 52.12],
//   },
//   notes: 'Test session note',
// });
// console.log('Created session:', newSession);
//
// // Get observations for a session
// if (sessions.results.length > 0) {
//   const sessionWithObservations = sessions.results[0];
//   const observations = await client.sessions.listObservations(
//     sessionWithObservations.uuid,
//   );
//   console.log(
//     `Observations for session ${sessionWithObservations.uuid}:`,
//     observations,
//   );
// }
