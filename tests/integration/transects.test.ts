import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import { Transects } from '../../src/lib/transects';
import type { Transect, TransectPayload } from '../../src/types/transects';

const mockTransect: Transect = {
  id: 177929,
  uuid: '5e61500c-a76e-4ebe-8c24-d8a453ab120c',
  type: 'point',
  observation_lists: [
    {
      id: 365349,
      species_group: 1,
      all_species_counted: 1,
      all_individuals_counted: 2,
      notes: 'This is a species group note',
      project: null,
    },
  ],
  observation_count: 4,
  location_detail: {
    id: 16066,
    name: 'Zoeterwoude - Groote Westeindsche Polder',
    country_code: 'NL',
    permalink: 'https://waarneming.nl/locations/16066/',
  },
  start_date: '2022-01-01',
  start_time: '12:00',
  end_date: '2022-01-01',
  end_time: '15:00',
  geom: { type: 'Point', coordinates: [4.48, 52.12] },
  notes: 'This is a transect note',
  permalink: 'https://waarneming.nl/sessions/177929/',
};

const payload: TransectPayload = {
  uuid: '5e61500c-a76e-4ebe-8c24-d8a453ab120b',
  type: 'point',
  observation_lists: [
    {
      species_group: 1,
      all_species_counted: 1,
      all_individuals_counted: 2,
      notes: 'This is a species group note',
    },
  ],
  start_date: '2022-01-01',
  start_time: '12:00',
  end_date: '2022-01-01',
  end_time: '15:00',
  geom: { type: 'Point', coordinates: [4.48, 52.12] },
  notes: 'This is a transect note',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('transects.create should POST a new transect', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockTransect), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const transects = new Transects(client);
  const result = await transects.create(payload);

  expect(result).toEqual(mockTransect);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/transects/create-or-update/');
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(init.method).toBe('POST');
  expect(init.body).toBe(JSON.stringify(payload));

  fetchSpy.mockRestore();
});

test('transects.update should PUT a transect', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockTransect), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const transects = new Transects(client);
  const result = await transects.update(payload);

  expect(result).toEqual(mockTransect);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/transects/create-or-update/');
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(init.method).toBe('PUT');
  expect(init.body).toBe(JSON.stringify(payload));

  fetchSpy.mockRestore();
});

test('transects.create should accept a WKT geom string', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockTransect), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const transects = new Transects(client);
  const wktPayload: TransectPayload = {
    ...payload,
    geom: 'POINT (4.48 52.12)',
  };
  await transects.create(wktPayload);

  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(init.body).toBe(JSON.stringify(wktPayload));

  fetchSpy.mockRestore();
});
