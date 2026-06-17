import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type {
  Session,
  CreateSessionPayload,
  UpdateSessionPayload,
  Observation,
  Paginated,
  UserDetail,
  Species,
} from '../../src/types';

const mockUser: UserDetail = {
  id: 1,
  name: 'Test User',
  avatar: null,
};

const mockSession: Session = {
  id: 177929,
  uuid: 'test-uuid',
  type: 'point',
  observation_lists: [
    {
      id: 365349,
      species_group: 1,
      all_species_counted: false,
      all_individuals_counted: true,
      notes: 'This is a species group note',
    },
  ],
  observation_count: 5,
  location_detail: {
    id: 16066,
    name: 'Zoeterwoude - Groote Westeindsche Polder',
    country_code: 'NL',
    permalink: 'https://waarneming.nl/locations/16066/',
  },
  start_datetime: '2022-01-01T12:00:12',
  end_datetime: '2022-01-01T15:00:34',
  geom: { type: 'Point', coordinates: [4.48, 52.12] },
  notes: 'This is a session note',
  permalink: 'https://waarneming.nl/sessions/177929/',
};

const mockCreatePayload: CreateSessionPayload = {
  uuid: 'new-uuid',
  type: 'point',
  observation_lists: [
    {
      species_group: 1,
      all_species_counted: false,
      all_individuals_counted: true,
      notes: 'This is a species group note',
    },
  ],
  start_datetime: '2022-01-01T12:00:34',
  end_datetime: '2022-01-01T15:00:45',
  geom: { type: 'Point', coordinates: [4.48, 52.12] },
  notes: 'This is a session note',
};

const mockUpdatePayload: UpdateSessionPayload = {
  ...mockCreatePayload,
  uuid: 'test-uuid',
  notes: 'Updated session note',
};

const mockSpecies: Species = {
  id: 1,
  name: 'Test Species',
  scientific_name: 'Species testus',
  group: 1,
  group_name: 'Birds',
  rarity: 1,
  rarity_text: 'Common',
  type: 'bird',
  status: 1,
  url: 'https://example.com/species/1',
  photos: [],
  sounds: [],
  name_vernacular: null,
  name_vernacular_language: null,
};

const mockObservation: Observation = {
  id: 1,
  url: 'http://example.com/obs/1',
  species: mockSpecies,
  species_guess: 'Test Species',
  user: mockUser,
  location: null,
  point: { type: 'Point', coordinates: [0, 0] },
  date: '2023-01-01',
  time: '12:00:00',
  count: 1,
  count_text: '1',
  photos: [],
  sounds: [],
  comments_count: 0,
  likes_count: 0,
  validation_status: 'approved',
  is_validated: true,
  model_prediction: '',
  obscured_by_user: false,
  created_at: '2023-01-01T12:00:00Z',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('sessions.list should fetch a list of sessions', async () => {
  const mockResponse: Paginated<Session> = {
    count: 1,
    next: null,
    previous: null,
    results: [mockSession],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse)),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const sessions = await client.sessions.list();

  expect(sessions).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v2/user/sessions/');
});

test('sessions.get should fetch a single session', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSession)),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const session = await client.sessions.get('test-uuid');

  expect(session).toEqual(mockSession);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v2/user/sessions/test-uuid/');
});

test('sessions.create should create a new session', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSession)),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const session = await client.sessions.create(mockCreatePayload);

  expect(session).toEqual(mockSession);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v2/sessions/');
  expect(fetchSpy.mock.calls[0][1]?.body).toBe(
    JSON.stringify(mockCreatePayload),
  );
});

test('sessions.update should update a session', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSession)),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const session = await client.sessions.update(mockUpdatePayload);

  expect(session).toEqual(mockSession);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v2/sessions/');
  expect(fetchSpy.mock.calls[0][1]?.body).toBe(
    JSON.stringify(mockUpdatePayload),
  );
});

test('sessions.listObservations should fetch observations for a session', async () => {
  const mockResponse: Paginated<Observation> = {
    count: 1,
    next: null,
    previous: null,
    results: [mockObservation],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse)),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const observations = await client.sessions.listObservations('test-uuid');

  expect(observations).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v2/user/sessions/test-uuid/observations/');
});
