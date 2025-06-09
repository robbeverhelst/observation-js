import { Badges } from '../lib/badges';
import { Challenges } from '../lib/challenges';
import { Countries } from '../lib/countries';
import { Exports } from '../lib/exports';
import { Groups } from '../lib/groups';
import { Languages } from '../lib/languages';
import { Locations } from '../lib/locations';
import { Lookups } from '../lib/lookups';
import { Media } from '../lib/media';
import { Nia } from '../lib/nia';
import { Observations } from '../lib/observations';
import { Regions } from '../lib/regions';
import { RegionSpeciesLists } from '../lib/regionSpeciesLists';
import { Sessions } from '../lib/sessions';
import { Species } from '../lib/species';
import { Users } from '../lib/users';
import type {
  ObservationClientOptions,
  PasswordGrantOptions,
  TokenResponse,
  Platform,
  CacheStore,
} from '../types';
import { ApiError, AuthenticationError } from './errors';
import { InMemoryCache } from './cache';
import { InterceptorManager } from './interceptors';

type FetchOptions = RequestInit & {
  params?: Record<string, string | number>;
  cache?: boolean | { ttl: number }; // `true` uses default TTL
};

const API_BASE_URL = '/api/v1';

const platformBaseUrls: Record<Platform, { production: string; test: string }> =
  {
    nl: {
      production: 'https://waarneming.nl',
      test: 'https://waarneming-test.nl',
    },
    be: {
      production: 'https://waarnemingen.be',
      test: 'https://waarnemingen-test.be',
    },
    org: {
      production: 'https://observation.org',
      test: 'https://observation-test.org',
    },
  };

export class ObservationClient {
  #accessToken: string | null = null;
  #refreshToken: string | null = null;
  #options: ObservationClientOptions | undefined;
  #language: string = 'en'; // Default to English
  #baseUrl: string;
  #cache: CacheStore;

  public readonly observations: Observations;
  public readonly species: Species;
  public readonly regions: Regions;
  public readonly locations: Locations;
  public readonly regionSpeciesLists: RegionSpeciesLists;
  public readonly users: Users;
  public readonly countries: Countries;
  public readonly badges: Badges;
  public readonly groups: Groups;
  public readonly exports: Exports;
  public readonly languages: Languages;
  public readonly lookups: Lookups;
  public readonly nia: Nia;
  public readonly media: Media;
  public readonly sessions: Sessions;
  public readonly challenges: Challenges;
  public readonly interceptors: {
    request: InterceptorManager<FetchOptions>;
    response: InterceptorManager<Response>;
  };

  /**
   * The main client for interacting with the Waarneming.nl API.
   *
   * @param options - Configuration options for the client.
   */
  constructor(options?: ObservationClientOptions) {
    this.#options = options;

    this.interceptors = {
      request: new InterceptorManager<FetchOptions>(),
      response: new InterceptorManager<Response>(),
    };

    this.#cache =
      options?.cache?.store ??
      new InMemoryCache();

    if (options?.baseUrl) {
      this.#baseUrl = options.baseUrl;
    } else if (options?.platform) {
      this.#baseUrl =
        platformBaseUrls[options.platform][
          options.test === false ? 'production' : 'test'
        ];
    } else {
      // Default to the test environment for the default platform 'nl'
      this.#baseUrl = platformBaseUrls['nl']['test'];
    }

    this.observations = new Observations(this);
    this.species = new Species(this);
    this.regions = new Regions(this);
    this.locations = new Locations(this);
    this.regionSpeciesLists = new RegionSpeciesLists(this);
    this.users = new Users(this);
    this.countries = new Countries(this);
    this.badges = new Badges(this);
    this.groups = new Groups(this);
    this.exports = new Exports(this);
    this.languages = new Languages(this);
    this.lookups = new Lookups(this);
    this.nia = new Nia(this);
    this.media = new Media(this);
    this.sessions = new Sessions(this);
    this.challenges = new Challenges(this);
  }

  /**
   * Sets the language for the `Accept-Language` header in all subsequent API requests.
   * The default language is 'en'.
   *
   * @param language - The two-letter language code (e.g., 'nl', 'en', 'de').
   */
  public setLanguage(language: string) {
    this.#language = language;
  }

  /**
   * Gets the base URL for the API.
   * @returns The base URL.
   * @internal
   */
  public getApiBaseUrl(): string {
    return `${this.#baseUrl}${API_BASE_URL}`;
  }

  /**
   * Generates the authorization URL for the OAuth2 Authorization Code Grant flow.
   * The user should be redirected to this URL to authorize the application.
   *
   * @param state - A random string to protect against CSRF attacks.
   * @param scope - An array of scopes the application is requesting.
   * @returns The full authorization URL to redirect the user to.
   * @throws {Error} If the client options (clientId, redirectUri) are not configured.
   */
  public getAuthorizationUrl(state: string, scope: string[]): string {
    if (!this.#options) {
      throw new Error('Client options are not set.');
    }
    const urlParams = new URLSearchParams({
      response_type: 'code',
      client_id: this.#options.clientId,
      redirect_uri: this.#options.redirectUri,
      scope: scope.join(' '),
      state: state,
    });
    return `${this.#baseUrl}/accounts/oauth2/authorize/?${urlParams.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token using the Authorization Code Grant flow.
   *
   * @param code - The authorization code received from the callback URL after user authorization.
   * @returns A promise that resolves to the token response from the API.
   * @throws {AuthenticationError} If the token request fails.
   * @throws {Error} If the client options are not configured.
   */
  public async getAccessToken(code: string): Promise<TokenResponse> {
    if (!this.#options) {
      throw new Error('Client options are not set.');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.#options.redirectUri,
      client_id: this.#options.clientId,
      client_secret: this.#options.clientSecret,
    });

    const response = await fetch(`${this.#baseUrl}/accounts/oauth2/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new AuthenticationError(response, errorBody);
    }

    const tokenData = (await response.json()) as TokenResponse;
    this.#accessToken = tokenData.access_token;
    this.#refreshToken = tokenData.refresh_token;
    return tokenData;
  }

  /**
   * Fetches an access token using the Resource Owner Password Credentials Grant.
   * Use this grant type only for trusted applications.
   *
   * @param options - The credentials for the password grant.
   * @returns A promise that resolves to the token response.
   * @throws {AuthenticationError} If the token request fails.
   */
  public async getAccessTokenWithPassword(
    options: PasswordGrantOptions
  ): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: options.clientId,
      username: options.email,
      password: options.password,
    });

    if (options.clientSecret) {
      body.set('client_secret', options.clientSecret);
    }

    const response = await fetch(`${this.#baseUrl}/accounts/oauth2/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new AuthenticationError(response, errorBody);
    }

    const tokenData = (await response.json()) as TokenResponse;
    this.#accessToken = tokenData.access_token;
    this.#refreshToken = tokenData.refresh_token;
    return tokenData;
  }

  /**
   * Refreshes an expired access token using a refresh token.
   *
   * @returns A promise that resolves to the new token response.
   * @throws {AuthenticationError} If the refresh token request fails.
   * @throws {Error} If the refresh token or client options are not available.
   */
  public async refreshAccessToken(): Promise<TokenResponse> {
    if (!this.#refreshToken) {
      throw new Error('No refresh token available.');
    }
    if (!this.#options) {
      throw new Error('Client options are not set.');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.#refreshToken,
      client_id: this.#options.clientId,
      client_secret: this.#options.clientSecret,
    });

    const response = await fetch(`${this.#baseUrl}/accounts/oauth2/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new AuthenticationError(response, errorBody);
    }

    const tokenData = (await response.json()) as TokenResponse;
    this.#accessToken = tokenData.access_token;
    this.#refreshToken = tokenData.refresh_token;
    return tokenData;
  }

  /**
   * Manually sets the access token for the client to use in subsequent authenticated requests.
   *
   * @param token - The access token.
   */
  public setAccessToken(token: string) {
    this.#accessToken = token;
  }

  /**
   * Checks if an access token is currently set on the client.
   *
   * @returns `true` if an access token is set, `false` otherwise.
   */
  public hasAccessToken(): boolean {
    return this.#accessToken !== null;
  }

  private async _fetch<T>(
    endpoint: string,
    authenticate: boolean,
    options: FetchOptions = {},
  ): Promise<T> {
    // --- Caching Layer: GET ---
    const url = this.buildUrl(endpoint, options.params);
    const cacheKey = url.toString();
    const isCacheable = (options.method === 'GET' || !options.method) && this.#options?.cache?.enabled !== false;

    if (isCacheable && this.#cache.has(cacheKey)) {
      const cachedData = this.#cache.get<T>(cacheKey);
      if (cachedData) return cachedData;
    }

    // --- Interceptor Chain ---
    const chain: unknown[] = [
      this._coreRequest.bind(this, url, authenticate),
      undefined,
    ];

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor.onFulfilled, interceptor.onRejected);
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor.onFulfilled, interceptor.onRejected);
    });

    let promise: Promise<unknown> = Promise.resolve(options);

    while (chain.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      promise = promise.then(chain.shift() as any, chain.shift() as any);
    }

    // --- Final Response Handling & Caching Layer: SET ---
    return promise
      .then(response => this._handleResponse<T>(response as Response))
      .then(data => {
        if (isCacheable && options.cache) {
          const cacheOptions = this.#options?.cache;
          const defaultTTL = cacheOptions?.defaultTTL ?? 3600;
          let ttl: number | undefined;

          if (typeof options.cache === 'object' && options.cache.ttl) {
            ttl = options.cache.ttl;
          } else if (options.cache === true) {
            ttl = defaultTTL;
          }

          if (ttl) {
            this.#cache.set(cacheKey, data, ttl);
    }
        }
        return data;
      });
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): URL {
    let url: URL;
    if (endpoint.startsWith('http') || endpoint.startsWith('/api/')) {
      url = new URL(
        endpoint.startsWith('/') ? `${this.#baseUrl}${endpoint}` : endpoint,
      );
    } else {
      url = new URL(`${this.getApiBaseUrl()}/${endpoint}`);
    }

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, String(value));
      }
    }
    return url;
  }

  private async _coreRequest(
    url: URL,
    authenticate: boolean,
    options: FetchOptions,
  ): Promise<Response> {
    if (authenticate && !this.#accessToken) {
      throw new Error('Access token is not set. Please authenticate first.');
    }
    
    // params are already in the URL, so we can delete them from options
      delete options.params;

    const headers = new Headers(options.headers);
    if (authenticate) {
      headers.set('Authorization', `Bearer ${this.#accessToken}`);
    }
    headers.set('Accept-Language', this.#language);
    headers.set('Accept', 'application/json');

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    return fetch(url.toString(), fetchOptions);
  }

  private async _handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const body = await response.text();
      let errorBody: unknown = null;
      try {
        errorBody = body ? JSON.parse(body) : null;
      } catch {
        errorBody = body;
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(response, errorBody);
      }
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response,
        errorBody,
      );
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  }

  /**
   * Makes an authenticated request to the API.
   * An access token must be set via `setAccessToken` or by using one of the authentication flows.
   *
   * @param endpoint - The API endpoint to request.
   * @param options - Optional request options, including URL parameters.
   * @returns A promise that resolves to the JSON response.
   * @throws {AuthenticationError} If the access token is not set or the request is unauthorized.
   * @throws {ApiError} If the API request fails for other reasons.
   */
  public request = async <T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> => {
    return this._fetch<T>(endpoint, true, options);
  };

  /**
   * Makes a public (unauthenticated) request to the API.
   *
   * @param endpoint - The API endpoint to request.
   * @param options - Optional request options, including URL parameters.
   * @returns A promise that resolves to the JSON response.
   * @throws {ApiError} If the API request fails.
   */
  public publicRequest = async <T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> => {
    return this._fetch<T>(endpoint, false, options);
  };
} 