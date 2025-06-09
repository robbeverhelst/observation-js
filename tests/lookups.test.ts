import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Lookups } from '../src/types';

const mockLookups: Lookups = {
  validation_status: [
    { id: '1', name: 'Approved', is_active: true },
    { id: '2', name: 'Needs review', is_active: true },
  ],
  rarity: [
    { id: 1, name: 'Common', is_active: true },
    { id: 2, name: 'Rare', is_active: true },
  ],
  counting_method: [
    { id: 1, name: 'Exact', is_active: true, is_default: true },
    { id: 2, name: 'Estimate', is_active: true },
  ],
  obscurity: [
    { id: 1, name: 'None', is_active: true },
    { id: 2, name: 'Obscured', is_active: true },
  ],
  species_type: [
    { id: '1', name: 'Bird', is_active: true },
    { id: '2', name: 'Mammal', is_active: true },
  ],
  species_status: [
    { id: 1, name: 'Native', is_active: true },
    { id: 2, name: 'Introduced', is_active: true },
  ],
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('lookups.get should fetch lookup tables', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockLookups), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const lookups = await client.lookups.get();

  expect(lookups).toEqual(mockLookups);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/lookups/');

  fetchSpy.mockRestore();
});
