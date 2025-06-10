import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { RegionSpeciesList, Species } from '../../src/types';

const mockSpecies: Species = {
  id: 1,
  name: 'Test Species',
  scientific_name: 'Species testus',
  group: 1,
  group_name: 'Birds',
  rarity: 1,
  rarity_text: 'Common',
  type: 'bird',
  status: 1,
  url: 'https://example.com/species/1',
  photos: [],
  sounds: [],
  name_vernacular: null,
  name_vernacular_language: null,
};

const mockRegionSpeciesList: RegionSpeciesList = {
  id: 1,
  species: mockSpecies,
  date: '2023-01-01',
  first_observation_date: '2023-01-01',
  last_observation_date: '2023-01-01',
  observation_count: 10,
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
  const mockResponse = [mockSpecies];
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
