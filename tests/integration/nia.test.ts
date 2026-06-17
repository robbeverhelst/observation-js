import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { NiaResponse } from '../../src/types';

const mockNiaResponse: NiaResponse = {
  model_coverage: {
    image: 'https://waarneming.nl/static/img/nia/nia_coverage_europe.png',
    description: 'The image recognition covers Europe.',
  },
  predictions: [
    {
      probability: 0.4997982978820801,
      taxon: {
        id: '8807@WRN',
        name: 'Vespa velutina',
      },
      morphs: [
        { probability: 0.9997995273100387, token: 'IMAGO' },
        { probability: 0.0001763264330502273, token: 'LARVA_NYMPH' },
        { probability: 0.00002399478342920305, token: 'OTHER' },
      ],
    },
  ],
  location: 'Noordzee - t.h.v. Zuid-Holland',
  location_detail: {
    id: 8352,
    name: 'Noordzee - t.h.v. Zuid-Holland',
    country_code: 'NL',
    permalink: 'https://waarneming.nl/locations/8352/',
  },
  species: [
    {
      id: 1703,
      scientific_name: 'Volucella zonaria',
      name: 'Stadsreus',
      group: 18,
      type: 'S',
      rarity: 1,
      status: 4,
    },
  ],
  life_stages: [
    { species_id: 700, id: 29, text: 'Imago', is_active: true, is_default: true },
    { species_id: 210097, id: 1028, text: 'Imago', is_active: true },
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
  expect(body.get('coordinates')).toBe('1.23,4.56');

  fetchSpy.mockRestore();
});
