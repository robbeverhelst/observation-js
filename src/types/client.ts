export type Platform = 'nl' | 'be' | 'org';

export interface CacheStore {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttl: number): void; // ttl in seconds
  delete(key: string): void;
  has(key: string): boolean;
}

export interface ObservationClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl?: string;
  platform?: Platform;
  test?: boolean;
  /**
   * Configuration for the in-memory cache.
   */
  cache?: {
    /**
     * Set to `false` to disable the cache entirely.
     * @default true
     */
    enabled?: boolean;
    /**
     * The default Time-to-Live (TTL) for all cacheable requests, in seconds.
     * This can be overridden on a per-request basis.
     * @default 3600 (1 hour)
     */
    defaultTTL?: number;
    /**
     * For advanced use, you can provide your own cache store.
     * The provided object must conform to the `CacheStore` interface.
     * If not provided, the client will use a default in-memory store.
     */
    store?: CacheStore;
  };
}

export interface PasswordGrantOptions {
  clientId: string;
  clientSecret?: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: string;
  refresh_token: string;
}
