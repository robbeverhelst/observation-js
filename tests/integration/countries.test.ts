import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Country } from '../../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockCountry: Country = {
  name: 'Netherlands',
  code: 'NL',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('countries.list should fetch a list of countries', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockCountry],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const countries = await client.countries.list();

  expect(countries).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/countries/');

  fetchSpy.mockRestore();
});
