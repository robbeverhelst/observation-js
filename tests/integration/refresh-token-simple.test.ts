import { describe, test, expect, spyOn, afterEach } from 'bun:test';
import { ObservationClient } from '../../src/core/client';
import { AuthenticationError } from '../../src/core/errors';

describe('Automatic Token Refresh', () => {
  afterEach(() => {
    spyOn(globalThis, 'fetch').mockRestore();
  });

  test('should have refresh interceptor enabled by default', () => {
    const client = new ObservationClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });

    // Should have interceptors initialized
    expect(client.interceptors).toBeDefined();
    expect(client.interceptors.response).toBeDefined();
  });

  test('should have token management methods available', () => {
    const client = new ObservationClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });

    expect(client.hasAccessToken()).toBe(false);
    expect(client.hasRefreshToken()).toBe(false);
    expect(client.getCurrentAccessToken()).toBe(null);
    
    client.setAccessToken('test-access-token');
    client.setRefreshToken('test-refresh-token');
    
    expect(client.hasAccessToken()).toBe(true);
    expect(client.hasRefreshToken()).toBe(true);
    expect(client.getCurrentAccessToken()).toBe('test-access-token');
  });

  test('should be able to disable automatic token refresh', () => {
    const client = new ObservationClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
      autoRefreshToken: false,
    });

    client.setAccessToken('expired-token');
    client.setRefreshToken('valid-refresh-token');

    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Token has expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(client.request('test-endpoint')).rejects.toThrow(AuthenticationError);
  });

  test('interceptor should handle non-auth errors correctly', async () => {
    const client = new ObservationClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });

    client.setAccessToken('valid-token');

    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(client.request('test-endpoint')).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('automatic refresh should be transparent to users', async () => {
    const client = new ObservationClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });

    // The refresh interceptor should be automatically set up
    // and handle 401 errors transparently without user intervention
    expect(client.hasAccessToken()).toBe(false);
    expect(client.hasRefreshToken()).toBe(false);
    
    // Users can set tokens manually
    client.setAccessToken('some-token');
    client.setRefreshToken('some-refresh-token');
    
    expect(client.hasAccessToken()).toBe(true);
    expect(client.hasRefreshToken()).toBe(true);
  });

  test('concurrent 401s during a refresh all retry and resolve with real data', async () => {
    const client = new ObservationClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });

    client.setAccessToken('expired-token');
    client.setRefreshToken('valid-refresh-token');

    let refreshCalls = 0;
    spyOn(globalThis, 'fetch').mockImplementation((async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const headers = new Headers(init?.headers);

      if (url.includes('oauth2/token')) {
        refreshCalls++;
        return new Response(
          JSON.stringify({
            access_token: 'new-token',
            refresh_token: 'new-refresh-token',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: '',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }

      if (headers.get('Authorization') === 'Bearer expired-token') {
        return new Response(JSON.stringify({ detail: 'Token has expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Retried request carrying the refreshed token.
      return new Response(JSON.stringify({ ok: true, url }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch);

    const [a, b] = await Promise.all([
      client.request<{ ok: boolean }>('endpoint-a'),
      client.request<{ ok: boolean }>('endpoint-b'),
    ]);

    // Both concurrent requests must resolve with their real retried payload,
    // not `null` (the previous queue bug resolved queued requests with null).
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    // Only a single refresh should occur for concurrent 401s.
    expect(refreshCalls).toBe(1);
  });
});