import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Region, RegionType } from '../src/types';

const mockRegion: Region = {
  id: 1,
  name: 'Test Region',
  slug: 'test-region',
  centroid: {
    type: 'Point',
    coordinates: [1, 1],
  },
  parent: null,
};

const mockRegionType: RegionType = {
  id: 1,
  name: 'Test Region Type',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('regions.list should fetch a list of regions', async () => {
  const mockResponse = [mockRegion];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const regions = await client.regions.list();

  expect(regions).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/regions/');

  fetchSpy.mockRestore();
});

test('regions.listTypes should fetch a list of region types', async () => {
  const mockResponse = [mockRegionType];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const regionTypes = await client.regions.listTypes();

  expect(regionTypes).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/region-types/');

  fetchSpy.mockRestore();
});
