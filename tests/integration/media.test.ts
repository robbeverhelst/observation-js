import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/index';
import type { MediaUploadResponse, MediaItem, Paginated } from '../../src/types';

const mockMediaUploadResponse: MediaUploadResponse = {
  name: 'temp_name.jpg',
  identify_result_url: null,
};

const mockMediaUploadResponseWithIdentify: MediaUploadResponse = {
  name: 'temp_name.jpg',
  identify_result_url: '/api/v1/nia/some-id',
};

const mockMedia: MediaItem = {
  id: 1,
  file: 'media_file.jpg',
  url: 'https://example.com/media/1.jpg',
  attribution: 'Test User',
  type: 'photo',
  created_at: '2023-01-01T12:00:00Z',
  observation_id: 123,
};

const mockSimilarMediaResponse: Paginated<MediaItem> = {
  count: 2,
  next: null,
  previous: null,
  results: [
    mockMedia,
    {
      id: 2,
      file: 'media_file2.jpg',
      url: 'https://example.com/media/2.jpg',
      attribution: 'Another User',
      type: 'photo',
      created_at: '2023-01-02T12:00:00Z',
      observation_id: 124,
    },
  ],
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

test('media.upload should upload a file without identify option (default)', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockMediaUploadResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const blob = new Blob(['test-data']);
  const response = await client.media.upload(blob, {});

  expect(response).toEqual(mockMediaUploadResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/media-upload/');
  expect(url.searchParams.get('identify')).toBeNull();
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('media.upload should upload a file with identify set to false', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockMediaUploadResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const blob = new Blob(['test-data']);
  const response = await client.media.upload(blob, { identify: false });

  expect(response).toEqual(mockMediaUploadResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/media-upload/');
  expect(url.searchParams.get('identify')).toBeNull();
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('POST');

  fetchSpy.mockRestore();
});

test('media.getSimilar should fetch similar media for a given media ID', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSimilarMediaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const response = await client.media.getSimilar(123);

  expect(response).toEqual(mockSimilarMediaResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/media/similar/');
  expect(url.searchParams.get('model')).toBe('Media');
  expect(url.searchParams.get('pk')).toBe('123');
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('GET');

  fetchSpy.mockRestore();
});

test('media.getSimilar should work with different media IDs', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSimilarMediaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const response = await client.media.getSimilar(456);

  expect(response).toEqual(mockSimilarMediaResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/media/similar/');
  expect(url.searchParams.get('model')).toBe('Media');
  expect(url.searchParams.get('pk')).toBe('456');
  expect(fetchSpy.mock.calls[0][1]?.method).toBe('GET');

  fetchSpy.mockRestore();
});

test('media.getSimilar should handle empty results', async () => {
  const emptyResponse: Paginated<MediaItem> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(emptyResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const response = await client.media.getSimilar(999);

  expect(response).toEqual(emptyResponse);
  expect(response.results).toHaveLength(0);
  expect(response.count).toBe(0);

  fetchSpy.mockRestore();
});

test('media.getSimilar should handle paginated results', async () => {
  const paginatedResponse: Paginated<MediaItem> = {
    count: 100,
    next: 'https://api.example.com/media/similar/?page=2',
    previous: null,
    results: [mockMedia],
  };

  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(paginatedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const response = await client.media.getSimilar(123);

  expect(response).toEqual(paginatedResponse);
  expect(response.count).toBe(100);
  expect(response.next).toBe('https://api.example.com/media/similar/?page=2');
  expect(response.previous).toBeNull();
  expect(response.results).toHaveLength(1);

  fetchSpy.mockRestore();
});

test('media.upload should handle different blob types', async () => {
  const client = new ObservationClient();
  client.setAccessToken('test-token');
  
  // Test with different blob types separately to avoid body reuse issues
  const imageBlob = new Blob(['image-data'], { type: 'image/jpeg' });
  
  const fetchSpy1 = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockMediaUploadResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  await client.media.upload(imageBlob);
  expect(fetchSpy1.mock.calls[0][1]?.body).toBeInstanceOf(FormData);
  fetchSpy1.mockRestore();

  // Test second blob type
  const audioBlob = new Blob(['audio-data'], { type: 'audio/mp3' });
  
  const fetchSpy2 = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockMediaUploadResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  await client.media.upload(audioBlob);
  expect(fetchSpy2.mock.calls[0][1]?.body).toBeInstanceOf(FormData);
  fetchSpy2.mockRestore();
});

test('media.getSimilar should make authenticated request when token is set', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSimilarMediaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  await client.media.getSimilar(123);

  const options = fetchSpy.mock.calls[0][1] as RequestInit;
  const headers = new Headers(options.headers);
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('media.getSimilar should make unauthenticated request when no token is set', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockSimilarMediaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  await client.media.getSimilar(123);

  const options = fetchSpy.mock.calls[0][1] as RequestInit;
  const headers = new Headers(options.headers);
  expect(headers.get('Authorization')).toBeNull();

  fetchSpy.mockRestore();
});
