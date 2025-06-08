import { ObservationClient } from '../src';

const client = new ObservationClient();

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