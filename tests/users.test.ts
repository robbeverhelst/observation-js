import { expect, test, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../src/index';
import type { Terms, User } from '../src/types';

const API_BASE_URL = 'https://waarneming.nl/api/v1';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  avatar: null,
  observation_count: 10,
  species_count: 5,
  validation_count: 2,
};

const mockTerms: Terms = {
  terms: 'https://waarneming.nl/terms-of-use',
  privacy_policy: 'https://waarneming.nl/privacy-policy',
};

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore();
});

test('users.getTerms should fetch the terms and privacy policy', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockTerms), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const terms = await client.users.getTerms();

  expect(terms).toEqual(mockTerms);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.pathname).toBe('/api/v1/user/terms/');

  fetchSpy.mockRestore();
});

test('users.register should register a new user', async () => {
  const mockResponse = {
    name: 'Test User',
    email: 'test@example.com',
    permalink: 'https://waarneming.nl/user/123',
    country: 'NL',
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const userDetails = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };
  const registeredUser = await client.users.register(
    userDetails,
    'MyApp',
    '1.0',
  );

  expect(registeredUser).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  const body = new URLSearchParams(options?.body?.toString());

  expect(url.pathname).toBe('/api/v1/user/register/');
  expect(headers.get('User-Agent')).toBe('MyApp/1.0');
  expect(body.get('name')).toBe('Test User');
  expect(body.get('email')).toBe('test@example.com');

  fetchSpy.mockRestore();
});

test('users.resetPassword should send a password reset email', async () => {
  const mockResponse = { detail: 'Password reset e-mail has been sent.' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  const response = await client.users.resetPassword('test@example.com');

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const body = new URLSearchParams(options?.body?.toString());

  expect(url.pathname).toBe('/api/v1/user/password-reset/');
  expect(body.get('email')).toBe('test@example.com');

  fetchSpy.mockRestore();
});

test('users.getInfo should fetch the current authenticated user', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const user = await client.users.getInfo();

  expect(user).toEqual(mockUser);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/user/info/');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('users.updateInfo should update the user profile', async () => {
  const updatedUser = { ...mockUser, name: 'Updated Name' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const user = await client.users.updateInfo({ name: 'Updated Name' });

  expect(user).toEqual(updatedUser);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  const body = new URLSearchParams(options?.body?.toString());

  expect(url.pathname).toBe('/api/v1/user/info/');
  expect(headers.get('Authorization')).toBe('Bearer test-token');
  expect(body.get('name')).toBe('Updated Name');

  fetchSpy.mockRestore();
});

test('users.resendEmailConfirmation should resend the confirmation email', async () => {
  const mockResponse = { detail: 'Email confirmation sent.' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.users.resendEmailConfirmation();

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/user/resend-email-confirmation/');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('users.getStats should fetch user statistics', async () => {
  const mockResponse = {
    '2023-01-01': 10,
    '2023-01-02': 5,
  };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const stats = await client.users.getStats({ aggregation: 'day' });

  expect(stats).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/user/stats/observations/');
  expect(url.searchParams.get('aggregation')).toBe('day');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('users.getMagicLoginLink should fetch a magic login link', async () => {
  const mockResponse = { sesame: 'magic-key-123' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.users.getMagicLoginLink();

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/auth/magic-login-link/');
  expect(options?.method).toBe('POST');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('users.getAvatar should fetch the user avatar URL', async () => {
  const mockResponse = { avatar: 'https://example.com/avatar.jpg' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.users.getAvatar();

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/user/avatar/');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});

test('users.updateAvatar should upload a new avatar', async () => {
  const mockResponse = { avatar: 'https://example.com/new-avatar.jpg' };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const avatarBlob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
  const response = await client.users.updateAvatar(avatarBlob);

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);
  const body = options?.body as FormData;

  expect(url.pathname).toBe('/api/v1/user/avatar/');
  expect(options?.method).toBe('PUT');
  expect(headers.get('Authorization')).toBe('Bearer test-token');
  expect(body.get('avatar')).not.toBeNull();

  fetchSpy.mockRestore();
});

test('users.deleteAvatar should delete the user avatar', async () => {
  const mockResponse = { avatar: null };
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  const client = new ObservationClient();
  client.setAccessToken('test-token');
  const response = await client.users.deleteAvatar();

  expect(response).toEqual(mockResponse);
  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  const options = fetchSpy.mock.calls[0][1];
  const headers = new Headers(options?.headers);

  expect(url.pathname).toBe('/api/v1/user/avatar/');
  expect(options?.method).toBe('DELETE');
  expect(headers.get('Authorization')).toBe('Bearer test-token');

  fetchSpy.mockRestore();
});
