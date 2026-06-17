import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Observation, SpeciesData } from '../../src/types';

const API_BASE_URL = 'https://waarneming-test.nl/api/v1';

// A mock object for a Species, matching the real API shape.
const mockSpecies: SpeciesData = {
  id: 2,
  scientific_name: 'Tachybaptus ruficollis',
  authority: '(Pallas, 1764)',
  name: 'Dodaars',
  group: 1,
  group_name: 'Vogels',
  status: 'native',
  rarity: 'relatively common',
  type: 'S',
  photo: 'https://waarneming.nl/media/photo/000/074/74531.jpg',
  permalink: 'https://waarneming.nl/species/2/',
  info_text: '<p>The Little Grebe is a small species within its family.</p>',
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
    results: [
      { species_id: 1, occurs: 'yes' },
      { species_id: 2, occurs: 'unknown' },
    ],
  };

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const coordinates = '52.3,4.2';
  const occurrences = await client.species.getOccurrence([1, 2], coordinates);

  expect(occurrences).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species-occurrence/');
  expect(url.searchParams.get('coordinates')).toBe(coordinates);
  // `species_id` is repeated once per id (?species_id=1&species_id=2).
  expect(url.searchParams.getAll('species_id')).toEqual(['1', '2']);

  fetchSpy.mockRestore();
});

test('species.getInformation should fetch species information blocks', async () => {
  const mockResponse = [
    {
      title: 'Beschrijving',
      content: [
        { type: 'html', collapsed: true, body: '<p>Example.</p>' },
      ],
    },
  ];

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const info = await client.species.getInformation(710, '52.16489,4.4737');

  expect(info).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species/710/information/');
  expect(url.searchParams.get('coordinates')).toBe('52.16489,4.4737');

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

test('species.getAllGroupAttributes should fetch attributes for all species groups', async () => {
  const mockResponse = {
    id: 1,
    name: 'Vogels',
    activity: [
      { id: 1, text: 'present', is_active: true, is_default: true, bmp: true },
      { id: 3, text: 'calling', is_active: true },
    ],
    method: [{ id: 47, text: 'unknown', is_active: true, is_default: true }],
    life_stage: [{ id: 1, text: 'unknown', is_active: true, is_default: true }],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const attributes = await client.species.getAllGroupAttributes();

  expect(attributes).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species-groups/attributes/');

  fetchSpy.mockRestore();
});

test('species.getGroupAttributes should fetch attributes for a species group', async () => {
  const mockResponse = {
    id: 11,
    name: 'Fungi',
    activity: [
      { id: 59, text: 'present', is_active: true, is_default: true },
    ],
    method: [{ id: 347, text: 'unknown', is_active: true, is_default: true }],
    life_stage: [{ id: 60, text: 'unknown', is_active: true, is_default: true }],
    substrate: [{ id: 283, text: 'unknown', is_active: true, is_default: true }],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const attributes = await client.species.getGroupAttributes(11);

  expect(attributes).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/species-groups/11/attributes/');

  fetchSpy.mockRestore();
});
