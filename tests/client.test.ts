import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Species } from '../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

// A mock object for a Species
const mockSpecies: Species = {
  id: 2,
  name: 'Dodaars',
  scientific_name: 'Tachybaptus ruficollis',
  authority: '(Pallas, 1764)',
  group: 1,
  group_name: 'Vogels',
  status: 'inheems',
  rarity: 'algemeen',
  type: 'S',
  photo: 'https://waarneming.nl/media/photo/123.jpg',
  permalink: 'https://waarneming.nl/species/2/',
};

// Restore all spies after each test
afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('species.get should fetch a single species', async () => {
  // Spy on the global fetch function
  // @ts-expect-error - We are intentionally mocking fetch with a simplified implementation.
  const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
    const urlStr = url.toString();
    // Check for the base path, ignoring query params for this test
    if (urlStr.startsWith(`${API_BASE_URL}/species/2`)) {
      return new Response(JSON.stringify(mockSpecies), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not Found', { status: 404 });
  });

  // Create a client and make the call
  const client = new ObservationClient();
  const species = await client.species.get(2);

  // Assertions
  expect(species).toBeDefined();
  expect(species.id).toBe(2);
  expect(species.name).toBe('Dodaars');

  // Verify that fetch was called correctly
  expect(fetchSpy).toHaveBeenCalled();
  expect(fetchSpy.mock.calls[0][0]).toStartWith(`${API_BASE_URL}/species/2`);
  expect(fetchSpy).toHaveBeenCalledTimes(1);
}); 