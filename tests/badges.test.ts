import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Badge } from '../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockBadge: Badge = {
  id: 1,
  name: 'Test Badge',
  type: 'regular',
  silhouette: 'https://example.com/silhouette.png',
  background_color: '#FFFFFF',
  species_groups: [1],
  user_regular_badge: null,
  next_level: null,
  onboarding_levels: null,
  user_season_badges: null,
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('badges.list should fetch public badges when unauthenticated', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockBadge],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const badges = await client.badges.list();

  expect(badges).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.headers).not.toHaveProperty('Authorization');

  fetchSpy.mockRestore();
});

test('badges.list should fetch user badges when authenticated', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockBadge],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const badges = await client.badges.list();

  expect(badges).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/');
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('badges.get should fetch a public badge when unauthenticated', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockBadge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const badge = await client.badges.get(1);

  expect(badge).toEqual(mockBadge);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/1');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.headers).not.toHaveProperty('Authorization');

  fetchSpy.mockRestore();
});

test('badges.get should fetch a user badge when authenticated', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockBadge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const badge = await client.badges.get(1);

  expect(badge).toEqual(mockBadge);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/1');
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('badges.getForObservation should fetch badge IDs for an observation', async () => {
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
  const badgeIds = await client.badges.getForObservation(123);

  expect(badgeIds).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/observation/123/');

  fetchSpy.mockRestore();
});

test('badges.markAllAsSeen should mark all badges as seen', async () => {
  const mockResponse = { last_seen: '2023-01-01T12:00:00Z' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.badges.markAllAsSeen();

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/user-badge/seen/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('badges.getLastSeen should get the last seen timestamp for a badge', async () => {
  const mockResponse = { last_seen: '2023-01-01T12:00:00Z' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.badges.getLastSeen(1);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/user-badge/1/seen/');

  fetchSpy.mockRestore();
});

test('badges.markAsSeen should mark a badge as seen', async () => {
  const mockResponse = { last_seen: '2023-01-01T12:00:00Z' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.badges.markAsSeen(1);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/user-badge/1/seen/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('badges.getSeasonLastSeen should get the last seen timestamp for a season badge', async () => {
  const mockResponse = { last_seen: '2023-01-01T12:00:00Z' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.badges.getSeasonLastSeen(1);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/user-season-badge/1/seen/');

  fetchSpy.mockRestore();
});

test('badges.markSeasonAsSeen should mark a season badge as seen', async () => {
  const mockResponse = { last_seen: '2023-01-01T12:00:00Z' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.badges.markSeasonAsSeen(1);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/badges/user-season-badge/1/seen/');
  const options = fetchSpy.mock.calls[0][1];
  expect(options?.method).toBe('POST');

  fetchSpy.mockRestore();
});
