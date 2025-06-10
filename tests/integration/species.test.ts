import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Observation, Species } from '../../src/types';

const API_BASE_URL = 'https://waarneming-test.nl/api/v1';

// A mock object for a Species (updated to match corrected API types)
const mockSpecies: Species = {
  id: 2,
  name: 'Dodaars',
  scientific_name: 'Tachybaptus ruficollis',
  group: 1,
  group_name: 'Vogels',
  status: '0', // Changed from number to string
  rarity: '1', // Changed from number to string
  rarity_text: 'algemeen', // Now optional but provided in this mock
  type: 'S',
  url: 'https://waarneming.nl/species/2/',
  photos: [],
  sounds: [],
  name_vernacular: null,
  name_vernacular_language: null,
};

const mockObservation = {
  id: 1,
  url: 'https://waarneming.nl/observation/1/',
  species: mockSpecies,
  species_guess: 'Tachybaptus ruficollis',
  user: {
    id: 1,
    name: 'Test User',
    url: 'https://waarneming.nl/user/1',
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
} as unknown as Observation;

// Restore all spies after each test
afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('species.get should make a public request when unauthenticated', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSpecies), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const species = await client.species.get(2);

  expect(species).toEqual(mockSpecies);
  const url = fetchSpy.mock.calls[0][0];
  const options = fetchSpy.mock.calls[0][1];
  expect(url).toBe(`${API_BASE_URL}/species/2`);
  const headers = new Headers(options?.headers);
  expect(headers.has('Authorization')).toBe(false);

  fetchSpy.mockRestore();
});

test('species.get should make an authenticated request when authenticated', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSpecies), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const species = await client.species.get(2);

  expect(species).toEqual(mockSpecies);
  const url = fetchSpy.mock.calls[0][0];
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  expect(url).toBe(`${API_BASE_URL}/species/2`);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('species.search should call the search endpoint with parameters', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockSpecies],
  };

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const params = { q: 'Dodaars', species_group: 1 };
  const species = await client.species.search(params);

  expect(species).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species/search/');
  expect(url.searchParams.get('q')).toBe('Dodaars');
  expect(url.searchParams.get('species_group')).toBe('1');

  fetchSpy.mockRestore();
});

test('species.getObservations should fetch observations for a species', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockObservation],
  };

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const observations = await client.species.getObservations(2, { limit: 10 });

  expect(observations).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species/2/observations/');
  expect(url.searchParams.get('limit')).toBe('10');

  fetchSpy.mockRestore();
});

test('species.getOccurrence should fetch occurrence data', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [{ 
      id: 2, 
      name: 'Dodaars',
      scientific_name: 'Tachybaptus ruficollis',
      occurrence_status: 'common'
    }], // Proper SpeciesOccurrence mock
  };

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const point = 'POINT(4.895168 52.370216)';
  const occurrences = await client.species.getOccurrence([2], point);

  expect(occurrences).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species-occurrence');
  expect(url.searchParams.get('species_id')).toBe('2');
  expect(url.searchParams.get('point')).toBe(point);

  fetchSpy.mockRestore();
});

test('species.listGroups should fetch a list of species groups', async () => {
  const mockResponse = [
    { id: 1, name: 'Vogels', name_plural: 'Vogels', icon: 'bird' },
  ];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const groups = await client.species.listGroups();

  expect(groups).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species-groups/');

  fetchSpy.mockRestore();
});

test('species.getGroupAttributes should fetch attributes for a species group', async () => {
  const mockResponse = {
    id: 1,
    attributes: [{ id: 1, name: 'sex' }],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const attributes = await client.species.getGroupAttributes(1);

  expect(attributes).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species-groups/1/attributes/');

  fetchSpy.mockRestore();
});
