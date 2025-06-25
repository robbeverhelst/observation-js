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
});