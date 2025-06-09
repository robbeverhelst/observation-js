import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { MediaUploadResponse } from '../src/types';

const mockMediaUploadResponse: MediaUploadResponse = {
  name: 'temp_name.jpg',
  identify_result_url: null,
};

const mockMediaUploadResponseWithIdentify: MediaUploadResponse = {
  name: 'temp_name.jpg',
  identify_result_url: '/api/v1/nia/some-id',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('media.upload should upload a file', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockMediaUploadResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const blob = new Blob(['test-data']);
  const response = await client.media.upload(blob);

  expect(response).toEqual(mockMediaUploadResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/media-upload/');
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('POST');
  expect(fetchSpy.mock.calls[0][1]?.body).toBeInstanceOf(FormData);

  fetchSpy.mockRestore();
});

test('media.upload should upload a file with identify option', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockMediaUploadResponseWithIdentify), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const blob = new Blob(['test-data']);
  const response = await client.media.upload(blob, { identify: true });

  expect(response).toEqual(mockMediaUploadResponseWithIdentify);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/media-upload/');
  expect(url.searchParams.get('identify')).toBe('true');
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('POST');

  fetchSpy.mockRestore();
});
