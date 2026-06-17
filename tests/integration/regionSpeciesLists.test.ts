import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { RegionSpecies, RegionSpeciesList } from '../../src/types';

const mockRegionSpeciesList: RegionSpeciesList = {
  id: 217,
  region: 2,
  species_group: 2,
  custom_name: 'Mammals of Costa Rica',
};

const mockRegionSpecies: RegionSpecies = {
  species: 1,
  group: 1,
  name: 'Common Kingfisher',
  scientific_name: 'Alcedo atthis',
  rarity: 2,
  native: false,
  type: 'S',
  rank: 123,
  sort_order_group: 234,
  sort_order_rank: 345,
  sort_order_taxonomy: 456,
  determination_requirements:
    'Determinatie alleen mogelijk na microscopisch onderzoek',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('regionSpeciesLists.list should fetch a list of region species lists', async () => {
  const mockResponse = [mockRegionSpeciesList];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const lists = await client.regionSpeciesLists.list();

  expect(lists).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/region-lists/');

  fetchSpy.mockRestore();
});

test('regionSpeciesLists.getSpecies should fetch species for a list', async () => {
  const mockResponse = [mockRegionSpecies];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const species = await client.regionSpeciesLists.getSpecies(1);

  expect(species).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/region-lists/1/species/');

  fetchSpy.mockRestore();
});
