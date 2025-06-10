import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Location } from '../../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockLocation: Location = {
  id: 1,
  name: 'Test Location',
  country_code: 'NL',
  permalink: 'https://waarneming.nl/location/1',
  geometry: {
    type: 'MultiPolygon',
    coordinates: [],
  },
  has_geometry: true,
  cover_photo: null,
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('locations.search by name should search for locations', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockLocation],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const locations = await client.locations.search({ name: 'Test' });

  expect(locations).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/');
  expect(url.searchParams.get('name')).toBe('Test');

  fetchSpy.mockRestore();
});

test('locations.search by coordinates should search for locations', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockLocation],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const locations = await client.locations.search({ lat: 52.123, lng: 5.123 });

  expect(locations).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/');
  expect(url.searchParams.get('lat')).toBe('52.123');
  expect(url.searchParams.get('lng')).toBe('5.123');

  fetchSpy.mockRestore();
});

test('locations.get should fetch a single location', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockLocation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const location = await client.locations.get(1);

  expect(location).toEqual(mockLocation);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/1');

  fetchSpy.mockRestore();
});

test('locations.getSpeciesSeen should fetch species seen at a location', async () => {
  const mockResponse = {
    results: [
      {
        species: 1,
        species_name: 'Test Species',
        last_observation_date: '2023-01-01',
        observation_count: 1,
      },
    ],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const speciesSeen = await client.locations.getSpeciesSeen(1, { days: 30 });

  expect(speciesSeen).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/1/species-seen/');
  expect(url.searchParams.get('days')).toBe('30');

  fetchSpy.mockRestore();
});

test('locations.getSpeciesSeenAroundPoint should fetch species seen around a point', async () => {
  const mockResponse = {
    results: [
      {
        species: 1,
        species_name: 'Test Species',
        last_observation_date: '2023-01-01',
        observation_count: 1,
      },
    ],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const speciesSeen = await client.locations.getSpeciesSeenAroundPoint({
    lat: 52.123,
    lng: 5.123,
    radius: 1000,
  });

  expect(speciesSeen).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/species-seen/');
  expect(url.searchParams.get('lat')).toBe('52.123');
  expect(url.searchParams.get('lng')).toBe('5.123');
  expect(url.searchParams.get('radius')).toBe('1000');

  fetchSpy.mockRestore();
});

test('locations.getGeoJSON with point should fetch GeoJSON data', async () => {
  const mockResponse = {
    type: 'FeatureCollection' as const,
    features: [],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const geojson = await client.locations.getGeoJSON({
    point: 'POINT(5.123 52.123)',
  });

  expect(geojson).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/geojson/');
  expect(url.searchParams.get('point')).toBe('POINT(5.123 52.123)');

  fetchSpy.mockRestore();
});

test('locations.getGeoJSON with id should fetch GeoJSON data', async () => {
  const mockResponse = {
    type: 'FeatureCollection' as const,
    features: [],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const geojson = await client.locations.getGeoJSON({ id: 1 });

  expect(geojson).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/locations/geojson/');
  expect(url.searchParams.get('id')).toBe('1');

  fetchSpy.mockRestore();
});
