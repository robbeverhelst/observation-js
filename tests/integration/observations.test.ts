import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Observation } from '../../src/types';

const mockObservation: Observation = {
  id: 1,
  species: 2,
  date: '2023-01-01',
  time: '12:00',
  number: 1,
  sex: 'U',
  point: {
    type: 'Point',
    coordinates: [5.123, 52.123],
  },
  accuracy: 25,
  notes: null,
  is_certain: true,
  validation_status: 'O',
  external_reference: null,
  embargo_date: '1980-01-01',
  uuid: '1daae4e8-0c9c-44ef-ba2f-b5c8f0827867',
  user: 53673,
  modified: '2023-01-01T12:00:00.000000',
  species_group: 1,
  location: 26042,
  photos: ['https://waarneming.nl/media/photo/330.jpg'],
  sounds: [],
  permalink: 'https://waarneming.nl/observation/1/',
  species_detail: {
    id: 2,
    scientific_name: 'Tachybaptus ruficollis',
    name: 'Little Grebe',
    group: 1,
    type: 'S',
  },
  user_detail: {
    id: 53673,
    name: 'Test User',
    avatar: '/media/user/784.jpg',
  },
  location_detail: {
    id: 26042,
    name: 'Test Location',
    country_code: 'NL',
    permalink: 'https://waarneming.nl/locations/26042/',
  },
};

const mockPaginated = {
  count: 1,
  next: null,
  previous: null,
  results: [mockObservation],
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('observations.get should fetch a single observation', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const observation = await client.observations.get(1);

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/observations/1/');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('observations.create should create a new observation without media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = {
    date: '2023-01-01',
    species: 2,
    point: { type: 'Point' as const, coordinates: [4, 52] as [number, number] },
  };
  const observation = await client.observations.create(payload);

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = JSON.parse(options?.body as string);

  expect(url.pathname).toBe('/api/v1/observations/create-single/');
  expect(body.species).toBe(2);

  fetchSpy.mockRestore();
});

test('observations.create should create a new observation with media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = {
    date: '2023-01-01',
    species: 2,
    point: { type: 'Point' as const, coordinates: [4, 52] as [number, number] },
  };
  const photoBlob = new Blob(['fake-photo-data'], { type: 'image/jpeg' });
  const observation = await client.observations.create(payload, {
    upload_photos: [photoBlob],
  });

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = options?.body as FormData;

  expect(url.pathname).toBe('/api/v1/observations/create-single/');
  expect(body.get('observation')).toBe(JSON.stringify(payload));
  expect(body.get('upload_photos')).not.toBeNull();

  fetchSpy.mockRestore();
});

test('observations.sync should bulk create observations', async () => {
  const mockResults = [
    'https://waarneming.nl/observation/79201845/',
    { point: ['Field point cannot be matched to a location'] },
  ];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResults), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const observations = [
    {
      species: 1783,
      date: '2018-09-11',
      point: 'POINT(4 52)',
      external_id: 'meetnetten.be-32348',
    },
    {
      species: 150,
      date: '2018-09-12',
      point: { type: 'Point' as const, coordinates: [4, 52] as [number, number] },
    },
  ];
  const results = await client.observations.sync(observations);

  expect(results).toEqual(mockResults);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = JSON.parse(options?.body as string);

  expect(url.pathname).toBe('/api/v1/observations/create/');
  expect(options?.method).toBe('POST');
  expect(Array.isArray(body)).toBe(true);
  expect(body[0].external_id).toBe('meetnetten.be-32348');

  fetchSpy.mockRestore();
});

test('observations.update should update an observation without media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = { notes: 'Updated notes' };
  const observation = await client.observations.update(1, payload);

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = JSON.parse(options?.body as string);

  expect(url.pathname).toBe('/api/v1/observations/1/update/');
  expect(body.notes).toBe('Updated notes');

  fetchSpy.mockRestore();
});

test('observations.update should update an observation with media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = { notes: 'Updated notes' };
  const photoBlob = new Blob(['fake-photo-data'], { type: 'image/jpeg' });
  const observation = await client.observations.update(1, payload, {
    upload_photos: [photoBlob],
  });

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = options?.body as FormData;

  expect(url.pathname).toBe('/api/v1/observations/1/update/');
  expect(body.get('observation')).toBe(JSON.stringify(payload));
  expect(body.get('upload_photos')).not.toBeNull();

  fetchSpy.mockRestore();
});

test('observations.delete should delete an observation', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  await client.observations.delete(1);

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];

  expect(url.pathname).toBe('/api/v1/observations/1/delete/');
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('observations.search should list observations with filters', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockPaginated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const result = await client.observations.search({
    species_group: 1,
    date_after: '2025-02-15',
    date_before: '2025-02-15',
    modified_since: '2025-02-01',
  });

  expect(result).toEqual(mockPaginated);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);

  expect(url.pathname).toBe('/api/v1/observations/');
  expect(url.searchParams.get('species_group')).toBe('1');
  expect(url.searchParams.get('date_after')).toBe('2025-02-15');
  expect(url.searchParams.get('date_before')).toBe('2025-02-15');
  expect(url.searchParams.get('modified_since')).toBe('2025-02-01');

  fetchSpy.mockRestore();
});

test('observations.getBySpecies should fetch observations for a species', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockPaginated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const result = await client.observations.getBySpecies(32, {
    modified_since: '2019-03-01 11:11:00',
  });

  expect(result).toEqual(mockPaginated);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);

  expect(url.pathname).toBe('/api/v1/species/32/observations/');
  expect(url.searchParams.get('modified_since')).toBe('2019-03-01 11:11:00');

  fetchSpy.mockRestore();
});

test('observations.getByUser should fetch observations for the current user', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockPaginated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const result = await client.observations.getByUser();

  expect(result).toEqual(mockPaginated);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);

  expect(url.pathname).toBe('/api/v1/user/observations/');

  fetchSpy.mockRestore();
});

test('observations.getByLocation should fetch observations for a location', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockPaginated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const result = await client.observations.getByLocation(2817);

  expect(result).toEqual(mockPaginated);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);

  expect(url.pathname).toBe('/api/v1/locations/2817/observations/');

  fetchSpy.mockRestore();
});

test('observations.getAroundPoint should fetch observations around a point', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockPaginated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const result = await client.observations.getAroundPoint({
    coordinates: '52,6',
    days: 1,
    radius: 5000,
    end_date: '2020-01-01',
  });

  expect(result).toEqual(mockPaginated);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);

  expect(url.pathname).toBe('/api/v1/observations/around-point/');
  expect(url.searchParams.get('coordinates')).toBe('52,6');
  expect(url.searchParams.get('days')).toBe('1');
  expect(url.searchParams.get('radius')).toBe('5000');
  expect(url.searchParams.get('end_date')).toBe('2020-01-01');

  fetchSpy.mockRestore();
});

test('observations.getDeleted should list deleted observations', async () => {
  const mockDeleted = {
    count: 2,
    next: null,
    previous: null,
    results: [
      { original_id: 337900593, deleted_at: '2025-02-01T00:00:57.362455' },
      { original_id: 68855514, deleted_at: '2025-02-01T09:41:00.970040' },
    ],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockDeleted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const result = await client.observations.getDeleted('2025-02-01 00:00:00');

  expect(result).toEqual(mockDeleted);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);

  expect(url.pathname).toBe('/api/v1/observations/deleted/');
  expect(url.searchParams.get('modified_since')).toBe('2025-02-01 00:00:00');

  fetchSpy.mockRestore();
});
