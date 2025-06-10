import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Challenge, ChallengeRanking } from '../../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockChallenge: Challenge = {
  id: 1,
  type: 'regular',
  title: 'Test Challenge',
  header: 'Test Challenge Header',
  start_date_time: '2023-01-01T00:00:00Z',
  end_date_time: '2023-01-31T23:59:59Z',
  cover_image: 'https://example.com/cover.jpg',
  cover_thumbnail: null,
  instructions: null,
  results: [],
  observation_count: 0,
  species_count: 0,
  challenge_user: null,
  targets: [],
  group: null,
};

const mockChallengeRanking: ChallengeRanking = {
  user: {
    id: 1,
    name: 'Test User',
    avatar: null,
  },
  observation_count: 10,
  species_count: 5,
  rank: 1,
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('challenges.list should fetch public challenges when unauthenticated', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockChallenge],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const challenges = await client.challenges.list();

  expect(challenges).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.headers).not.toHaveProperty('Authorization');

  fetchSpy.mockRestore();
});

test('challenges.list should fetch user challenges when authenticated', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockChallenge],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const challenges = await client.challenges.list();

  expect(challenges).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/');
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('challenges.get should fetch a public challenge when unauthenticated', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockChallenge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const challenge = await client.challenges.get(1);

  expect(challenge).toEqual(mockChallenge);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/1');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.headers).not.toHaveProperty('Authorization');

  fetchSpy.mockRestore();
});

test('challenges.get should fetch a user challenge when authenticated', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockChallenge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const challenge = await client.challenges.get(1);

  expect(challenge).toEqual(mockChallenge);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/1');
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('challenges.getRanking should fetch the ranking for a challenge', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockChallengeRanking), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const ranking = await client.challenges.getRanking(1, 'species');

  expect(ranking).toEqual(mockChallengeRanking);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/1/ranking/species');

  fetchSpy.mockRestore();
});

test('challenges.getForObservation should fetch challenge IDs for an observation', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [{ id: 1 }],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const challengeIds = await client.challenges.getForObservation(123);

  expect(challengeIds).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/observation/123');

  fetchSpy.mockRestore();
});

test('challenges.subscribe should subscribe to a challenge', async () => {
  const mockResponse = { is_subscribed: true };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.challenges.subscribe(1, true);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/1/subscribe');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('challenges.markContentAsSeen should mark challenge content as seen', async () => {
  const mockResponse = { message: 'Content marked as seen' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.challenges.markContentAsSeen(1);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/challenges/content/1/seen');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});
