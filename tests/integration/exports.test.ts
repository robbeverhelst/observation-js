import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { Export, ExportStartResponse } from '../../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockExport: Export = {
  id: 1,
  is_ready: true,
  expires: '2023-01-01T12:00:00Z',
  description: 'Test export',
  filesize: 12345,
  message: '',
  download_url: 'https://example.com/export.zip',
};

const mockExportStartResponse: ExportStartResponse = {
  id: 2,
  message: 'Export started',
  state_url: `${API_BASE_URL}/exports/2`,
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('exports.list should fetch a list of exports', async () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockExport],
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const exports = await client.exports.list();

  expect(exports).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/exports/');

  fetchSpy.mockRestore();
});

test('exports.get should fetch a single export', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockExport), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const exportData = await client.exports.get(1);

  expect(exportData).toEqual(mockExport);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/exports/1');

  fetchSpy.mockRestore();
});

test('exports.start should start a new export', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockExportStartResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.exports.start({
    type: 'USER_OBSERVATIONS',
    export_format: 'csv',
    date_after: '2023-01-01',
  });

  expect(response).toEqual(mockExportStartResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/exports/');
  const body = await (fetchSpy.mock.calls[0][1] as RequestInit).body;
  expect(body).toBe(
    'type=USER_OBSERVATIONS&export_format=csv&date_after=2023-01-01',
  );

  fetchSpy.mockRestore();
});
