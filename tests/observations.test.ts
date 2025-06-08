import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Observation, Species } from '../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockSpecies: Species = {
  id: 2,
  name: 'Dodaars',
  scientific_name: 'Tachybaptus ruficollis',
  group: 1,
  group_name: 'Vogels',
  status: 0,
  rarity: 1,
  rarity_text: 'algemeen',
  type: 'S',
  url: 'https://waarneming.nl/species/2/',
  photos: [],
  sounds: [],
  name_vernacular: null,
  name_vernacular_language: null,
};

const mockObservation: Observation = {
  id: 1,
  url: 'https://waarneming.nl/observation/1/',
  species: mockSpecies,
  species_guess: 'Tachybaptus ruficollis',
  user: {
    id: 1,
    name: 'Test User',
    avatar: null,
  },
  location: {
    id: 1,
    name: 'Test Location',
    country_code: 'NL',
    permalink: 'https://waarneming.nl/location/1',
  },
  point: {
    type: 'Point' as const,
    coordinates: [5.123, 52.123],
  },
  date: '2023-01-01',
  time: '12:00:00',
  count: 1,
  count_text: '1 individual',
  photos: [],
  sounds: [],
  comments_count: 0,
  likes_count: 0,
  validation_status: 'approved',
  is_validated: true,
  model_prediction: 'approved',
  obscured_by_user: false,
  created_at: '2023-01-01T12:00:00Z',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('observations.get should fetch a single observation', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const observation = await client.observations.get(1);

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/observations/1');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('observations.create should create a new observation without media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = {
    date: '2023-01-01',
    species_id: 2,
  };
  const observation = await client.observations.create(payload);

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = options?.body as any;

  expect(url.pathname).toBe('/api/v1/observations/create-single/');
  expect(body.species_id).toBe(2);

  fetchSpy.mockRestore();
});

test('observations.create should create a new observation with media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = {
    date: '2023-01-01',
    species_id: 2,
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

test('observations.update should update an observation without media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const payload = { notes: 'Updated notes' };
  const observation = await client.observations.update(1, payload);

  expect(observation).toEqual(mockObservation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = options?.body as any;

  expect(url.pathname).toBe('/api/v1/observations/1/update/');
  expect(body.notes).toBe('Updated notes');

  fetchSpy.mockRestore();
});

test('observations.update should update an observation with media', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockObservation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
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
    new Response(null, { status: 204 })
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