import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import { BioBlitzes } from '../../src/lib/bioblitzes';
import type {
  BioBlitz,
  BioBlitzCategoryStatistics,
} from '../../src/types/bioblitzes';

const mockBioBlitz: BioBlitz = {
  id: 16284,
  name: 'Soortenjaar 2025x2 Steenwijkerland',
  description: '<p>...</p>',
  start_date: '2025-01-01',
  end_date: '2025-12-31',
  target: 4050,
  statistics: {
    species: 2082,
    observations: 28610,
    observers: 1215,
    updated: '2025-02-01T06:56:57+02:00',
  },
  user: {
    liked: true,
    statistics: { species: 7, observations: 8 },
  },
  category: null,
  cover_image: 'https://waarneming.nl/bioblitz/16284/cover.jpg',
  cover_thumbnail: 'https://waarneming.nl/bioblitz/16284/cover-thumb.jpg',
  location_image: 'https://waarneming.nl/bioblitz/16284/location-image.png',
  permalink:
    'https://waarneming.nl/bioblitz/16284/soortenjaar-2025x2-steenwijkerland/',
};

const mockCategoryStatistics: BioBlitzCategoryStatistics = {
  bioblitzes: 24,
  observations: 1544899,
  species: 12450,
  observers: 11929,
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('bioblitzes.list should fetch a paginated list (public)', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockBioBlitz],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const bioblitzes = new BioBlitzes(client);
  const result = await bioblitzes.list();

  expect(result).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/');
  // No Authorization header for a public, unauthenticated request.
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(new Headers(init.headers).has('Authorization')).toBe(false);

  fetchSpy.mockRestore();
});

test('bioblitzes.list should pass the coordinates parameter', async () => {
  const mockResponse = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const bioblitzes = new BioBlitzes(client);
  await bioblitzes.list({ coordinates: '52.7869,6.1181' });

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/');
  expect(url.searchParams.get('coordinates')).toBe('52.7869,6.1181');

  fetchSpy.mockRestore();
});

test('bioblitzes.getForObservation should fetch BioBlitzes for an observation (auth)', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockBioBlitz],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const bioblitzes = new BioBlitzes(client);
  const result = await bioblitzes.getForObservation(304712758);

  expect(result).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/observation/304712758/');
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(new Headers(init.headers).get('Authorization')).toBe(
    'Bearer test-token',
  );

  fetchSpy.mockRestore();
});

test('bioblitzes.get should fetch a single BioBlitz (public)', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockBioBlitz), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const bioblitzes = new BioBlitzes(client);
  const result = await bioblitzes.get(16284);

  expect(result).toEqual(mockBioBlitz);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/16284/');

  fetchSpy.mockRestore();
});

test('bioblitzes.like should POST to the like endpoint (204)', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const bioblitzes = new BioBlitzes(client);
  await bioblitzes.like(16336);

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/16336/like/');
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(init.method).toBe('POST');
  expect(new Headers(init.headers).get('Authorization')).toBe(
    'Bearer test-token',
  );

  fetchSpy.mockRestore();
});

test('bioblitzes.unlike should DELETE the like endpoint (204)', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, { status: 204 }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const bioblitzes = new BioBlitzes(client);
  await bioblitzes.unlike(16336);

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/16336/like/');
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  expect(init.method).toBe('DELETE');

  fetchSpy.mockRestore();
});

test('bioblitzes.getCategoryStatistics should fetch category stats (public)', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockCategoryStatistics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const bioblitzes = new BioBlitzes(client);
  const result = await bioblitzes.getCategoryStatistics(1);

  expect(result).toEqual(mockCategoryStatistics);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/bioblitzes/category/1/statistics/');

  fetchSpy.mockRestore();
});
