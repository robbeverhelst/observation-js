import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { NiaResponse } from '../../src/types';

const mockNiaResponse: NiaResponse = {
  model_version: '1.0',
  model_coverage: {
    description: 'test coverage',
  },
  location_detail: null,
  predictions: [
    {
      probability: 0.9,
      taxon: {
        id: 1,
        name: 'Test Species',
        vernacular_name: 'Test Species',
        group_name: 'Birds',
        group_id: 1,
        url: 'https://example.com/species/1',
      },
    },
  ],
  species: [
    {
      name: 'Test Species',
      scientific_name: 'Species testus',
      group: 'Birds',
    },
  ],
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('nia.identify should make a public request without token', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockNiaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const blob = new Blob(['test-image']);
  const response = await client.nia.identify({ images: [blob] });

  expect(response).toEqual(mockNiaResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/identify-proxy/v1/');
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('POST');
  expect(fetchSpy.mock.calls[0][1]?.headers).not.toHaveProperty(
    'Authorization',
  );

  fetchSpy.mockRestore();
});

test('nia.identify should make an authenticated request with token', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockNiaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const blob = new Blob(['test-image']);
  const response = await client.nia.identify({ images: [blob] });

  expect(response).toEqual(mockNiaResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/identify-proxy/v1/');
  const fetchOptions = fetchSpy.mock.calls[0][1] as RequestInit;
  const headers = new Headers(fetchOptions.headers);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('nia.identify should send location data', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockNiaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const blob = new Blob(['test-image']);
  await client.nia.identify({
    images: [blob],
    location: { lat: 1.23, lng: 4.56 },
  });

  const body = fetchSpy.mock.calls[0][1]?.body as FormData;
  expect(body.get('location_coordinates')).toBe('1.23,4.56');

  fetchSpy.mockRestore();
});
