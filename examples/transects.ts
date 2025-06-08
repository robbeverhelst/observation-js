import { ObservationClient } from '../src';

const client = new ObservationClient();

// This example uses the deprecated V1 transects endpoint.
// It requires authentication.
//
// const accessToken = process.env.WAARNEMING_NL_ACCESS_TOKEN;
// if (!accessToken) {
//   throw new Error('WAARNEMING_NL_ACCESS_TOKEN is not set');
// }
// client.setAccessToken(accessToken);
//
// // Create a transect
// const newTransect = await client.transects.create({
//   uuid: 'a-unique-uuid-for-the-transect-1', // Replace with a real UUID
//   type: 'point',
//   observation_lists: [
//     {
//       species_group: 1, // Birds
//       all_species_counted: 1, // 0: unknown, 1: no, 2: yes
//       all_individuals_counted: 2, // 0: unknown, 1: no, 2: yes
//       notes: 'Test species group note for V1 transect',
//     },
//   ],
//   start_date: '2023-01-02',
//   start_time: '12:00',
//   end_date: '2023-01-02',
//   end_time: '13:00',
//   geom: {
//     type: 'Point',
//     coordinates: [5.48, 52.12],
//   },
//   notes: 'Test V1 transect note',
// });
// console.log('Created transect:', newTransect); 